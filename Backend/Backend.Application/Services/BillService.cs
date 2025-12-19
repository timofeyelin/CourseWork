using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Backend.Application.Services
{
    public class BillService : IBillService
    {
        private readonly IAppDbContext _context;
        private readonly IPdfGeneratorService _pdfGeneratorService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly INotificationService _notificationService;

        public BillService(IAppDbContext context, IPdfGeneratorService pdfGeneratorService, IWebHostEnvironment hostingEnvironment, INotificationService notificationService)
        {
            _context = context;
            _pdfGeneratorService = pdfGeneratorService;
            _hostingEnvironment = hostingEnvironment;
            _notificationService = notificationService;
        }

        // Предполагается, что объект newBill приходит с уже заполненными BillItems.
        public async Task<Bill> CreateBillWithPdfAsync(Bill newBill, CancellationToken ct)
        {
            _context.Bills.Add(newBill);
            await _context.SaveChangesAsync(ct);

            var billWithDetails = await _context.Bills
                .Include(b => b.Account)
                .Include(b => b.BillItems)
                .FirstAsync(b => b.BillId == newBill.BillId, ct);

            var pdfBytes = _pdfGeneratorService.GenerateBillPdf(billWithDetails);

            var fileName = $"bill_{newBill.BillId}_{System.Guid.NewGuid()}.pdf";
            var webRootPath = _hostingEnvironment.WebRootPath ?? Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot");
            var directoryPath = Path.Combine(webRootPath, "bills");
            
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);
            await File.WriteAllBytesAsync(filePath, pdfBytes, ct);

            billWithDetails.PdfLink = $"/bills/{fileName}";
            _context.Bills.Update(billWithDetails);
            await _context.SaveChangesAsync(ct);

            if (billWithDetails.Account != null && billWithDetails.Account.UserId.HasValue)
            {
                await _notificationService.CreateNotificationAsync(
                    billWithDetails.Account.UserId.Value,
                    NotificationType.Bill,
                    "Новая квитанция",
                    $"Сформирована квитанция за {newBill.Period:MM.yyyy} на сумму {newBill.TotalAmount} ₽", 
                    newBill.BillId,
                    ct
                );
            }

            return billWithDetails;
        }

        public async Task RegenerateBillPdfAsync(int billId, CancellationToken ct)
        {
            var billWithDetails = await _context.Bills
                .Include(b => b.Account)
                .Include(b => b.BillItems)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BillId == billId, ct);

            if (billWithDetails == null) throw new KeyNotFoundException("Счет не найден.");

            var pdfBytes = _pdfGeneratorService.GenerateBillPdf(billWithDetails);

            var fileName = $"bill_{billWithDetails.BillId}_{System.Guid.NewGuid()}.pdf";
            var webRootPath = _hostingEnvironment.WebRootPath ?? Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot");
            var directoryPath = Path.Combine(webRootPath, "bills");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);
            await File.WriteAllBytesAsync(filePath, pdfBytes, ct);

            if (!string.IsNullOrEmpty(billWithDetails.PdfLink))
            {
                try
                {
                    var oldRelative = billWithDetails.PdfLink.TrimStart('/');
                    var oldPath = Path.Combine(_hostingEnvironment.WebRootPath ?? webRootPath, oldRelative);
                    if (File.Exists(oldPath)) File.Delete(oldPath);
                }
                catch { /* ignore deletion errors */ }
            }

            billWithDetails.PdfLink = $"/bills/{fileName}";
            _context.Bills.Update(billWithDetails);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Bill>> GetUserBillsAsync(CancellationToken ct, int userId)
        {
            return await _context.Bills
                .Include(b => b.Account) 
                .Include(b => b.Payment)
                .Where(b => b.Account != null && b.Account.UserId == userId)
                .OrderByDescending(b => b.Period) 
                .ToListAsync(ct);
        }

        public async Task<List<Bill>> GetAccountBillsAsync(CancellationToken ct, int userId, int accountId)
        {
            var hasAccess = await _context.Accounts
                .AnyAsync(a => a.AccountId == accountId && a.UserId == userId, ct);

            if (!hasAccess)
            {
                throw new KeyNotFoundException("Лицевой счет не найден или доступ запрещен.");
            }

            return await _context.Bills
                .Include(b => b.Payment)
                .Where(b => b.AccountId == accountId)
                .OrderByDescending(b => b.Period)
                .ToListAsync(ct);
        }

        public async Task<Bill> GetBillDetailsAsync(CancellationToken ct, int userId, int billId)
        {
            var bill = await _context.Bills
                .Include(b => b.BillItems) 
                .Include(b => b.Account) 
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BillId == billId, ct);

            if (bill == null)
            {
                throw new KeyNotFoundException("Счет не найден.");
            }

            if (bill.Account?.UserId != userId)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к просмотру этого счета.");
            }

            return bill;
        }

        public async Task<bool> ValidateUserAccessAsync(CancellationToken ct, int userId, int billId)
        {
            return await _context.Bills
                .Include(b => b.Account)
                .AnyAsync(b => b.BillId == billId && b.Account != null && b.Account.UserId == userId, ct);
        }

        public async Task<Bill?> GetBillByIdAsync(int billId)
        {
            return await _context.Bills
                .Include(b => b.Account)
                .FirstOrDefaultAsync(b => b.BillId == billId);
        }
        public async Task<string> ImportBillsAsync(IEnumerable<(string AccountNumber, Bill BillData)> data, CancellationToken ct)
        {
            int successCount = 0;
            int errorCount = 0;

            var incomingAccountNumbers = data.Select(x => x.AccountNumber).Distinct().ToList();
            var accountsDict = await _context.Accounts
                .Where(a => incomingAccountNumbers.Contains(a.AccountNumber))
                .ToDictionaryAsync(a => a.AccountNumber, a => a, ct);

            var existingAccountIds = accountsDict.Values.Select(a => a.AccountId).ToList();

            var existingBills = await _context.Bills
                .Where(b => existingAccountIds.Contains(b.AccountId))
                .Select(b => new { b.AccountId, b.Period })
                .ToListAsync(ct);

            var existingBillsSet = existingBills
                .Select(b => (b.AccountId, b.Period))
                .ToHashSet();

            var processedInCurrentBatch = new HashSet<(int, DateOnly)>();
            var createdBills = new List<Bill>();

            foreach (var item in data)
            {
                try
                {
                    if (!accountsDict.TryGetValue(item.AccountNumber, out var account))
                    {
                        errorCount++;
                        continue;
                    }

                    if (existingBillsSet.Contains((account.AccountId, item.BillData.Period)))
                    {
                        errorCount++;
                        continue;
                    }

                    if (processedInCurrentBatch.Contains((account.AccountId, item.BillData.Period)))
                    {
                        errorCount++;
                        continue;
                    }

                    var bill = item.BillData;
                    bill.AccountId = account.AccountId;
                    bill.CreatedAt = DateTime.UtcNow;

                    _context.Bills.Add(bill);

                    processedInCurrentBatch.Add((account.AccountId, bill.Period));
                    createdBills.Add(bill);

                    successCount++;
                }
                catch (Exception ex)
                {
                    errorCount++;
                }
            }

            await _context.SaveChangesAsync(ct);

            // Генерация PDF и уведомлений для созданных счетов
            foreach (var bill in createdBills)
            {
                try
                {
                    var billWithDetails = await _context.Bills
                        .Include(b => b.Account)
                        .Include(b => b.BillItems)
                        .FirstAsync(b => b.BillId == bill.BillId, ct);

                    // Генерация PDF
                    var pdfBytes = _pdfGeneratorService.GenerateBillPdf(billWithDetails);

                    var fileName = $"bill_{bill.BillId}_{System.Guid.NewGuid()}.pdf";
                    var webRootPath = _hostingEnvironment.WebRootPath ?? Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot");
                    var directoryPath = Path.Combine(webRootPath, "bills");

                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }

                    var filePath = Path.Combine(directoryPath, fileName);
                    await File.WriteAllBytesAsync(filePath, pdfBytes, ct);

                    billWithDetails.PdfLink = $"/bills/{fileName}";
                    _context.Bills.Update(billWithDetails);

                    // Создание уведомления
                    if (billWithDetails.Account != null && billWithDetails.Account.UserId.HasValue)
                    {
                        await _notificationService.CreateNotificationAsync(
                            billWithDetails.Account.UserId.Value,
                            NotificationType.Bill,
                            "Новая квитанция",
                            $"Сформирована квитанция за {bill.Period:MM.yyyy} на сумму {bill.TotalAmount} ₽",
                            bill.BillId,
                            ct
                        );
                    }
                }
                catch (Exception)
                {
                    // Ошибка генерации PDF - счет уже создан, пропускаем
                }
            }

            await _context.SaveChangesAsync(ct);

            return $"Загружено: {successCount}, Ошибок: {errorCount}";
        }
    }
}