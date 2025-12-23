using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class BillDetailsDto
    {
        public int BillId { get; set; }
        public int AccountId { get; set; }
        public string AccountNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime Period { get; set; } 
        public decimal TotalAmount { get; set; }
        public PaymentStatus Status { get; set; } 
        public DateTime CreatedAt { get; set; }
        public bool HasPdf { get; set; }
        public List<BillItemDto> BillItems { get; set; } = new();
    }
}