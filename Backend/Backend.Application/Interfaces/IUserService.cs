using Backend.Domain.Entities;


namespace Backend.Application.Interfaces
{
    public interface IUserService
    {
        Task<User> RegisterAsync(CancellationToken ct, string email, string password, string fullName, string phone);
        Task<(string accessToken, string refreshToken)> LoginAsync(CancellationToken ct, string emailOrPhone, string password);
        Task<User> GetProfileAsync(CancellationToken ct, int userId);
        Task<User> UpdateProfileAsync(CancellationToken ct, int userId, string? fullName, string? email, string? phone, string? newPassword);
        Task<List<Account>> GetUserAccountsAsync(CancellationToken ct, int userId);
        Task LinkAccountAsync(CancellationToken ct, int userId, string accountNumber);
        Task UnlinkAccountAsync(CancellationToken ct, int userId, int accountId);
        Task<bool> DoesUserOwnAccount(int userId, int accountId);
        Task<(string accessToken, string refreshToken)> RefreshTokenAsync(CancellationToken ct, string token);
    }
}
