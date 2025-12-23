using Backend.Application.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IAppDbContext _context;
        private readonly IBillService _billService;
    
        public PaymentService(IAppDbContext context, IBillService billService)
        {
            _context = context;
            _billService = billService;
        }

        public async Task<Payment> CreatePaymentAsync(int userId, int billId, decimal amount, CancellationToken ct)
        {
            var bill = await _context.Bills
                .Include(b => b.Account)
                .FirstOrDefaultAsync(b => b.BillId == billId, ct)
                ?? throw new KeyNotFoundException("Счет не найден.");

            if (bill.Account?.UserId != userId)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к этому счету для создания платежа.");
            }


            if (amount <= 0 || amount > bill.TotalAmount)
            {
                throw new ArgumentException("Сумма платежа должна быть больше нуля и не может превышать сумму счета.");
            }

            var billAccountId = bill.Account?.AccountId;
            if (billAccountId == null)
            {
                throw new InvalidOperationException("Лицевой счет для квитанции не найден.");
            }

            // В системе баланс ведется по лицевым счетам, но для пользователя это единый "кошелек".
            // Поэтому при оплате квитанции проверяем суммарный баланс по всем лицевым счетам пользователя.
            var userAccountIds = await _context.Accounts
                .Where(a => a.UserId == userId)
                .Select(a => a.AccountId)
                .ToListAsync(ct);

            if (!userAccountIds.Any())
            {
                throw new KeyNotFoundException("Лицевой счет не найден.");
            }

            var balances = await _context.AccountBalances
                .Where(ab => userAccountIds.Contains(ab.AccountId))
                .ToListAsync(ct);

            var totalBalance = balances.Sum(b => b.Balance);
            if (totalBalance < amount)
            {
                throw new ArgumentException("Недостаточно средств на счёте.");
            }

            var payment = new Payment
            {
                BillId = billId,
                Amount = amount,
                Date = DateTime.UtcNow,
                Status = PaymentStatus.Paid,
                TransactionId = Guid.NewGuid().ToString()
            };

            _context.Payment.Add(payment);

            // Списание делаем из общего кошелька пользователя: сначала с лицевого счета квитанции,
            // затем с остальных счетов с положительным балансом.
            decimal remaining = amount;

            var orderedBalances = balances
                .OrderByDescending(b => b.AccountId == billAccountId.Value)
                .ThenByDescending(b => b.Balance)
                .ToList();

            foreach (var accBal in orderedBalances)
            {
                if (remaining <= 0) break;
                if (accBal.Balance <= 0) continue;

                var debit = Math.Min(accBal.Balance, remaining);
                accBal.Balance -= debit;
                accBal.UpdatedAt = DateTime.UtcNow;
                if (accBal.Balance >= 0) accBal.Debt = 0;
                remaining -= debit;
            }

            if (remaining > 0)
            {
                // На всякий случай (например, если в БД нет строк баланса по счетам) — не допускаем
                // списание, если не смогли распределить сумму по балансам.
                throw new InvalidOperationException("Не удалось списать средства: баланс не согласован.");
            }

            await _context.SaveChangesAsync(ct);

            try
            {
                await _billService.RegenerateBillPdfAsync(billId, ct);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to regenerate PDF after payment: {ex.Message}");
            }

            return payment;
        }

        public async Task<Payment?> GetPaymentByIdAsync(int paymentId, CancellationToken ct)
        {
            return await _context.Payment
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId, ct);
        }

        public async Task MarkAsPaidAsync(int paymentId, string transactionId, CancellationToken ct)
        {
            var payment = await _context.Payment.FindAsync(new object[] { paymentId }, ct)
                ?? throw new KeyNotFoundException("Платеж не найден.");
            
            if (payment.Status == PaymentStatus.Paid)
            {
                return;
            }

            payment.Status = PaymentStatus.Paid;
            payment.TransactionId = transactionId;

            if (payment.AccountId != null && payment.BillId == null)
            {
                var accBal = await _context.AccountBalances.FirstOrDefaultAsync(ab => ab.AccountId == payment.AccountId, ct);
                if (accBal != null)
                {
                    accBal.Balance += payment.Amount;
                    accBal.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    _context.AccountBalances.Add(new Domain.Entities.AccountBalance
                    {
                        AccountId = payment.AccountId.Value,
                        Balance = payment.Amount,
                        Debt = 0,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            if (payment.BillId != null)
            {
                try
                {
                    await _billService.RegenerateBillPdfAsync(payment.BillId.Value, ct);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to regenerate PDF after marking payment paid: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Payment>> GetUserPaymentsAsync(int userId, CancellationToken ct)
        {
            return await _context.Payment
                .Include(p => p.Bill)
                .Include(p => p.Account)
                .Where(p => (p.Account != null && p.Account.UserId == userId) || (p.Bill != null && p.Bill.Account != null && p.Bill.Account.UserId == userId))
                .OrderByDescending(p => p.Date)
                .ToListAsync(ct);
        }

        public async Task CancelPaymentAsync(int userId, int paymentId, CancellationToken ct)
        {
            var payment = await _context.Payment
                .Include(p => p.Bill)
                .ThenInclude(b => b!.Account)
                .Include(p => p.Account)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId, ct)
                ?? throw new KeyNotFoundException("Платеж не найден.");

            if ((payment.Account?.UserId != userId) && (payment.Bill?.Account?.UserId != userId))
            {
                throw new UnauthorizedAccessException("У вас нет доступа к этому платежу.");
            }

            if (payment.Status != PaymentStatus.Pending)
            {
                throw new InvalidOperationException("Отменить можно только платеж в статусе 'Ожидание'.");
            }

            payment.Status = PaymentStatus.Cancelled;
            await _context.SaveChangesAsync(ct);
        }

        public async Task<BalanceDetailsDto> GetBalanceAsync(int userId, CancellationToken ct)
        {
            var accounts = await _context.Accounts
                .Include(a => a.Bills)
                .ThenInclude(b => b.Payment)
                .Where(a => a.UserId == userId)
                .ToListAsync(ct);

            if (!accounts.Any())
            {
                 return new BalanceDetailsDto { Balance = 0, Debt = 0 };
            }

            var accountIds = accounts.Select(a => a.AccountId).ToList();

            decimal totalDebt = 0;
            foreach (var account in accounts)
            {
                foreach (var bill in account.Bills)
                {
                    var paid = bill.Payment.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.Amount);
                    var debt = bill.TotalAmount - paid;
                    if (debt > 0)
                    {
                        totalDebt += debt;
                    }
                }
            }

            var balances = await _context.AccountBalances
                .Where(ab => accountIds.Contains(ab.AccountId))
                .ToListAsync(ct);

            decimal walletBalance;

            if (balances.Any())
            {
                walletBalance = balances.Sum(b => b.Balance);
            }
            else
            {
                var payments = await _context.Payment
                    .Include(p => p.Bill)
                    .Where(p => (p.AccountId != null && accountIds.Contains(p.AccountId.Value)) || 
                                (p.Bill != null && accountIds.Contains(p.Bill.AccountId)))
                    .Where(p => p.Status == PaymentStatus.Paid)
                    .ToListAsync(ct);

                var topUps = payments
                    .Where(p => p.BillId == null)
                    .Sum(p => p.Amount);

                var billPaymentsTotal = payments
                    .Where(p => p.BillId != null)
                    .Sum(p => p.Amount);

                walletBalance = topUps - billPaymentsTotal;
            }

            return new BalanceDetailsDto
            {
                Balance = walletBalance,
                Debt = totalDebt
            };
        }

        public async Task<Payment> InitPaymentAsync(int userId, decimal amount, string method, CancellationToken ct)
        {
             var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.UserId == userId, ct)
                ?? throw new KeyNotFoundException("Лицевой счет не найден.");

            if (amount <= 0)
            {
                throw new ArgumentException("Сумма должна быть больше нуля.");
            }

            var payment = new Payment
            {
                AccountId = account.AccountId,
                Amount = amount,
                Date = DateTime.UtcNow,
                Status = PaymentStatus.Paid,
                IsTest = true 
            };

            _context.Payment.Add(payment);
            var accBal = await _context.AccountBalances.FirstOrDefaultAsync(ab => ab.AccountId == account.AccountId, ct);
            if (accBal != null)
            {
                accBal.Balance += amount;
                accBal.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _context.AccountBalances.Add(new Domain.Entities.AccountBalance
                {
                    AccountId = account.AccountId,
                    Balance = amount,
                    Debt = 0,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync(ct);

            return payment;
        }
    }
}