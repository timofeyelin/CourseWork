using Backend.Application.Interfaces;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public sealed class AdminAnalyticsService : IAdminAnalyticsService
    {
        private readonly IAppDbContext _context;

        public AdminAnalyticsService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminAnalyticsResult> GetAnalyticsAsync(DateTime from, DateTime to, CancellationToken ct)
        {
            if (from.Date > to.Date)
                throw new ArgumentException("'from' must be <= 'to'.");

            var fromDate = DateTime.SpecifyKind(from.Date, DateTimeKind.Utc);
            var toDate = DateTime.SpecifyKind(to.Date, DateTimeKind.Utc);
        
            var toExclusive = toDate.AddDays(1); // Уже будет Utc

            var fromPeriod = DateOnly.FromDateTime(fromDate);
            var toPeriod = DateOnly.FromDateTime(toDate);

            var totalChargedInPeriod = await _context.Bills
                .AsNoTracking()
                .Where(b => b.Period >= fromPeriod && b.Period <= toPeriod)
                .SumAsync(b => (decimal?)b.TotalAmount, ct) ?? 0m;

            var totalCollectedInPeriod = await _context.Payment
                .AsNoTracking()
                .Where(p =>
                    !p.IsTest &&
                    p.Status == PaymentStatus.Paid &&
                    p.Date >= fromDate &&
                    p.Date < toExclusive)
                .SumAsync(p => (decimal?)p.Amount, ct) ?? 0m;

            var collectionPercent = totalChargedInPeriod <= 0m
                ? 0m
                : Math.Round((totalCollectedInPeriod / totalChargedInPeriod) * 100m, 2);

            var totalChargedTotal = await _context.Bills
                .AsNoTracking()
                .Where(b => b.Period <= toPeriod)
                .SumAsync(b => (decimal?)b.TotalAmount, ct) ?? 0m;

            var totalCollectedTotal = await _context.Payment
                .AsNoTracking()
                .Where(p =>
                    !p.IsTest &&
                    p.Status == PaymentStatus.Paid &&
                    p.Date < toExclusive)
                .SumAsync(p => (decimal?)p.Amount, ct) ?? 0m;

            var totalDebt = totalChargedTotal - totalCollectedTotal;
            if (totalDebt < 0) totalDebt = 0;

            var rawPoints = await _context.Payment
                .AsNoTracking()
                .Where(p =>
                    !p.IsTest &&
                    p.Status == PaymentStatus.Paid &&
                    p.Date >= fromDate &&
                    p.Date < toExclusive)
                .GroupBy(p => p.Date.Date)
                .Select(g => new { Date = g.Key, Amount = g.Sum(x => x.Amount) })
                .ToListAsync(ct);

            var pointsMap = rawPoints.ToDictionary(x => x.Date, x => x.Amount);
            var finalPoints = new List<AnalyticsPointModel>();

            for (var d = fromDate; d < toExclusive; d = d.AddDays(1))
            {
                pointsMap.TryGetValue(d, out var amount);
                finalPoints.Add(new AnalyticsPointModel { Date = d, Amount = amount });
            }

            var accountsData = await _context.Accounts
                .AsNoTracking()
                .Include(a => a.User)
                .Include(a => a.Bills)
                    .ThenInclude(b => b.Payment)
                .Where(a => a.Bills.Any())
                .ToListAsync(ct);

            var topDebtors = accountsData
                .Select(a =>
                {
                    var charged = a.Bills
                        .Where(b => b.Period <= toPeriod)
                        .Sum(b => b.TotalAmount);

                    var paid = a.Bills
                        .Where(b => b.Period <= toPeriod)
                        .SelectMany(b => b.Payment)
                        .Where(p =>
                            !p.IsTest &&
                            p.Status == PaymentStatus.Paid &&
                            p.Date < toExclusive)
                        .Sum(p => p.Amount);

                    return new DebtorModel
                    {
                        AccountNumber = a.AccountNumber,
                        Address = a.Address,
                        OwnerName = a.User?.FullName ?? "Неизвестно",
                        DebtAmount = charged - paid
                    };
                })
                .Where(d => d.DebtAmount > 0)
                .OrderByDescending(d => d.DebtAmount)
                .Take(10)
                .ToList();

            return new AdminAnalyticsResult
            {
                TotalCharged = totalChargedInPeriod,
                TotalCollected = totalCollectedInPeriod,
                TotalDebt = totalDebt,
                CollectionPercent = collectionPercent,
                Points = finalPoints,
                TopDebtors = topDebtors
            };
        }
    }
}