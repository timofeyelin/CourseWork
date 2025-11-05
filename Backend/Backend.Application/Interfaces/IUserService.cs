using Backend.Domain.Entities;


namespace Backend.Application.Interfaces
{
    public interface IUserService
    {
        public Task<User> RegisterAsync(CancellationToken ct, string email, string password, string fullName, string phone);
        public Task<(string accessToken, string refreshToken)> LoginAsync(CancellationToken ct, string emailOrPhone, string password);
    }
}
