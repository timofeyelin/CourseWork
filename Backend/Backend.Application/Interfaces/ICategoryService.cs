using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<RequestCategory> CreateCategoryAsync(string name, CancellationToken ct);
        Task DeleteCategoryAsync(int id, CancellationToken ct);
    }
}