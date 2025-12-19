using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/operator/requests")]
    [Authorize(Roles = "Operator")]
    public class OperatorRequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private readonly IAuditService _auditService;
        private readonly ILogger<OperatorRequestController> _logger;

        public OperatorRequestController(IRequestService requestService, IAuditService auditService, ILogger<OperatorRequestController> logger)
        {
            _requestService = requestService;
            _auditService = auditService;
            _logger = logger;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<List<OperatorRequestDto>>> GetRequests(
            [FromQuery] RequestStatus? status,
            [FromQuery] int? categoryId,
            [FromQuery] string? search,
            CancellationToken ct)
        {
            var requests = await _requestService.GetAllRequestsForOperatorAsync(status, categoryId, search, ct);
            var dtos = requests.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpPatch("{requestId}")]
        public async Task<IActionResult> UpdateRequest(int requestId, [FromBody] UpdateOperatorRequestDto dto, CancellationToken ct)
        {
            try
            {
                bool updateDeadline = dto.Deadline.HasValue;
                DateTime? deadline = null;

                if (updateDeadline)
                {
                    if (dto.Deadline.Value.ValueKind == JsonValueKind.Null)
                    {
                        deadline = null; // очистить
                    }
                    else
                    {
                        deadline = dto.Deadline.Value.GetDateTime();
                    }
                }

                await _requestService.UpdateRequestByOperatorAsync(
                    requestId,
                    dto.Status,
                    dto.Priority,
                    deadline,
                    updateDeadline,
                    ct);

                try
                {
                    var details = new List<string>();
                    if (dto.Status.HasValue) details.Add($"Статус: {dto.Status}");
                    if (dto.Priority.HasValue) details.Add($"Приоритет: {dto.Priority}");
                    if (updateDeadline) details.Add($"Дедлайн: {(deadline.HasValue ? deadline.Value.ToString("dd.MM.yyyy") : "очищен")}");

                    await _auditService.LogAsync(
                        GetUserId(),
                        "OperatorUpdateRequest",
                        "Request",
                        requestId.ToString(),
                        string.Join(", ", details),
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        private static OperatorRequestDto MapToDto(Request r) => new()
        {
            RequestId = r.RequestId,
            Description = r.Description,
            ShortDescription = r.Description.Length > 60 ? r.Description[..60] + "..." : r.Description,
            Status = r.Status,
            Category = r.Category?.Name ?? "Не указана",
            Priority = r.Priority,
            CreatedAt = r.CreatedAt,
            Deadline = r.Deadline,
            Address = r.Account?.Address ?? "—",
            AccountNumber = r.Account?.AccountNumber ?? "—",
            ApplicantName = r.Account?.User?.FullName ?? "Неизвестно",
            ApplicantPhone = r.Account?.User?.Phone 
        };
    }
}