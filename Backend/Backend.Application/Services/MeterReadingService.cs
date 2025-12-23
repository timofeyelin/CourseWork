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
                .Include(m => m.Account)
                .Where(m => m.Account != null && m.Account.UserId == userId)
                .ToListAsync(ct);
        }

        public async Task<List<Meter>> GetAccountMetersAsync(int accountId, CancellationToken ct)
        {
            return await _context.Meters
                .Include(m => m.Account)
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
            
            var now = DateTime.UtcNow;
            var currentPeriod = now;

            var previousReading = await _context.MeterReadings
                .Where(r => r.MeterId == meterId && r.Period < currentPeriod)
                .OrderByDescending(r => r.Period)
                .FirstOrDefaultAsync(ct);

            if (previousReading != null && value < previousReading.Value)
                throw new InvalidOperationException($"Новое показание ({value}) не может быть меньше предыдущего ({previousReading.Value} от {previousReading.Period:d}).");

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
        
        public async Task<MeterReading?> GetReadingByIdAsync(int userId, int readingId, CancellationToken ct)
        {
            var reading = await _context.MeterReadings
                .Include(r => r.Meter)
                .ThenInclude(m => m.Account)
                .FirstOrDefaultAsync(r => r.ReadingId == readingId, ct);

            if (reading == null)
            {
                return null; 
            }

            if (reading.Meter?.Account?.UserId != userId)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к этому показанию.");
            }

            return reading;
        }

        public async Task<MeterReading> UpdateMeterReadingAsync(int userId, int meterId, int readingId, decimal value, CancellationToken ct)
        {
            var readingToUpdate = await _context.MeterReadings
                .Include(r => r.Meter)
                .ThenInclude(m => m.Account)
                .FirstOrDefaultAsync(r => r.ReadingId == readingId, ct);

            if (readingToUpdate == null)
                throw new KeyNotFoundException("Показание не найдено.");

            if (readingToUpdate.Meter?.Account?.UserId != userId)
                throw new UnauthorizedAccessException("У вас нет доступа к этому показанию.");

            if (readingToUpdate.MeterId != meterId)
                throw new InvalidOperationException("Показание не относится к указанному счетчику.");
                
            if (readingToUpdate.Validated)
                throw new InvalidOperationException("Нельзя редактировать уже проверенное показание.");
            
            // Валидация: новое значение не может быть меньше показания за предыдущий месяц
            var previousMonthReading = await _context.MeterReadings
                .Where(r => r.MeterId == readingToUpdate.MeterId && r.Period < readingToUpdate.Period)
                .OrderByDescending(r => r.Period)
                .FirstOrDefaultAsync(ct);

            if (previousMonthReading != null && value < previousMonthReading.Value)
                throw new InvalidOperationException("Значение не может быть меньше показания за предыдущий период.");

            readingToUpdate.Value = value;
            readingToUpdate.SubmittedAt = DateTime.UtcNow; 

            await _context.SaveChangesAsync(ct);
            return readingToUpdate;
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