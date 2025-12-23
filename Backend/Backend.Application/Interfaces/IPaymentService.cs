using Backend.Application.Dtos;
using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Payment> CreatePaymentAsync(int userId, int billId, decimal amount, CancellationToken ct);
        Task<Payment?> GetPaymentByIdAsync(int paymentId, CancellationToken ct);
        Task MarkAsPaidAsync(int paymentId, string transactionId,CancellationToken ct);
        Task<List<Payment>> GetUserPaymentsAsync(int userId, CancellationToken ct);
        Task CancelPaymentAsync(int userId, int paymentId, CancellationToken ct);
        Task<BalanceDetailsDto> GetBalanceAsync(int userId, int? accountId, CancellationToken ct);
        Task<Payment> InitPaymentAsync(int userId, int? accountId, decimal amount, string method, CancellationToken ct);
    }
}