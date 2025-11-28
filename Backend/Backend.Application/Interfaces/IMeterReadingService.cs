using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IMeterReadingService
    {
        Task<List<Meter>> GetUserMetersAsync(int userId, CancellationToken ct);
        Task<List<Meter>> GetAccountMetersAsync(int accountId, CancellationToken ct);
        Task<List<MeterReading>> GetMeterReadingHistoryAsync(int meterId, CancellationToken ct);
        Task<MeterReading> SubmitMeterReadingAsync(int userId, int meterId, decimal value, CancellationToken ct);
        Task<MeterReading?> GetReadingByIdAsync(int userId, int readingId, CancellationToken ct); 
        Task<MeterReading> UpdateMeterReadingAsync(int userId, int meterId, int readingId, decimal value, CancellationToken ct); 
        Task ValidateMeterReadingAsync(int readingId, CancellationToken ct); // Для административных задач
    }
}