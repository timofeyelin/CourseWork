namespace Backend.Application.Interfaces
{
    public interface IAnnouncementService
    {
        Task<List<Announcement>> GetAllAnnouncementsAsync(int userId, CancellationToken ct);
        Task<List<Announcement>> GetUnreadAnnouncementsAsync(int userId, CancellationToken ct);
        Task MarkAsReadAsync(int userId, int announcementId, CancellationToken ct);
        Task<Announcement> CreateAnnouncementAsync(string title, string content, bool isEmergency, CancellationToken ct);
        Task DeleteAnnouncementAsync(int announcementId, CancellationToken ct);
    }
}