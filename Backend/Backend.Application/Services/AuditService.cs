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

        private IQueryable<AuditLog> ApplyFilters(IQueryable<AuditLog> query, DateTime? fromDate, DateTime? toDate, string? search)
        {
            if (fromDate.HasValue)
            {
                query = query.Where(x => x.Timestamp >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                // Включаем весь день toDate
                var endOfDay = toDate.Value.Date.AddDays(1);
                query = query.Where(x => x.Timestamp < endOfDay);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(x => 
                    x.ActionType.ToLower().Contains(searchLower) ||
                    x.EntityName.ToLower().Contains(searchLower) ||
                    x.EntityId.ToLower().Contains(searchLower) ||
                    (x.Details != null && x.Details.ToLower().Contains(searchLower))
                );
            }

            return query;
        }

        public async Task<List<AuditLog>> GetLogsAsync(int page, int pageSize, DateTime? fromDate, DateTime? toDate, string? search, CancellationToken ct)
        {
            var query = _context.AuditLogs.AsQueryable();
            query = ApplyFilters(query, fromDate, toDate, search);

            return await query
                .OrderByDescending(x => x.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);
        }

        public async Task<int> GetTotalCountAsync(DateTime? fromDate, DateTime? toDate, string? search, CancellationToken ct)
        {
            var query = _context.AuditLogs.AsQueryable();
            query = ApplyFilters(query, fromDate, toDate, search);

            return await query.CountAsync(ct);
        }
    }
}
