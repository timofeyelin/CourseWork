using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/operator/requests")]
    [Authorize(Roles = "Operator")]
    public class OperatorRequestController : ControllerBase
    {
        private readonly IRequestService _requestService;

        public OperatorRequestController(IRequestService requestService)
        {
            _requestService = requestService;
        }

        [HttpGet]
        public async Task<ActionResult<List<OperatorRequestDto>>> GetRequests(
            [FromQuery] RequestStatus? status,
            [FromQuery] string? category,
            [FromQuery] string? search,
            CancellationToken ct)
        {
            var requests = await _requestService.GetAllRequestsForOperatorAsync(status, category, search, ct);
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
            Category = r.Category,
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