using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class RequestService : IRequestService
    {
        private readonly IAppDbContext _context;
        private readonly INotificationService _notificationService;

        public RequestService(IAppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<List<Request>> GetUserRequestsAsync(int userId, CancellationToken ct)
        {
            return await _context.Requests
                .Where(r => r.Account != null && r.Account.UserId == userId)
                .Include(r => r.Account)
                .Include(r => r.Category)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task<Request> GetRequestDetailsAsync(int userId, UserRole userRole, int requestId, CancellationToken ct)
        {
            var request = await _context.Requests
                .Include(r => r.Account)
                .Include(r => r.Category)
                .Include(r => r.Comments)
                    .ThenInclude(c => c.Author)
                .Include(r => r.Attachments)
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);

            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            var isOwner = request.Account?.UserId == userId;
            var isStaff = userRole == UserRole.Admin || userRole == UserRole.Operator;

            if (!isOwner && !isStaff)
                throw new UnauthorizedAccessException("У вас нет доступа к этой заявке.");

            return request;
        }
        
        public async Task<Request> CreateRequestAsync(int userId, int accountId, int categoryId, string description, CancellationToken ct)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == accountId && a.UserId == userId, ct);
            if (account == null)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к этому лицевому счету.");
            }

            var category = await _context.RequestCategories
                .FirstOrDefaultAsync(c => c.Id == categoryId, ct);
            
            if (category == null)
                throw new ArgumentException("Категория не найдена.", nameof(categoryId));

            var newRequest = new Request
            {
                AccountId = accountId,
                CategoryId = categoryId,
                Category = category,
                Description = description,
                Status = RequestStatus.New,
                CreatedAt = DateTime.UtcNow
            };

            _context.Requests.Add(newRequest);
            await _context.SaveChangesAsync(ct);

            return newRequest;
        }

        public async Task<RequestComment> AddCommentAsync(int userId, UserRole userRole, int requestId, string text, CancellationToken ct)
        {
            var request = await _context.Requests
                .Include(r => r.Account)
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);
            
            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            bool isOwner = request.Account?.UserId == userId;
            bool isStaff = userRole == UserRole.Admin || userRole == UserRole.Operator;

            if (!isOwner && !isStaff)
                throw new UnauthorizedAccessException("У вас нет прав для комментирования этой заявки.");

            var newComment = new RequestComment
            {
                RequestId = requestId,
                AuthorId = userId,
                Text = text,
                CreatedAt = DateTime.UtcNow
            };

            _context.RequestComments.Add(newComment);
            await _context.SaveChangesAsync(ct);
            return newComment;
        }

        public async Task<Request> RateRequestAsync(int userId, int requestId, int rating, string? comment, CancellationToken ct)
        {
            var request = await _context.Requests
                .Include(r => r.Account)
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);

            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            // КЛЮЧЕВОЕ: оценивать может ТОЛЬКО владелец заявки
            if (request.Account?.UserId != userId)
                throw new UnauthorizedAccessException("Оценить заявку может только её владелец.");

            if (request.Status != RequestStatus.Closed)
                throw new InvalidOperationException("Оставить оценку можно только для закрытой заявки.");

            if (rating < 1 || rating > 5)
                throw new ArgumentOutOfRangeException(nameof(rating), "Оценка должна быть в диапазоне от 1 до 5.");

            request.Rating = rating;
            request.Comment = comment;

            await _context.SaveChangesAsync(ct);
            return request;
        }
        
        public async Task<Request> UpdateRequestStatusAsync(int requestId, RequestStatus newStatus, CancellationToken ct)
        {
            var request = await _context.Requests.Include(r => r.Account).FirstOrDefaultAsync(r => r.RequestId == requestId, ct);
            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            bool isValidTransition = (request.Status == RequestStatus.New && newStatus == RequestStatus.InProgress) ||
                                     (request.Status == RequestStatus.InProgress && newStatus == RequestStatus.Closed);

            if (!isValidTransition)
            {
                throw new InvalidOperationException($"Нельзя изменить статус заявки с '{request.Status}' на '{newStatus}'.");
            }
            
            request.Status = newStatus;
            if (newStatus == RequestStatus.Closed)
            {
                request.ClosedAt = DateTime.UtcNow;
            }
            else
            {
                request.ClosedAt = null;
            }

            await _context.SaveChangesAsync(ct);

            if (request.Account != null)
            {
                await _notificationService.CreateNotificationAsync(
                    request.Account.UserId.Value,
                    NotificationType.Request,
                    "Статус заявки изменен",
                    $"Заявка №{requestId} переведена в статус {newStatus}",
                    requestId,
                    ct
                );
            }

            return request;
        }

        public async Task<bool> ValidateUserAccessAsync(int userId, int requestId, CancellationToken ct)
        {
            return await _context.Requests
                .AnyAsync(r => r.RequestId == requestId && r.Account != null && r.Account.UserId == userId, ct);
        }

        private async Task<Request> GetRequestAndValidateUserAccessAsync(int userId, int requestId, CancellationToken ct)
        {
            var request = await _context.Requests
                .Include(r => r.Account)
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);

            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            if (!await ValidateUserAccessAsync(userId, requestId, ct))
                throw new UnauthorizedAccessException("У вас нет доступа к этой заявке.");
            
            return request;
        }

        public async Task<RequestAttachment> AddAttachmentAsync(int userId, int requestId, string fileUri, string fileType, CancellationToken ct)
        {
            if (!await ValidateUserAccessAsync(userId, requestId, ct))
                throw new UnauthorizedAccessException("У вас нет доступа к этой заявке.");

            var attachment = new RequestAttachment
            {
                RequestId = requestId,
                FileUri = fileUri,
                FileType = fileType,
                UploadedAt = DateTime.UtcNow
            };

            _context.RequestAttachments.Add(attachment);
            await _context.SaveChangesAsync(ct);
            return attachment;
        }

        // Backend.Application.Services.RequestService

        public async Task<List<Request>> GetAllRequestsForOperatorAsync(RequestStatus? status, int? categoryId, string? search, CancellationToken ct)
        {
            var query = _context.Requests
                .Include(r => r.Account)
                .ThenInclude(a => a.User)
                .Include(r => r.Category)
                .AsQueryable();

            if (status.HasValue) 
                query = query.Where(r => r.Status == status.Value);

            if (categoryId.HasValue)
                query = query.Where(r => r.CategoryId == categoryId.Value);

            if (!string.IsNullOrEmpty(search))
            {
                var ls = search.ToLower();
                query = query.Where(r => 
                    r.Description.ToLower().Contains(ls) || 
                    (r.Account != null && r.Account.Address.ToLower().Contains(ls)));
            }

            return await query
                .OrderByDescending(r => r.Priority)
                .ThenByDescending(r => r.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task<Request> UpdateRequestByOperatorAsync(int requestId, RequestStatus? status, RequestPriority? priority, DateTime? deadline, bool updateDeadline, CancellationToken ct)
        {
            var request = await _context.Requests
                .Include(r => r.Account)
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);

            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            bool statusChanged = false;

            if (status.HasValue && request.Status != status.Value)
            {
                request.Status = status.Value;
                statusChanged = true;

                if (status.Value == RequestStatus.Closed)
                {
                    request.ClosedAt = DateTime.UtcNow;
                }
                else if (status.Value == RequestStatus.New)
                {
                    request.Rating = null;
                    request.Comment = null;
                    request.ClosedAt = null;
                }
            }

            if (priority.HasValue)
                request.Priority = priority.Value;

            if (updateDeadline)
                request.Deadline = deadline;

            await _context.SaveChangesAsync(ct);

            if (statusChanged && request.Account?.UserId != null)
            {
                await _notificationService.CreateNotificationAsync(
                    request.Account.UserId.Value,
                    NotificationType.Request,
                    "Статус заявки изменен",
                    $"Статус вашей заявки №{request.RequestId} изменён на \"{request.Status}\".",
                    requestId,
                    ct
                );
            }

            return request;
        }
    }
}