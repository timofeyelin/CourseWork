using Backend.Domain.Enums;
using System;

namespace Backend.Domain.Entities
{
    public class Notification
    {
        public int NotificationId { get; set; }

        // Связь с пользователем, которому адресовано уведомление
        public int UserId { get; set; }
        public User? User { get; set; }

        public NotificationType Type { get; set; }
        
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsRead { get; set; } = false;

        // ID связанной сущности (например, RequestId или BillId) для перехода по клику
        public int? RelatedEntityId { get; set; }
    }
}