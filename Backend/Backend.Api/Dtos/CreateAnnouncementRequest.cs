namespace Backend.Api.Dtos
{
    public class CreateAnnouncementRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsEmergency { get; set; }
    }
}