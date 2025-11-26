using Backend.Domain.Entities;
using Backend.Domain.Enums;

namespace Backend.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Payment> CreatePaymentAsync(int userId, int billId, decimal amount, CancellationToken ct);
        Task<PaymentStatus> GetPaymentStatusAsync(int userId, int paymentId, CancellationToken ct);
        Task MarkAsPaidAsync(int paymentId, CancellationToken ct);
        Task<List<Payment>> GetUserPaymentsAsync(int userId, CancellationToken ct);
        Task CancelPaymentAsync(int userId, int paymentId, CancellationToken ct);
    }
}