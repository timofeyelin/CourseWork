using System;

namespace Backend.Domain.Entities;

public class AccountBalance
{
    public int AccountBalanceId { get; set; }
    public int AccountId { get; set; }
    public Account? Account { get; set; }
    public decimal Balance { get; set; }
    public decimal Debt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
