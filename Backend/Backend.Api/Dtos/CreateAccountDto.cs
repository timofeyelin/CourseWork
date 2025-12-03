namespace Backend.Api.Dtos
{
    public class CreateAccountDto
    {
        public string AccountNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Area { get; set; }
        public int OccupantsCount { get; set; }
        public string? HouseType { get; set; }
        public string? UkName { get; set; }
    }
}
