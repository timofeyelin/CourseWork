namespace Backend.Api.Dtos
{
    public class NotificationsResponseDto
    {
        public int UnreadCount { get; set; }
         public int UrgentUnreadCount { get; set; }
        public List<NotificationDto> Items { get; set; } = new();
    }
}
