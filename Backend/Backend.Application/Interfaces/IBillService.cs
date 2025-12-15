using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IBillService
    {
        Task<Bill> CreateBillWithPdfAsync(Bill newBill, CancellationToken ct);
        Task<List<Bill>> GetUserBillsAsync(CancellationToken ct, int userId);
        Task<List<Bill>> GetAccountBillsAsync(CancellationToken ct, int userId, int accountId);
        Task<Bill> GetBillDetailsAsync(CancellationToken ct, int userId, int billId);
        Task<bool> ValidateUserAccessAsync(CancellationToken ct, int userId, int billId);
        Task<Bill?> GetBillByIdAsync(int billId);
        Task<string> ImportBillsAsync(IEnumerable<(string AccountNumber, Bill BillData)> data, CancellationToken ct);
    }
}