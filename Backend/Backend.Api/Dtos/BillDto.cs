using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class BillDto
    {
        public int BillId { get; set; }
        public int AccountId { get; set; }
        public DateTime Period { get; set; } 
        public decimal TotalAmount { get; set; }
        public PaymentStatus Status { get; set; } 
    }
}