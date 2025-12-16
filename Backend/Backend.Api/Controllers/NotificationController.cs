using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize] // Только для авторизованных
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<NotificationsResponseDto>> GetNotifications(CancellationToken ct)
        {
            var userId = GetUserId();

            var notifications = await _notificationService.GetUserNotificationsAsync(userId, ct);
            var unreadCount = await _notificationService.GetUnreadCountAsync(userId, ct);

            var items = notifications.Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                Type = n.Type.ToString(),
                Title = n.Title,
                Text = n.Text,
                CreatedAt = n.CreatedAt,
                IsRead = n.IsRead,
                RelatedEntityId = n.RelatedEntityId,
                IsUrgent = n.Type.ToString() == "Announcement" || n.Type.ToString() == "Outage"
            }).ToList();
 
            var urgentUnreadCount = items.Count(i => i.IsUrgent && !i.IsRead);

            return Ok(new NotificationsResponseDto
            {
                UnreadCount = unreadCount,
                UrgentUnreadCount = urgentUnreadCount,
                Items = items
            });
        }

        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkAllAsRead(CancellationToken ct)
        {
            await _notificationService.MarkAllAsReadAsync(GetUserId(), ct);
            return NoContent();
        }

        [HttpPost("{notificationId:int}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int notificationId, CancellationToken ct)
        {
            await _notificationService.MarkAsReadAsync(GetUserId(), notificationId, ct);
            return NoContent();
        }
    }
}