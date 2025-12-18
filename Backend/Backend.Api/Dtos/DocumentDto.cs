using System;

namespace Backend.Api.Dtos
{
    public class DocumentDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Category { get; set; }
        public long Size { get; set; }
    }
}
