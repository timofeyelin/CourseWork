using Backend.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Domain.Entities
{
    public class Request
    {
        public int RequestId { get; set; }

        public int AccountId { get; set; }
        public Account? Account { get; set; }

        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public RequestStatus Status { get; set; } = RequestStatus.New;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }

        public int? Rating { get; set; }  // 1–5
        public string? Comment { get; set; }

        public List<RequestComment> Comments { get; set; } = new();
        public List<RequestAttachment> Attachments { get; set; } = new();
    }
}
