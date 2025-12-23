using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAppDbContext _context;

        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".pdf" };

        public FileUploadService(IWebHostEnvironment hostingEnvironment, IAppDbContext context)
        {
            _hostingEnvironment = hostingEnvironment;
            _context = context;
        }

        public async Task<string> UploadFileAsync(IFormFile file, CancellationToken ct)
        {
            ValidateFile(file);

            var subfolder = "attachments";
            var uploadsRootFolder = Path.Combine(_hostingEnvironment.WebRootPath, subfolder);
            if (!Directory.Exists(uploadsRootFolder))
            {
                Directory.CreateDirectory(uploadsRootFolder);
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsRootFolder, uniqueFileName);

            await using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream, ct);
            }
            
            return $"/{subfolder}/{uniqueFileName}";
        }

        public async Task<string?> GetFileUriAsync(int attachmentId, CancellationToken ct)
        {
            var attachment = await _context.RequestAttachments
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.AttachmentId == attachmentId, ct);
            
            return attachment?.FileUri;
        }

        public async Task DeleteFileAsync(int attachmentId, CancellationToken ct)
        {
            var attachment = await _context.RequestAttachments
                .FirstOrDefaultAsync(a => a.AttachmentId == attachmentId, ct);

            if (attachment == null)
            {
                return; 
            }

            if (!string.IsNullOrEmpty(attachment.FileUri))
            {
                var filePath = Path.Combine(_hostingEnvironment.WebRootPath, attachment.FileUri.TrimStart('/'));
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }

            _context.RequestAttachments.Remove(attachment);
            await _context.SaveChangesAsync(ct);
        }

        private void ValidateFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Файл не выбран или пуст.");
            
            if (file.Length > MaxFileSize)
                throw new ArgumentException($"Размер файла не должен превышать {MaxFileSize / 1024 / 1024} МБ.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
                throw new ArgumentException("Недопустимый тип файла. Разрешены только: " + string.Join(", ", AllowedExtensions));
        }
    }
}