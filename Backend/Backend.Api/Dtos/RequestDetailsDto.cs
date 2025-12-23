namespace Backend.Api.Dtos;

public class RequestDetailsDto : RequestListDto
    {
        public int AccountId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime? ClosedAt { get; set; }
        public int? Rating { get; set; }
        public string? UserCommentOnRating { get; set; }
        public List<RequestCommentDto> Comments { get; set; } = new();
        public List<RequestAttachmentDto> Attachments { get; set; } = new();
    }