using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BillController : ControllerBase
    {
        private readonly IAppDbContext _context;
        public BillController(IAppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{billId}/pdf")]
        public async Task<IActionResult> GetBillPdf(int billId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            var bill = await _context.Bills
                .Include(b => b.Account)
                .FirstOrDefaultAsync(b => b.BillId == billId);

            if (bill == null)
            {
                return NotFound("Счет не найден.");
            }

            if (bill.Account?.UserId.ToString() != userId && userRole != "Admin")
            {
                return Forbid("У вас нет доступа к этому счету.");
            }

            if (string.IsNullOrEmpty(bill.PdfLink))
            {
                return NotFound("PDF для этого счета еще не создан или находится в обработке.");
            }

            return LocalRedirect(bill.PdfLink);
        }
    }
}