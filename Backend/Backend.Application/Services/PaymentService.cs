using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IAppDbContext _context;
    
        public PaymentService(IAppDbContext context)
        {
            _context = context;
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

            var payment = new Payment
            {
                BillId = billId,
                Amount = amount,
                Date = DateTime.UtcNow,
                Status = PaymentStatus.Pending,
                TransactionId = null 
            };

            _context.Payment.Add(payment);
            await _context.SaveChangesAsync(ct);

            return payment;
        }

        public async Task<Payment?> GetPaymentByIdAsync(int paymentId, CancellationToken ct)
        {
            // Этот метод просто получает платеж. Проверка владения происходит в контроллере.
            return await _context.Payment
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId, ct);
        }

        public async Task MarkAsPaidAsync(int paymentId, string transactionId, CancellationToken ct)
        {
            var payment = await _context.Payment.FindAsync(new object[] { paymentId }, ct)
                ?? throw new KeyNotFoundException("Платеж не найден.");
            
            payment.Status = PaymentStatus.Paid;
            payment.TransactionId = transactionId;
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Payment>> GetUserPaymentsAsync(int userId, CancellationToken ct)
        {
            return await _context.Payment
                .Include(p => p.Bill)
                .ThenInclude(b => b!.Account)
                .Where(p => p.Bill != null && p.Bill.Account != null && p.Bill.Account.UserId == userId)
                .OrderByDescending(p => p.Date)
                .ToListAsync(ct);
        }

        public async Task CancelPaymentAsync(int userId, int paymentId, CancellationToken ct)
        {
            var payment = await _context.Payment
                .Include(p => p.Bill)
                .ThenInclude(b => b!.Account)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId, ct)
                ?? throw new KeyNotFoundException("Платеж не найден.");

            if (payment.Bill?.Account?.UserId != userId)
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
    }
}