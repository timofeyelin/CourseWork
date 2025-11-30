namespace Backend.Api.Dtos
{
    public class RequestCommentDto
    {
        public int CommentId { get; set; }
        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}