using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Type { get; set; } = string.Empty; 
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public int? RelatedEntityId { get; set; }
        public bool IsUrgent { get; set; }
    }
}