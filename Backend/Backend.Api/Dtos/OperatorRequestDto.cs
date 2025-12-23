using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class OperatorRequestDto
    {
        public int RequestId { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public RequestStatus Status { get; set; }
        public string Category { get; set; } = string.Empty;
        public RequestPriority Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? Deadline { get; set; }

        // Данные заявителя (чтобы оператор знал, к кому идти)
        public string Address { get; set; } = string.Empty;
        public string ApplicantName { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string? ApplicantPhone { get; set; }
    }
}