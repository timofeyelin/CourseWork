using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{
    public class Announcement
    {
        public int AnnouncementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public AnnouncementType Type { get; set; }

        public List<AnnouncementRead> Reads { get; set; } = new();
    }
}