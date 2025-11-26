namespace Backend.Api.Dtos;

public class AccountDto
{
    public int Id { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string UkName { get; set; } = string.Empty;
    public decimal Area { get; set; }
}