using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date {  get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
        public Boolean IsTest { get; set; }

        public int? BillId { get; set; }
        public Bill? Bill { get; set; }

        public int? AccountId { get; set; }
        public Account? Account { get; set; }
    }
}
