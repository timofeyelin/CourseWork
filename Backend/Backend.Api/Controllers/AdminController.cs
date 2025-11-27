using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

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

        [HttpPost("generate-test-bill")]
        public async Task<IActionResult> GenerateTestBill([FromQuery] int accountId, CancellationToken ct)
        {
            var account = await _context.Accounts.FindAsync(new object[] { accountId }, ct);
            if (account == null)
            {
                return NotFound($"Account with ID {accountId} not found.");
            }

            // Тестовый счет
            var newBill = new Bill
            {
                AccountId = accountId,
                Period = DateOnly.FromDateTime(DateTime.UtcNow),
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
    }
}