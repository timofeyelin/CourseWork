using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(int? userId, string actionType, string entityName, string entityId, string details, CancellationToken ct);
        Task<List<Domain.Entities.AuditLog>> GetLogsAsync(int page, int pageSize, CancellationToken ct);
        Task<int> GetTotalCountAsync(CancellationToken ct);
    }
}
