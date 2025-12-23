namespace Backend.Domain.Entities
{
    public class BillItem
    {
        public int BillItemId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal Tariff { get; set; }
        public decimal Consumption { get; set; }
        public decimal Amount { get; set; }

        public int BillId { get; set; }
        public Bill? Bill { get; set; }
    }
}
