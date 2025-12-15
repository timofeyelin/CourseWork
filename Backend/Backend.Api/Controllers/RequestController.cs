using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/requests")]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private readonly IFileUploadService _fileUploadService;
        private readonly IUserService _userService;

        public RequestController(IRequestService requestService, IFileUploadService fileUploadService, IUserService userService)
        {
            _requestService = requestService;
            _fileUploadService = fileUploadService;
            _userService = userService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private UserRole GetUserRole()
        {
            var roleValue = User.FindFirstValue(ClaimTypes.Role);
            return Enum.TryParse<UserRole>(roleValue, out var role)
                ? role
                : UserRole.Resident;
        }


        [HttpGet]
        public async Task<ActionResult<List<RequestListDto>>> GetUserRequests(CancellationToken ct)
        {
            var requests = await _requestService.GetUserRequestsAsync(GetUserId(), ct);
            var dtos = requests.Select(r => new RequestListDto
            {
                RequestId = r.RequestId,
                Category = r.Category,
                Description = r.Description,
                Status = r.Status,
                CreatedAt = r.CreatedAt,
                Rating = r.Rating,

                Priority = (int)r.Priority,
                Deadline = r.Deadline
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("{requestId}")]
        public async Task<ActionResult<RequestDetailsDto>> GetRequestDetails(int requestId, CancellationToken ct)
        {
            try
            {
                var request = await _requestService.GetRequestDetailsAsync(GetUserId(), GetUserRole(),requestId, ct);
                var dto = new RequestDetailsDto
                {
                    RequestId = request.RequestId,
                    AccountId = request.AccountId,
                    Category = request.Category,
                    Description = request.Description,
                    Status = request.Status,
                    CreatedAt = request.CreatedAt,
                    ClosedAt = request.ClosedAt,
                    Rating = request.Rating,
                    UserCommentOnRating = request.Comment,
                    Priority = (int)request.Priority,
                    Deadline = request.Deadline,
                    Comments = request.Comments.Select(c => new RequestCommentDto
                    {
                        CommentId = c.CommentId,
                        AuthorId = c.AuthorId,
                        AuthorName = c.Author?.FullName ?? "Пользователь",
                        Text = c.Text,
                        CreatedAt = c.CreatedAt
                    }).ToList(),
                    Attachments = request.Attachments.Select(a => new RequestAttachmentDto
                    {
                        AttachmentId = a.AttachmentId,
                        FileUri = a.FileUri,
                        FileType = a.FileType,
                        UploadedAt = a.UploadedAt
                    }).ToList()
                };
                return Ok(dto);
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException) { return Forbid(); }
        }
        
        [HttpPost]
        public async Task<ActionResult<RequestDetailsDto>> CreateRequest([FromBody] CreateRequest dto, CancellationToken ct)
        {
            try
            {   var userId = GetUserId();
                var newRequest = await _requestService.CreateRequestAsync(userId, dto.AccountId, dto.Category, dto.Description, ct);
                
                var response = new RequestDetailsDto
                {
                    RequestId = newRequest.RequestId,
                    AccountId = newRequest.AccountId,
                    Category = newRequest.Category,
                    Description = newRequest.Description,
                    Status = newRequest.Status,
                    CreatedAt = newRequest.CreatedAt,
                    ClosedAt = newRequest.ClosedAt,
                    Rating = newRequest.Rating,
                    UserCommentOnRating = newRequest.Comment,
                    Priority = (int)newRequest.Priority,
                    Deadline = newRequest.Deadline,
                    Comments = new (),
                    Attachments = new ()
                };

                return CreatedAtAction(nameof(GetRequestDetails), new { requestId = newRequest.RequestId}, response);
            }
            catch (UnauthorizedAccessException) { return Forbid();}
        }

        [Authorize(Roles = "Admin,Operator")]
        [HttpPut("{requestId}/status")]
        public async Task<IActionResult> UpdateStatus(int requestId, [FromBody] UpdateStatusRequest dto, CancellationToken ct)
        {
            try
            {
                await _requestService.UpdateRequestStatusAsync(requestId, dto.Status, ct);
                return NoContent();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPost("{requestId}/comments")]
        public async Task<ActionResult<RequestCommentDto>> AddComment(int requestId, [FromBody] AddCommentRequestDto dto, CancellationToken ct)
        {
            try
            {
                var userId = GetUserId();
                var userRole = GetUserRole();

                var comment =  await _requestService.AddCommentAsync(userId, userRole, requestId, dto.Text, ct);
                var author = await _userService.GetProfileAsync(ct, comment.AuthorId);
                
                var commentDto = new RequestCommentDto {
                    CommentId = comment.CommentId,
                    AuthorId = comment.AuthorId,
                    AuthorName = author.FullName,
                    Text = comment.Text,
                    CreatedAt = comment.CreatedAt
                };
                return Ok(commentDto);
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException ex) { return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); }
        }

        [HttpPost("{requestId}/rate")]
        public async Task<IActionResult> RateRequest(int requestId, [FromBody] RateRequest dto, CancellationToken ct)
        {
            try
            {
                await _requestService.RateRequestAsync(GetUserId(), requestId, dto.Rating, dto.Comment, ct);
                return NoContent();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
            catch (ArgumentOutOfRangeException ex) { return BadRequest(new { message = ex.Message }); }
        }
        
        [HttpPost("{requestId}/attachments")]
        public async Task<ActionResult<RequestAttachmentDto>> UploadAttachment(int requestId, IFormFile file, CancellationToken ct)
        {
            try
            {
                if (!await _requestService.ValidateUserAccessAsync(GetUserId(), requestId, ct))
                    return Forbid();

                var fileUri = await _fileUploadService.UploadFileAsync(file, ct);

                var attachment = await _requestService.AddAttachmentAsync(GetUserId(), requestId, fileUri, file.ContentType, ct);

                var dto = new RequestAttachmentDto
                {
                    AttachmentId = attachment.AttachmentId,
                    FileUri = attachment.FileUri,
                    FileType = attachment.FileType,
                    UploadedAt = attachment.UploadedAt
                };
                return Ok(dto);
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (ArgumentException ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpDelete("{requestId}/attachments/{attachmentId}")]
        public async Task<IActionResult> DeleteAttachment(int requestId, int attachmentId, CancellationToken ct)
        {
            var userId = GetUserId();

            try
            {
                // удаление вложений оставляем только владельцу
                if (!await _requestService.ValidateUserAccessAsync(userId, requestId, ct))
                    return Forbid();

                var request = await _requestService.GetRequestDetailsAsync(userId, UserRole.Resident, requestId, ct);

                if (request.Attachments.All(a => a.AttachmentId != attachmentId))
                    return Forbid();

                await _fileUploadService.DeleteFileAsync(attachmentId, ct);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(new { message = "Заявка не найдена." }); }
            catch (UnauthorizedAccessException) { return Forbid(); }
        }
    }
}