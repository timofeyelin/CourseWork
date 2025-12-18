using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/announcements")]
    [Authorize]
    public class AnnouncementController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;

        public AnnouncementController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<AnnouncementDto>>> GetAllAnnouncements([FromQuery] AnnouncementType? type, CancellationToken ct)
        {
            int? userId = null;
            if (User.Identity?.IsAuthenticated == true)
            {
                userId = GetUserId();
            }

            var announcements = await _announcementService.GetAllAnnouncementsAsync(userId, type, ct);
            var dtos = announcements.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpGet("unread")]
        public async Task<ActionResult<List<AnnouncementDto>>> GetUnreadAnnouncements(CancellationToken ct)
        {
            var announcements = await _announcementService.GetUnreadAnnouncementsAsync(GetUserId(), ct);
            var dtos = announcements.Select(MapToDto).ToList();
            return Ok(dtos);
        }

        [HttpPost("{announcementId}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int announcementId, CancellationToken ct)
        {
            try
            {
                await _announcementService.MarkAsReadAsync(GetUserId(), announcementId, ct);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<ActionResult<AnnouncementDto>> CreateAnnouncement([FromBody] CreateAnnouncementRequest dto, CancellationToken ct)
        {
            var announcement = await _announcementService.CreateAnnouncementAsync(dto.Title, dto.Content, dto.Type, ct);
            return CreatedAtAction(nameof(GetAllAnnouncements), new { id = announcement.AnnouncementId }, MapToDto(announcement));
        }

        [HttpPut("{announcementId}")]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<ActionResult<AnnouncementDto>> UpdateAnnouncement(int announcementId, [FromBody] CreateAnnouncementRequest dto, CancellationToken ct)
        {
            try
            {
                var updated = await _announcementService.UpdateAnnouncementAsync(announcementId, dto.Title, dto.Content, dto.Type, ct);
                return Ok(MapToDto(updated));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{announcementId}")]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<IActionResult> DeleteAnnouncement(int announcementId, CancellationToken ct)
        {
            try
            {
                await _announcementService.DeleteAnnouncementAsync(announcementId, ct);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        private static AnnouncementDto MapToDto(Announcement announcement)
        {
            return new AnnouncementDto
            {
                AnnouncementId = announcement.AnnouncementId,
                Title = announcement.Title,
                Content = announcement.Content,
                CreatedAt = announcement.CreatedAt,
                Type = announcement.Type,
                IsRead = announcement.Reads.Any()
            };
        }
    }
}