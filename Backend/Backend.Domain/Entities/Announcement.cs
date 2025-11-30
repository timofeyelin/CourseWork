public class Announcement
{
    public int AnnouncementId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsEmergency { get; set; }

    // Связь 1-ко-Многим с AnnouncementRead
    public List<AnnouncementRead> Reads { get; set; } = new();
}