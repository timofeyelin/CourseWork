using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public int BillId { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
    }
}