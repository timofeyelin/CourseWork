namespace Backend.Domain.Entities
{
    public class Bill
    {
        public int BillId { get; set; }
        public DateOnly Period { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PdfLink{ get; set; } = string.Empty;


        public int AccountId { get; set; }
        public Account? Account { get; set; }

        public ICollection<BillItem> BillItems { get; set; } = new List<BillItem>();
        public ICollection<Payment> Payment { get; set; } = new List<Payment>();
    }
}
