using Backend.Domain.Enums;
using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IAnnouncementService
    {
        Task<List<Announcement>> GetAllAnnouncementsAsync(int? userId, AnnouncementType? filterType, CancellationToken ct);
        Task<List<Announcement>> GetUnreadAnnouncementsAsync(int userId, CancellationToken ct);
        Task MarkAsReadAsync(int userId, int announcementId, CancellationToken ct);
        Task<Announcement> CreateAnnouncementAsync(string title, string content, AnnouncementType type, CancellationToken ct);
        Task<Announcement> UpdateAnnouncementAsync(int announcementId, string title, string content, AnnouncementType type, CancellationToken ct);
        Task DeleteAnnouncementAsync(int announcementId, CancellationToken ct);
    }
}