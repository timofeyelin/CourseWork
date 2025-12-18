using Backend.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities;
using Backend.Domain.Enums;

namespace Backend.Application.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAppDbContext _context;

        public AnnouncementService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Announcement> CreateAnnouncementAsync(string title, string content, AnnouncementType type, CancellationToken ct)
        {
            var announcement = new Announcement
            {
                Title = title,
                Content = content,
                Type = type,
                CreatedAt = DateTime.UtcNow
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync(ct);

            // Теперь рассылаем уведомление для ЛЮБОГО типа новости
            var userIds = await _context.Users
                .Where(u => u.Role == UserRole.Resident) // Только жителям
                .Select(u => u.UserId)
                .ToListAsync(ct);

            string notificationTitle;
            NotificationType notifType;

            switch (type)
            {
                case AnnouncementType.Emergency:
                    notificationTitle = "АВАРИЯ: " + title;
                    notifType = NotificationType.Outage; // Красная иконка
                    break;
                case AnnouncementType.Outage:
                    notificationTitle = "Отключение: " + title;
                    notifType = NotificationType.Outage; // Желтая иконка (на фронте Outage обрабатывается как warning)
                    break;
                default:
                    notificationTitle = "Новость: " + title;
                    notifType = NotificationType.Announcement; // Синяя иконка
                    break;
            }

            var notifications = userIds.Select(userId => new Notification
            {
                UserId = userId,
                Type = notifType,
                Title = notificationTitle,
                Text = content.Length > 100 ? content.Substring(0, 100) + "..." : content, // Обрезаем длинный текст
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                RelatedEntityId = announcement.AnnouncementId
            });

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync(ct);

            return announcement;
        }

        public async Task<Announcement> UpdateAnnouncementAsync(int announcementId, string title, string content, AnnouncementType type, CancellationToken ct)
        {
            var announcement = await _context.Announcements.FindAsync(new object[] { announcementId }, ct);
            if (announcement == null)
            {
                throw new KeyNotFoundException("Объявление не найдено.");
            }

            announcement.Title = title;
            announcement.Content = content;
            announcement.Type = type;

            _context.Announcements.Update(announcement);
            await _context.SaveChangesAsync(ct);
            return announcement;
        }

        public async Task DeleteAnnouncementAsync(int announcementId, CancellationToken ct)
        {
            var announcement = await _context.Announcements.FindAsync(new object[] { announcementId }, ct);
            if (announcement == null)
            {
                throw new KeyNotFoundException("Объявление не найдено.");
            }
            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Announcement>> GetAllAnnouncementsAsync(int? userId, AnnouncementType? filterType, CancellationToken ct)
        {
            var query = _context.Announcements.AsQueryable();

            if (filterType.HasValue)
            {
                query = query.Where(a => a.Type == filterType.Value);
            }

            if (userId.HasValue)
            {
                query = query.Include(a => a.Reads.Where(r => r.UserId == userId.Value));
            }
            
            return await query
                .OrderByDescending(a => a.Type == AnnouncementType.Emergency)
                .ThenByDescending(a => a.Type == AnnouncementType.Outage)
                .ThenByDescending(a => a.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task<List<Announcement>> GetUnreadAnnouncementsAsync(int userId, CancellationToken ct)
        {
            return await _context.Announcements
                .Where(a => !a.Reads.Any(r => r.UserId == userId))
                .OrderByDescending(a => a.Type == AnnouncementType.Emergency)
                .ThenByDescending(a => a.Type == AnnouncementType.Outage)
                .ThenByDescending(a => a.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task MarkAsReadAsync(int userId, int announcementId, CancellationToken ct)
        {
            var announcementExists = await _context.Announcements.AnyAsync(a => a.AnnouncementId == announcementId, ct);
            if (!announcementExists)
            {
                throw new KeyNotFoundException("Объявление не найдено.");
            }
            
            var alreadyRead = await _context.AnnouncementReads
                .AnyAsync(ar => ar.AnnouncementId == announcementId && ar.UserId == userId, ct);

            if (alreadyRead)
            {
                return; 
            }

            var readEntry = new AnnouncementRead
            {
                UserId = userId,
                AnnouncementId = announcementId,
                ReadAt = DateTime.UtcNow
            };

            _context.AnnouncementReads.Add(readEntry);
            await _context.SaveChangesAsync(ct);
        }
    }
}