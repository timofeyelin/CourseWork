using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace Backend.Application.Services
{
    public class AuditService : IAuditService
    {
        private readonly IAppDbContext _context;

        public AuditService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(int? userId, string actionType, string entityName, string entityId, string details, CancellationToken ct)
        {
            var log = new AuditLog
            {
                UserId = userId,
                ActionType = actionType,
                EntityName = entityName,
                EntityId = entityId,
                Details = details,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<AuditLog>> GetLogsAsync(int page, int pageSize, CancellationToken ct)
        {
            return await _context.AuditLogs
                .OrderByDescending(x => x.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);
        }

        public async Task<int> GetTotalCountAsync(CancellationToken ct)
        {
            return await _context.AuditLogs.CountAsync(ct);
        }
    }
}
