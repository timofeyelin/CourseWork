namespace Backend.Domain.Entities;

public class Account
{
    public int AccountId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Area { get; set; }
    public int OccupantsCount { get; set; }
    public string HouseType { get; set; } = string.Empty;
    public string UkName { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    // Внешний ключ для связи с User
    public int? UserId { get; set; }
    // Навигационное свойство для связи "многие к одному"
    public User? User { get; set; }

    public ICollection<Bill> Bills { get; set; } = new List<Bill>();
}