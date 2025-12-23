namespace Backend.Api.Dtos
{
    public class BillItemDto
    {
        public int BillItemId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal Tariff { get; set; }
        public decimal Consumption { get; set; }
        public decimal Amount { get; set; }
    }
}