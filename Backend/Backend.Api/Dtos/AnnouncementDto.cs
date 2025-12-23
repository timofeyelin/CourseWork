using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class AnnouncementDto
    {
        public int AnnouncementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
         public AnnouncementType Type { get; set; }
        public bool IsRead { get; set; } 
    }
}