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
            var hasAccess = await _billService.ValidateUserAccessAsync(ct, userId, billId);
            if (!hasAccess)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к этому счету для создания платежа.");
            }

            var bill = await _context.Bills.FindAsync(new object[] { billId }, ct) 
                ?? throw new KeyNotFoundException("Счет не найден.");

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
                TransactionId = "TEST_" + Guid.NewGuid().ToString()
            };

            _context.Payment.Add(payment);
            await _context.SaveChangesAsync(ct);

            return payment;
        }

        public async Task<PaymentStatus> GetPaymentStatusAsync(int userId, int paymentId, CancellationToken ct)
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

            return payment.Status;
        }

        public async Task MarkAsPaidAsync(int paymentId, CancellationToken ct)
        {
            var payment = await _context.Payment.FindAsync(new object[] { paymentId }, ct)
                ?? throw new KeyNotFoundException("Платеж не найден.");

            payment.Status = PaymentStatus.Paid;
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