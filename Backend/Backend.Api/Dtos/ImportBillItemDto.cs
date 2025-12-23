namespace Backend.Api.Dtos
{
    public class ImportBillItemDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public decimal Tariff { get; set; }
        public decimal Consumption { get; set; }
    }
}
