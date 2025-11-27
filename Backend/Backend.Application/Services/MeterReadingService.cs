using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class MeterReadingService : IMeterReadingService
    {
        private readonly IAppDbContext _context;

        public MeterReadingService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Meter>> GetUserMetersAsync(int userId, CancellationToken ct)
        {
            return await _context.Meters
                .Where(m => m.Account != null && m.Account.UserId == userId)
                .ToListAsync(ct);
        }

        public async Task<List<Meter>> GetAccountMetersAsync(int accountId, CancellationToken ct)
        {
            return await _context.Meters
                .Where(m => m.AccountId == accountId)
                .ToListAsync(ct);
        }

        public async Task<List<MeterReading>> GetMeterReadingHistoryAsync(int meterId, CancellationToken ct)
        {
            return await _context.MeterReadings
                .Where(r => r.MeterId == meterId)
                .OrderByDescending(r => r.Period)
                .ToListAsync(ct);
        }

        public async Task<MeterReading> SubmitMeterReadingAsync(int userId, int meterId, decimal value, CancellationToken ct)
        {
            var meter = await _context.Meters
                .Include(m => m.Account)
                .FirstOrDefaultAsync(m => m.MeterId == meterId, ct);

            if (meter == null)
                throw new KeyNotFoundException("Счетчик не найден.");

            if (meter.Account?.UserId != userId)
                throw new UnauthorizedAccessException("У вас нет доступа к этому счетчику.");
            
            var lastReading = await _context.MeterReadings
                .Where(r => r.MeterId == meterId)
                .OrderByDescending(r => r.Period)
                .FirstOrDefaultAsync(ct);

            if (lastReading != null && value < lastReading.Value)
                throw new InvalidOperationException("Новое показание не может быть меньше предыдущего.");

            var now = DateTime.UtcNow;
            var currentPeriod = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            
            var existingReadingForMonth = await _context.MeterReadings
                .FirstOrDefaultAsync(r => r.MeterId == meterId && r.Period.Year == currentPeriod.Year && r.Period.Month == currentPeriod.Month, ct);

            if (existingReadingForMonth != null)
            {
                existingReadingForMonth.Value = value;
                existingReadingForMonth.SubmittedAt = now;
                existingReadingForMonth.Validated = false; 
                
                await _context.SaveChangesAsync(ct);
                return existingReadingForMonth;
            }
            else
            {
                var newReading = new MeterReading
                {
                    MeterId = meterId,
                    Value = value,
                    Period = currentPeriod,
                    SubmittedAt = now,
                    Validated = false 
                };

                _context.MeterReadings.Add(newReading);
                await _context.SaveChangesAsync(ct);
                return newReading;
            }
        }
        
        public async Task ValidateMeterReadingAsync(int readingId, CancellationToken ct)
        {
            var reading = await _context.MeterReadings.FindAsync(new object[] { readingId }, ct);
            if (reading == null)
                throw new KeyNotFoundException("Показание не найдено.");

            reading.Validated = true;
            await _context.SaveChangesAsync(ct);
        }
    }
}