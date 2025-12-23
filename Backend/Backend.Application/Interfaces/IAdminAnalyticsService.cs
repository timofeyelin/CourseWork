namespace Backend.Application.Interfaces;

public interface IAdminAnalyticsService
{
    Task<AdminAnalyticsResult> GetAnalyticsAsync(DateTime from, DateTime to, CancellationToken ct);
}

public class AdminAnalyticsResult
    {
        public decimal TotalCharged { get; set; }
        public decimal TotalCollected { get; set; }
        public decimal TotalDebt { get; set; }
        public decimal CollectionPercent { get; set; }

        public List<AnalyticsPointModel> Points { get; set; } = new();
        public List<DebtorModel> TopDebtors { get; set; } = new();
    }

public class AnalyticsPointModel
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
}

public class DebtorModel
{
    public string AccountNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public decimal DebtAmount { get; set; }
}
