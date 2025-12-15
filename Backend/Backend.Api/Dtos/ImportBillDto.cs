namespace Backend.Api.Dtos
{
    public class ImportBillDto
    {
        public string AccountNumber { get; set; } = string.Empty;
        public DateOnly Period { get; set; }
        public List<ImportBillItemDto> Items { get; set; } = new();
    }
}
