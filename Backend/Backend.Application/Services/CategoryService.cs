using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IAppDbContext _context;

        public CategoryService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<RequestCategory> CreateCategoryAsync(string name, CancellationToken ct)
        {
            // Проверка на дубликаты
            var exists = await _context.RequestCategories.AnyAsync(c => c.Name == name, ct);
            if (exists)
                throw new InvalidOperationException("Такая категория уже существует.");

            var category = new RequestCategory { Name = name };
            _context.RequestCategories.Add(category);
            await _context.SaveChangesAsync(ct);
            return category;
        }

        public async Task DeleteCategoryAsync(int id, CancellationToken ct)
        {
            var category = await _context.RequestCategories
                .Include(c => c.Requests)
                .FirstOrDefaultAsync(c => c.Id == id, ct);

            if (category == null)
                throw new KeyNotFoundException("Категория не найдена.");

            // Проверка: нельзя удалить категорию, если по ней есть заявки
            if (category.Requests.Any())
                throw new InvalidOperationException("Нельзя удалить категорию, к которой привязаны заявки.");

            _context.RequestCategories.Remove(category);
            await _context.SaveChangesAsync(ct);
        }
    }
}