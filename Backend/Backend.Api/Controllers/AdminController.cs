using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Application.Services;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class AdminController : ControllerBase
    {
        private readonly IAdminAnalyticsService _analyticsService;
        private readonly IBillService _billService;
        private readonly IAppDbContext _context;
        private readonly IAuditService _auditService;
        private readonly ILogger<AdminController> _logger;
        public AdminController(IAdminAnalyticsService analyticsService, IBillService billService, IAppDbContext context, IAuditService auditService, ILogger<AdminController> logger)
        {
            _analyticsService = analyticsService;
            _billService = billService;
            _context = context;
            _auditService = auditService;
            _logger = logger;
        }

        [HttpPost("create-account")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto dto, CancellationToken ct)
        {
            var account = new Account
            {
                AccountNumber = dto.AccountNumber,
                Address = dto.Address,
                Area = dto.Area,
                OccupantsCount = dto.OccupantsCount,
                HouseType = dto.HouseType ?? "Многоквартирный",
                UkName = dto.UkName ?? "ООО 'УК Горизонт'",
                IsActive = true
            };
            var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                await _auditService.LogAsync(
                adminId,
                "CreateAccount",
                "Account",
                account.AccountId.ToString(),
                $"Создан ЛС {dto.AccountNumber}",
                ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Не удалось записать аудит");
            }
            
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync(ct);

            return Ok(new { message = "Account created", accountId = account.AccountId });
        }

        [HttpPost("generate-test-bill")]
        public async Task<IActionResult> GenerateTestBill([FromQuery] int accountId, CancellationToken ct)
        {
            var account = await _context.Accounts.FindAsync(new object[] { accountId }, ct);
            if (account == null)
            {
                return NotFound($"Account with ID {accountId} not found.");
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var period = new DateOnly(today.Year, today.Month, 1);

            var existingBill = await _context.Bills
                .FirstOrDefaultAsync(b => b.AccountId == accountId && b.Period == period, ct);

            if (existingBill != null)
            {
                return Ok(new { message = "Test bill already exists for this month", billId = existingBill.BillId, pdfLink = existingBill.PdfLink });
            }

            // Тестовый счет
            var newBill = new Bill
            {
                AccountId = accountId,
                Period = period,
                TotalAmount = 1500.75m,
                CreatedAt = DateTime.UtcNow,
                BillItems = new List<BillItem>
                {
                    new BillItem { ServiceName = "Электроэнергия", Tariff = 5.47m, Consumption = 150, Amount = 820.50m },
                    new BillItem { ServiceName = "Холодная вода", Tariff = 45.90m, Consumption = 5, Amount = 229.50m },
                    new BillItem { ServiceName = "Содержание жилья", Tariff = 25.12m, Consumption = 18.5m, Amount = 450.75m }
                }
            };
            
            try
            {
                var createdBill = await _billService.CreateBillWithPdfAsync(newBill, ct);
                return Ok(new { message = "Test bill created successfully", billId = createdBill.BillId, pdfLink = createdBill.PdfLink });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("generate-bills-now")]
        public async Task<IActionResult> GenerateBillsNow([FromQuery] string? period = null, [FromQuery] bool force = false, CancellationToken ct = default)
        {
            DateOnly periodDate;
            if (!string.IsNullOrWhiteSpace(period))
            {
                if (DateOnly.TryParse(period, out var p))
                {
                    periodDate = new DateOnly(p.Year, p.Month, 1);
                }
                else
                {
                    var parts = period.Split('-', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length >= 2 && int.TryParse(parts[0], out var y) && int.TryParse(parts[1], out var m))
                    {
                        periodDate = new DateOnly(y, m, 1);
                    }
                    else
                    {
                        return BadRequest("Неверный формат периода. Используйте 'yyyy-MM' или распознаваемую дату.");
                    }
                }
            }
            else
            {
                var now = DateTime.UtcNow;
                periodDate = DateOnly.FromDateTime(now.AddMonths(-1));
            }

            int createdCount = 0;
            int skippedCount = 0;
            int errorCount = 0;

            var tariffs = new Dictionary<int, decimal>
            {
                { (int)MeterType.ColdWater, 45.90m },
                { (int)MeterType.HotWater, 60.00m },
                { (int)MeterType.Electricity, 5.47m },
                { (int)MeterType.Gas, 7.50m }
            };

            var accounts = await _context.Accounts.ToListAsync(ct);

            var usersRoles = await _context.Users
                .ToDictionaryAsync(u => u.UserId, u => u.Role, ct);

            foreach (var account in accounts)
            {
                try
                {
                    if (account.UserId.HasValue && usersRoles.TryGetValue(account.UserId.Value, out var role) && (role == UserRole.Admin || role == UserRole.Operator))
                    {
                        skippedCount++;
                        continue;
                    }
                    var existingBills = await _context.Bills
                        .Where(b => b.AccountId == account.AccountId && b.Period == periodDate)
                        .Include(b => b.BillItems)
                        .Include(b => b.Payment)
                        .ToListAsync(ct);

                    if (existingBills.Any() && !force)
                    {
                        // Уже есть квитанция и не требуется принудительное пересоздание
                        skippedCount++;
                        continue;
                    }

                    var billItems = new List<BillItem>();

                    var meters = await _context.Meters.Where(m => m.AccountId == account.AccountId).ToListAsync(ct);

                    var monthEndLocal = new DateTime(periodDate.Year, periodDate.Month, DateTime.DaysInMonth(periodDate.Year, periodDate.Month), 23, 59, 59);
                    var monthEnd = DateTime.SpecifyKind(monthEndLocal, DateTimeKind.Utc);

                    foreach (var meter in meters)
                    {
                        var currentReadingQuery = _context.MeterReadings
                            .Where(r => r.MeterId == meter.MeterId && r.Period <= monthEnd);
                        if (!force)
                            currentReadingQuery = currentReadingQuery.Where(r => r.Validated);
                        var currentReading = await currentReadingQuery
                            .OrderByDescending(r => r.Period)
                            .FirstOrDefaultAsync(ct);

                        if (currentReading == null) continue;

                        var previousReadingQuery = _context.MeterReadings
                            .Where(r => r.MeterId == meter.MeterId && r.Period < currentReading.Period);
                        if (!force)
                            previousReadingQuery = previousReadingQuery.Where(r => r.Validated);
                        var previousReading = await previousReadingQuery
                            .OrderByDescending(r => r.Period)
                            .FirstOrDefaultAsync(ct);

                        decimal consumption = 0;
                        if (previousReading != null) consumption = currentReading.Value - previousReading.Value;
                        else consumption = currentReading.Value;

                        if (consumption <= 0) continue;

                        var mType = (int)meter.Type;
                        if (!tariffs.TryGetValue(mType, out var tariff)) tariff = 0m;

                        var serviceName = meter.Type switch
                        {
                            MeterType.ColdWater => "Холодная вода",
                            MeterType.HotWater => "Горячая вода",
                            MeterType.Electricity => "Электроэнергия",
                            MeterType.Gas => "Газ",
                            _ => "Услуга"
                        };

                        var amount = Math.Round(consumption * tariff, 2);

                        billItems.Add(new BillItem
                        {
                            ServiceName = serviceName,
                            Tariff = tariff,
                            Consumption = consumption,
                            Amount = amount
                        });
                    }

                    if (!billItems.Any())
                    {
                        skippedCount++;
                        continue;
                    }

                    // Если есть существующие квитанции и запрошен force, сравним содержимое.
                    if (existingBills.Any() && force)
                    {
                        var existing = existingBills.First();
                        bool identical = false;
                        try
                        {
                            var existingItems = existing.BillItems.OrderBy(i => i.ServiceName).ToList();
                            var newItems = billItems.OrderBy(i => i.ServiceName).ToList();
                            if (existingItems.Count == newItems.Count)
                            {
                                identical = true;
                                for (int i = 0; i < existingItems.Count; i++)
                                {
                                    if (existingItems[i].ServiceName != newItems[i].ServiceName
                                        || existingItems[i].Consumption != newItems[i].Consumption
                                        || existingItems[i].Tariff != newItems[i].Tariff
                                        || existingItems[i].Amount != newItems[i].Amount)
                                    {
                                        identical = false;
                                        break;
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, $"Ошибка при сравнении существующей и новой квитанции для ЛС {account.AccountNumber}");
                        }

                        if (identical)
                        {
                            // Ничего не изменилось — пропускаем генерацию
                            skippedCount++;
                            continue;
                        }

                        // Иначе удаляем старые квитанции и продолжим создание новых
                        try
                        {
                            _context.Bills.RemoveRange(existingBills);
                            await _context.SaveChangesAsync(ct);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"Не удалось удалить существующие квитанции для лицевого счета {account.AccountNumber}");
                            errorCount++;
                            continue;
                        }
                    }

                    var bill = new Bill
                    {
                        AccountId = account.AccountId,
                        Period = periodDate,
                        CreatedAt = DateTime.UtcNow,
                        BillItems = billItems,
                        TotalAmount = billItems.Sum(i => i.Amount)
                    };

                    await _billService.CreateBillWithPdfAsync(bill, ct);
                    createdCount++;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Ошибка при создании квитанции для лицевого счета {account.AccountNumber}");
                    errorCount++;
                }
            }

            return Ok(new { message = "Генерация завершена", created = createdCount, skipped = skippedCount, errors = errorCount, period = periodDate.ToString("MM.yyyy") });
        }

        [HttpPost("add-meter")]
        public async Task<IActionResult> AddMeter(string accountNumber, MeterType type, string serialNumber, CancellationToken ct)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, ct);

            if (account == null)
            {
                return NotFound($"Лицевой счет с номером '{accountNumber}' не найден.");
            }

            var meter = new Meter
            {
                AccountId = account.AccountId,
                Type = type,
                SerialNumber = serialNumber,
                InstallationDate = DateTime.UtcNow
            };

            _context.Meters.Add(meter);
            await _context.SaveChangesAsync(ct);

            return Ok(meter);
        }

        [HttpGet("analytics")]
        public async Task<ActionResult<AdminAnalyticsDto>> GetAnalytics(
            [FromQuery] DateTime? from, 
            [FromQuery] DateTime? to,
            CancellationToken ct)
        {
            // Дефолт: текущий месяц, если параметры не переданы
            var endDate = to ?? DateTime.UtcNow;
            var startDate = from ?? DateTime.UtcNow.AddDays(-30);

            var result = await _analyticsService.GetAnalyticsAsync(startDate, endDate, ct);

            // Маппинг (Model -> DTO)
            var dto = new AdminAnalyticsDto
            {
                Kpi = new KpiDataDto
                {
                    TotalCharged = result.TotalCharged,
                    TotalCollected = result.TotalCollected,
                    TotalDebt = result.TotalDebt,
                    CollectionRate = result.CollectionPercent
                },
                IncomeChart = result.Points.Select(p => new ChartPointDto
                {
                    Date = p.Date.ToString("dd.MM"), // Форматируем дату для графика
                    Amount = p.Amount
                }).ToList(),
                TopDebtors = result.TopDebtors.Select(d => new DebtorDto
                {
                    AccountNumber = d.AccountNumber,
                    Address = d.Address,
                    OwnerName = d.OwnerName,
                    DebtAmount = d.DebtAmount
                }).ToList()
            };

            return Ok(dto);
        }
        
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] string? q, CancellationToken ct)
        {
            var query = _context.Users
                .Include(u => u.Accounts)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                q = q.ToLower();
                query = query.Where(u => 
                    u.FullName.ToLower().Contains(q) || 
                    u.Phone.Contains(q) ||
                    u.Accounts.Any(a => a.AccountNumber.Contains(q) || a.Address.ToLower().Contains(q))
                );
            }

            var users = await query.Select(u => new AdminUserDto
            {
                Id = u.UserId,
                FullName = u.FullName,
                Phone = u.Phone,
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                Accounts = u.Accounts.Select(a => new AdminUserAccountDto 
                { 
                    Id = a.AccountId, 
                    AccountNumber = a.AccountNumber, 
                    Address = a.Address 
                }).ToList()
            }).ToListAsync(ct);

            return Ok(users);
        }

        [HttpPost("users/block")]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserRequest request, CancellationToken ct)
        {
            var user = await _context.Users.FindAsync(new object[] { request.UserId }, ct);
            if (user == null) return NotFound("User not found");

            if (user.Role == UserRole.Admin && !request.IsActive)
            {
                 return BadRequest("Cannot block an administrator. Change role first.");
            }

            user.IsActive = request.IsActive;
            await _context.SaveChangesAsync(ct);
            return Ok(new { message = "User status updated" });
        }

        [HttpPost("users/change-role")]
        public async Task<IActionResult> ChangeRole([FromBody] ChangeRoleRequest request, CancellationToken ct)
        {
            var user = await _context.Users.FindAsync(new object[] { request.UserId }, ct);
            if (user == null) return NotFound("User not found");

            var currentUserIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (currentUserIdClaim != null && int.Parse(currentUserIdClaim.Value) == request.UserId)
            {
                return BadRequest("Cannot change your own role.");
            }

            if (Enum.TryParse<UserRole>(request.NewRole, out var role))
            {
                user.Role = role;
                await _context.SaveChangesAsync(ct);
                return Ok(new { message = "User role updated" });
            }
            return BadRequest("Invalid role");
        }

        [HttpPost("users/link-account")]
        public async Task<IActionResult> LinkAccount([FromBody] AdminLinkAccountRequest request, CancellationToken ct)
        {
             var user = await _context.Users.Include(u => u.Accounts).FirstOrDefaultAsync(u => u.UserId == request.UserId, ct);
             if (user == null) return NotFound("User not found");

             var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == request.AccountNumber, ct);
             if (account == null) return NotFound("Account not found");

             if (user.Accounts.Any(a => a.AccountId == account.AccountId))
                 return BadRequest("Account already linked");

             user.Accounts.Add(account);
             await _context.SaveChangesAsync(ct);
             return Ok(new { message = "Account linked" });
        }

        [HttpPost("users/unlink-account")]
        public async Task<IActionResult> UnlinkAccount([FromBody] AdminUnlinkAccountRequest request, CancellationToken ct)
        {
             var user = await _context.Users.Include(u => u.Accounts).FirstOrDefaultAsync(u => u.UserId == request.UserId, ct);
             if (user == null) return NotFound("User not found");

             var account = user.Accounts.FirstOrDefault(a => a.AccountId == request.AccountId);
             if (account == null) return BadRequest("Account not linked to this user");

             user.Accounts.Remove(account);
             await _context.SaveChangesAsync(ct);
             return Ok(new { message = "Account unlinked" });
        }
        [HttpGet("audit")]
        public async Task<IActionResult> GetAuditLogs(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    CancellationToken ct = default)
        {
            if (page < 1) page = 1;
            if (pageSize > 100) pageSize = 100;
            if (pageSize < 1) pageSize = 10;

            var logs = await _auditService.GetLogsAsync(page, pageSize, ct);
            var total = await _auditService.GetTotalCountAsync(ct);

            return Ok(new
            {
                Data = logs,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            });
        }
        [HttpPost("import/bills")]
        public async Task<IActionResult> ImportBills([FromBody] List<ImportBillDto> request, CancellationToken ct)
        {
            if (request == null || !request.Any()) return BadRequest("Нет данных");

            var importData = request.Select(dto =>
            {
                var bill = new Bill
                {
                    Period = dto.Period,
                    BillItems = dto.Items.Select(i => new BillItem
                    {
                        ServiceName = i.ServiceName,
                        Tariff = i.Tariff,
                        Consumption = i.Consumption,
                        Amount = i.Tariff * i.Consumption
                    }).ToList()
                };
                bill.TotalAmount = bill.BillItems.Sum(x => x.Amount);

                return (dto.AccountNumber, bill);
            }).ToList();

            var result = await _billService.ImportBillsAsync(importData, ct);

            return Ok(new { message = result });
        }
    }
}