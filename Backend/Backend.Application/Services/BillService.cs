using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class BillService : IBillService
    {
        private readonly IAppDbContext _context;

        public BillService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Bill>> GetUserBillsAsync(CancellationToken ct, int userId)
        {
            return await _context.Bills
                .Include(b => b.Account) 
                .Where(b => b.Account != null && b.Account.UserId == userId)
                .OrderByDescending(b => b.Period) 
                .ToListAsync(ct);
        }

        public async Task<List<Bill>> GetAccountBillsAsync(CancellationToken ct, int userId, int accountId)
        {
            var hasAccess = await _context.Accounts
                .AnyAsync(a => a.AccountId == accountId && a.UserId == userId, ct);

            if (!hasAccess)
            {
                throw new KeyNotFoundException("Лицевой счет не найден или доступ запрещен.");
            }

            return await _context.Bills
                .Where(b => b.AccountId == accountId)
                .OrderByDescending(b => b.Period)
                .ToListAsync(ct);
        }

        public async Task<Bill> GetBillDetailsAsync(CancellationToken ct, int userId, int billId)
        {
            var bill = await _context.Bills
                .Include(b => b.BillItems) 
                .Include(b => b.Account) 
                .FirstOrDefaultAsync(b => b.BillId == billId, ct);

            if (bill == null)
            {
                throw new KeyNotFoundException("Счет не найден.");
            }

            if (bill.Account?.UserId != userId)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к просмотру этого счета.");
            }

            return bill;
        }

        public async Task<bool> ValidateUserAccessAsync(CancellationToken ct, int userId, int billId)
        {
            return await _context.Bills
                .Include(b => b.Account)
                .AnyAsync(b => b.BillId == billId && b.Account != null && b.Account.UserId == userId, ct);
        }
    }
}