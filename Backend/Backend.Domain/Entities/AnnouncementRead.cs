using Backend.Domain.Entities;

public class AnnouncementRead
{
    public int Id { get; set; }

    public int AnnouncementId { get; set; }
    public Announcement? Announcement { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public DateTime ReadAt { get; set; } = DateTime.UtcNow;
}