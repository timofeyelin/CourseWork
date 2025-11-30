using Backend.Domain.Entities;
using Backend.Domain.Enums;

namespace Backend.Application.Interfaces
{
    public interface IRequestService
    {
        Task<List<Request>> GetUserRequestsAsync(int userId, CancellationToken ct);
        Task<Request> GetRequestDetailsAsync(int userId, int requestId, CancellationToken ct);
        Task<Request> CreateRequestAsync(int userId, int accountId, string category, string description, CancellationToken ct);
        Task<Request> UpdateRequestStatusAsync(int requestId, RequestStatus newStatus, CancellationToken ct); // Admin-only
        Task<Request> RateRequestAsync(int userId, int requestId, int rating, string? comment, CancellationToken ct);
        Task<RequestComment> AddCommentAsync(int userId, UserRole userRole, int requestId, string text, CancellationToken ct);
        Task<bool> ValidateUserAccessAsync(int userId, int requestId, CancellationToken ct);
         Task<RequestAttachment> AddAttachmentAsync(int userId, int requestId, string fileUri, string fileType, CancellationToken ct);
    }
}