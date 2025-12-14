using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IAppDbContext _context;

        public NotificationService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(int userId, NotificationType type, string title, string text, int? relatedEntityId, CancellationToken ct)
        {
            var notification = new Notification
            {
                UserId = userId,
                Type = type,
                Title = title,
                Text = text,
                RelatedEntityId = relatedEntityId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(int userId, CancellationToken ct)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt) // Сначала свежие
                .Take(50) 
                .ToListAsync(ct);
        }

        public async Task<int> GetUnreadCountAsync(int userId, CancellationToken ct)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead, ct);
        }
        
        public async Task MarkAllAsReadAsync(int userId, CancellationToken ct)
        {
            var unreadNotifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync(ct);

            if (unreadNotifications.Any())
            {
                foreach (var notification in unreadNotifications)
                {
                    notification.IsRead = true;
                }
                await _context.SaveChangesAsync(ct);
            }
        }
    }
}