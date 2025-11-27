using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/bills")]
    [Authorize]
    public class BillController : ControllerBase
    {
        private readonly IBillService _billService;
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _env;

        public BillController(IBillService billService, IUserService userService, IWebHostEnvironment env)
        {
            _billService = billService;
            _userService = userService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<List<BillDto>>> GetUserBills(CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var bills = await _billService.GetUserBillsAsync(ct, userId);

            var billDtos = bills.Select(b => new BillDto
            {
                BillId = b.BillId,
                AccountId = b.AccountId,
                Period = b.Period.ToDateTime(TimeOnly.MinValue),
                TotalAmount = b.TotalAmount,
                Status = b.Payment.Any(p => p.Status == PaymentStatus.Paid) 
                            ? PaymentStatus.Paid 
                            : PaymentStatus.Pending
            }).ToList();

            return Ok(billDtos);
        }

        [HttpGet("account/{accountId}")]
        public async Task<ActionResult<List<BillDto>>> GetAccountBills(int accountId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (!await _userService.DoesUserOwnAccount(userId, accountId))
            {
                return Forbid("У вас нет доступа к этому счету.");
            }

            var bills = await _billService.GetAccountBillsAsync(ct, userId, accountId);
            
            var billDtos = bills.Select(b => new BillDto
            {
                BillId = b.BillId,
                AccountId = b.AccountId,
                Period = b.Period.ToDateTime(TimeOnly.MinValue),
                TotalAmount = b.TotalAmount,
                Status = b.Payment.Any(p => p.Status == PaymentStatus.Paid) 
                            ? PaymentStatus.Paid 
                            : PaymentStatus.Pending
            }).ToList();
            
            return Ok(billDtos);
        }

        [HttpGet("{billId}")]
        public async Task<ActionResult<BillDetailsDto>> GetBillDetails(int billId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            try
            {
                var bill = await _billService.GetBillDetailsAsync(ct, userId, billId);
                
                var billDetailsDto = new BillDetailsDto
                {
                    BillId = bill.BillId,
                    AccountId = bill.AccountId,
                    AccountNumber = bill.Account?.AccountNumber ?? "N/A",
                    Address = bill.Account?.Address ?? "N/A",
                    Period = bill.Period.ToDateTime(TimeOnly.MinValue),
                    TotalAmount = bill.TotalAmount,
                    CreatedAt = bill.CreatedAt,
                    HasPdf = !string.IsNullOrEmpty(bill.PdfLink),
                    Status = bill.Payment.Any(p => p.Status == PaymentStatus.Paid) 
                                ? PaymentStatus.Paid 
                                : PaymentStatus.Pending,
                    BillItems = bill.BillItems.Select(bi => new BillItemDto
                    {
                        BillItemId = bi.BillItemId,
                        ServiceName = bi.ServiceName,
                        Amount = bi.Amount,
                        Consumption = bi.Consumption, 
                        Tariff = bi.Tariff
                    }).ToList()
                };

                return Ok(billDetailsDto);
            }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
        }

        [HttpGet("{billId}/pdf")]
        public async Task<IActionResult> DownloadBillPdf(int billId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var bill = await _billService.GetBillByIdAsync(billId);
            if (bill?.Account == null)
            {
                return NotFound();
            }

            if (!await _userService.DoesUserOwnAccount(userId, bill.AccountId))
            {
                return Forbid("У вас нет доступа к этому счету.");
            }

            if (string.IsNullOrEmpty(bill.PdfLink))
            {
                return NotFound("PDF файл не сгенерирован для этого счета.");
            }

            var relativePath = bill.PdfLink.TrimStart('/');
            var filePath = Path.Combine(_env.WebRootPath, relativePath);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("PDF файл не найден на сервере.");
            }

            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return File(memory, "application/pdf", Path.GetFileName(filePath));
        }
    }
}