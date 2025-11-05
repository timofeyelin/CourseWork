using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Backend.Application.Services
{
     public class UserService:IUserService
    {
        private readonly IAppDbContext _context;
        private readonly IConfiguration _config;
        public UserService(IAppDbContext context,IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        public async Task<User> RegisterAsync(CancellationToken ct,string email, string password, string fullName, string phone)
        {
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == email);

            if (emailExists)
            {
                throw new InvalidOperationException($"Пользователь с email '{email}' уже существует");
            }

            var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(password, workFactor: 13);
            var user = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                FullName = fullName,
                Phone = phone,
                Role = UserRole.Resident,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(ct);

            return user;
        }
        public async Task<(string accessToken, string refreshToken)> LoginAsync(CancellationToken ct,string emailOrPhone, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == emailOrPhone || u.Phone == emailOrPhone);

            if (user == null || !BCrypt.Net.BCrypt.EnhancedVerify(password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Email/телефон или пароль неверны");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Пользователь заблокирован");
            }

            var jwtService = new JwtService(_config);
            var accessToken = jwtService.GenerateAccessToken(user.UserId, user.Email, user.Role.ToString());
            var refreshTokenValue = jwtService.GenerateRefreshToken(user.UserId);

            var refreshToken = new RefreshToken
            {
                UserId = user.UserId,
                Token = refreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync(ct);

            return (accessToken, refreshTokenValue);
        }
    }
}
