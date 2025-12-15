using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] 
    public class AdminController : ControllerBase
    {
        private readonly IBillService _billService;
        private readonly IAppDbContext _context;

        public AdminController(IBillService billService, IAppDbContext context)
        {
            _billService = billService;
            _context = context;
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

        [HttpPost("add-meter")]
        public async Task<IActionResult> AddMeter(int accountId, MeterType type, string serialNumber)
        {
            var account = await _context.Accounts.FindAsync(accountId);
            if (account == null)
                return NotFound("Account not found");

            var meter = new Meter
            {
                AccountId = accountId,
                Type = type,
                SerialNumber = serialNumber,
                InstallationDate = DateTime.UtcNow
            };

            _context.Meters.Add(meter);
            await _context.SaveChangesAsync(CancellationToken.None);

            return Ok(meter);
        }
        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics(CancellationToken ct)
        {
            // 1. KPI: Общие суммы
            // Считаем сколько всего начислено по всем счетам
            var totalCharged = await _context.Bills.SumAsync(b => b.TotalAmount, ct);

            // Считаем сколько реально оплачено (статус Paid)
            var totalPaid = await _context.Payment
                .Where(p => p.Status == Backend.Domain.Enums.PaymentStatus.Paid)
                .SumAsync(p => p.Amount, ct);

            // Долг = Начислено - Оплачено
            var totalDebt = totalCharged - totalPaid;

            // 2. График: Начисления за последние 6 месяцев
            var sixMonthsAgo = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-6));

            var chartData = await _context.Bills
                .Where(b => b.Period >= sixMonthsAgo)
                .GroupBy(b => b.Period)
                .Select(g => new
                {
                    Date = g.Key,
                    Amount = g.Sum(b => b.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync(ct);

            return Ok(new
            {
                kpi = new
                {
                    totalCharged,
                    totalPaid,
                    totalDebt
                },
                chart = chartData
            });
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