using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/documents")]
    [Authorize]
    public class DocumentsController : ControllerBase
    {
        private readonly IBillService _billService;
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _env;

        public DocumentsController(IBillService billService, IUserService userService, IWebHostEnvironment env)
        {
            _billService = billService;
            _userService = userService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<List<DocumentDto>>> GetAll([FromQuery] string? type, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var documents = new List<DocumentDto>();

            if (string.IsNullOrEmpty(type) || type == "receipt")
            {
                var bills = await _billService.GetUserBillsAsync(ct, userId);
                var receipts = bills.Select(b => new DocumentDto
                {
                    Id = b.BillId,
                    Title = $"Квитанция за {b.Period:MMMM yyyy}",
                    Type = "pdf",
                    CreatedAt = b.CreatedAt,
                    Category = "receipt",
                    Size = 1024 * 150
                });
                documents.AddRange(receipts);
            }

            if (string.IsNullOrEmpty(type) || type == "contract")
            {
                documents.Add(new DocumentDto
                {
                    Id = 10001,
                    Title = "Договор управления МКД",
                    Type = "pdf",
                    CreatedAt = new DateTime(2023, 1, 15),
                    Category = "contract",
                    Size = 1024 * 2500
                });
            }

            return Ok(documents.OrderByDescending(d => d.CreatedAt));
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            
            if (id > 10000)
            {
                 return NotFound("Файл не найден (тестовые данные).");
            }

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var bill = await _billService.GetBillByIdAsync(id);
            
            if (bill == null) return NotFound();
            
            if (!await _userService.DoesUserOwnAccount(userId, bill.AccountId))
            {
                return Forbid();
            }

            if (string.IsNullOrEmpty(bill.PdfLink))
            {
                return NotFound("PDF файл не сгенерирован.");
            }

            var relativePath = bill.PdfLink.TrimStart('/');
            var filePath = Path.Combine(_env.WebRootPath, relativePath);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Файл не найден на сервере.");
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
