using System.ComponentModel.DataAnnotations;


namespace Backend.Domain.Entities
{
    public class AuditLog
    {
        [Key]
        public int AuditLogId { get; set; }

        public int? UserId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
