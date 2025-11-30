using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class RequestService : IRequestService
    {
        private readonly IAppDbContext _context;

        public RequestService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Request>> GetUserRequestsAsync(int userId, CancellationToken ct)
        {
            return await _context.Requests
                .Where(r => r.Account != null && r.Account.UserId == userId)
                .Include(r => r.Account)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task<Request> GetRequestDetailsAsync(int userId, int requestId, CancellationToken ct)
        {
            var request = await _context.Requests
                .Include(r => r.Account) 
                .Include(r => r.Comments)
                    .ThenInclude(c => c.Author) 
                .Include(r => r.Attachments) 
                .FirstOrDefaultAsync(r => r.RequestId == requestId, ct);

            if (request == null)
                throw new KeyNotFoundException("Заявка не найдена.");

            if (request.Account?.UserId != userId)
                throw new UnauthorizedAccessException("У вас нет доступа к этой заявке.");

            return request;
        }
        
        public async Task<Request> CreateRequestAsync(int userId, int accountId, string category, string description, CancellationToken ct)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountId == accountId && a.UserId == userId, ct);
            if (account == null)
            {
                throw new UnauthorizedAccessException("У вас нет доступа к этому лицевому счету.");
            }

            var newRequest = new Request
            {
                AccountId = accountId,
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
            var request = await GetRequestAndValidateUserAccessAsync(userId, requestId, ct);

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
            var request = await _context.Requests.FindAsync(new object[] { requestId }, ct);
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
    }
}