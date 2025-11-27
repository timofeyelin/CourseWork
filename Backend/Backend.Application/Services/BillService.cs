using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;


namespace Backend.Application.Services
{
    public class BillService : IBillService
    {
        private readonly IAppDbContext _context;
        private readonly IPdfGeneratorService _pdfGeneratorService;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public BillService(IAppDbContext context, IPdfGeneratorService pdfGeneratorService, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _pdfGeneratorService = pdfGeneratorService;
            _hostingEnvironment = hostingEnvironment;
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
            var directoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "bills");
            
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);
            await File.WriteAllBytesAsync(filePath, pdfBytes, ct);

            billWithDetails.PdfLink = $"/bills/{fileName}";
            _context.Bills.Update(billWithDetails);
            await _context.SaveChangesAsync(ct);

            return billWithDetails;
        }

        public async Task<List<Bill>> GetUserBillsAsync(CancellationToken ct, int userId)
        {
            return await _context.Bills
                .Include(b => b.Account) 
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
                .Where(b => b.AccountId == accountId)
                .OrderByDescending(b => b.Period)
                .ToListAsync(ct);
        }

        public async Task<Bill> GetBillDetailsAsync(CancellationToken ct, int userId, int billId)
        {
            var bill = await _context.Bills
                .Include(b => b.BillItems) 
                .Include(b => b.Account) 
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
    }
}