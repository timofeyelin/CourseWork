namespace Backend.Domain.Entities
{
    public class RequestAttachment
    {
        public int AttachmentId { get; set; }

        public int RequestId { get; set; }
        public Request? Request { get; set; }

        public string FileUri { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
