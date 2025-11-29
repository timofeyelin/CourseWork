namespace Backend.Api.Dtos;
public class RequestAttachmentDto
    {
        public int AttachmentId { get; set; }
        public string FileUri { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }