using Microsoft.AspNetCore.Http;

namespace Backend.Application.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, CancellationToken ct);
        Task<string?> GetFileUriAsync(int attachmentId, CancellationToken ct);
        Task DeleteFileAsync(int attachmentId, CancellationToken ct);
    }
}