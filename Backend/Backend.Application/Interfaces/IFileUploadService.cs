using Microsoft.AspNetCore.Http;

namespace Backend.Application.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, string subfolder);
        void DeleteFile(string fileUri);
    }
}