using Backend.Domain.Entities;
using Backend.Domain.Enums;

namespace Backend.Application.Interfaces
{
    public interface INotificationService
    {
        // Получить уведомления пользователя (сначала новые)
        Task<List<Notification>> GetUserNotificationsAsync(int userId, CancellationToken ct);
        
        // Получить непрочитанные уведомления пользователя
        Task<int> GetUnreadCountAsync(int userId, CancellationToken ct);

        // Отметить все уведомления пользователя как прочитанные
        Task MarkAllAsReadAsync(int userId, CancellationToken ct);

        Task MarkAsReadAsync(int userId, int notificationId, CancellationToken ct);
        
        // Создать уведомление (для вызова из других сервисов)
        Task CreateNotificationAsync(int userId, NotificationType type, string title, string text, int? relatedEntityId, CancellationToken ct);
    }
}