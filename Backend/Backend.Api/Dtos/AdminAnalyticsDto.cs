namespace Backend.Api.Dtos
{
    public class AdminAnalyticsDto
    {
        public KpiDataDto Kpi { get; set; } = new();
        public List<ChartPointDto> IncomeChart { get; set; } = new();
        public List<DebtorDto> TopDebtors { get; set; } = new();
    }

    public class KpiDataDto
    {
        public decimal TotalCharged { get; set; }
        public decimal TotalCollected { get; set; }
        public decimal TotalDebt { get; set; }
        public decimal CollectionRate { get; set; }
    }

    public class ChartPointDto
    {
        public string Date { get; set; } = string.Empty; // Форматированная дата для JS
        public decimal Amount { get; set; }
    }

    public class DebtorDto
    {
        public string AccountNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public decimal DebtAmount { get; set; }
    }
}