using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    // Для списков
    public class RequestListDto
    {
        public int RequestId { get; set; }
        public string Category { get; set; } = string.Empty;
        public RequestStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}