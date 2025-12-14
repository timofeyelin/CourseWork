using Backend.Application.Interfaces;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.BackgroundServices
{
    public class DebtNotificationWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DebtNotificationWorker> _logger;

        public DebtNotificationWorker(IServiceProvider serviceProvider, ILogger<DebtNotificationWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DebtNotificationWorker запущен.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckForDebtsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при проверке задолженностей.");
                }

                // Проверка раз в 24 часа
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task CheckForDebtsAsync(CancellationToken ct)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<IAppDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                // Считаем долгом, если счет выставлен более 30 дней назад
                // DateOnly нужно сравнивать аккуратно
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var overdueDate = today.AddDays(-30); 

                var overdueBills = await context.Bills
                    .Include(b => b.Account)
                    .Include(b => b.Payment) // Подгружаем платежи, чтобы проверить оплату
                    .Where(b => b.Period < overdueDate) 
                    .ToListAsync(ct);

                foreach (var bill in overdueBills)
                {
                    var paidAmount = bill.Payment.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.Amount);
                    bool isPaid = paidAmount >= bill.TotalAmount;

                    if (isPaid || bill.Account == null || !bill.Account.UserId.HasValue) continue;

                    // Проверяем, не отправляли ли уже уведомление
                    var alreadyNotified = await context.Notifications
                        .AnyAsync(n => n.Type == NotificationType.Debt 
                                    && n.RelatedEntityId == bill.BillId, ct);

                    if (!alreadyNotified)
                    {
                        await notificationService.CreateNotificationAsync(
                            bill.Account.UserId.Value,
                            NotificationType.Debt,
                            "Задолженность по оплате",
                            $"У вас имеется неоплаченная квитанция за {bill.Period:MM.yyyy} на сумму {bill.TotalAmount} ₽.", 
                            bill.BillId,
                            ct
                        );
                        
                        _logger.LogInformation($"Отправлено уведомление о долге пользователю {bill.Account.UserId}");
                    }
                }
            }
        }
    }
}