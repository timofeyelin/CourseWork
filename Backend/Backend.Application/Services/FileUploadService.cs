using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Backend.Application.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public FileUploadService(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string subfolder)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Файл не выбран или пуст.");
            }

            var uploadsRootFolder = Path.Combine(_hostingEnvironment.WebRootPath, subfolder);
            if (!Directory.Exists(uploadsRootFolder))
            {
                Directory.CreateDirectory(uploadsRootFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsRootFolder, uniqueFileName);

            await using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            
            // Возвращаем относительный URI, доступный из веба
            return $"/{subfolder}/{uniqueFileName}";
        }

        public void DeleteFile(string fileUri)
        {
            if (string.IsNullOrEmpty(fileUri)) return;
            
            // Преобразуем URI в физический путь
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, fileUri.TrimStart('/'));

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}