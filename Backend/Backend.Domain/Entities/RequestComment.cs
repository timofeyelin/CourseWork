namespace Backend.Domain.Entities
{
    public class RequestComment
    {
        public int CommentId { get; set; }

        public int RequestId { get; set; }
        public Request? Request { get; set; }

        public int AuthorId { get; set; }
        public User? Author { get; set; }

        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
