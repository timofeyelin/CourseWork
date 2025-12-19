using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/categories")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly IAppDbContext _context;
        private readonly ICategoryService _categoryService;
        private readonly IAuditService _auditService;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(IAppDbContext context, ICategoryService categoryService, IAuditService auditService, ILogger<CategoriesController> logger)
        {
            _context = context;
            _categoryService = categoryService;
            _auditService = auditService;
            _logger = logger;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<List<RequestCategoryDto>>> GetAll(CancellationToken ct)
        {
            var items = await _context.RequestCategories
                .OrderBy(c => c.Name)
                .Select(c => new RequestCategoryDto { Id = c.Id, Name = c.Name })
                .ToListAsync(ct);

            return Ok(items);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto, CancellationToken ct)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(dto.Name, ct);

                try
                {
                    await _auditService.LogAsync(
                        GetUserId(),
                        "CreateCategory",
                        "RequestCategory",
                        category.Id.ToString(),
                        $"Создана категория: {dto.Name}",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

                return Ok(new RequestCategoryDto { Id = category.Id, Name = category.Name });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            try
            {
                await _categoryService.DeleteCategoryAsync(id, ct);

                try
                {
                    await _auditService.LogAsync(
                        GetUserId(),
                        "DeleteCategory",
                        "RequestCategory",
                        id.ToString(),
                        "Категория удалена",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}