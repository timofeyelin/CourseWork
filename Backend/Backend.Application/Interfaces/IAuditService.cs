namespace Backend.Application.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(int? userId, string actionType, string entityName, string entityId, string details, CancellationToken ct);
        Task<List<Domain.Entities.AuditLog>> GetLogsAsync(int page, int pageSize, DateTime? fromDate, DateTime? toDate, string? search, CancellationToken ct);
        Task<int> GetTotalCountAsync(DateTime? fromDate, DateTime? toDate, string? search, CancellationToken ct);
    }
}
