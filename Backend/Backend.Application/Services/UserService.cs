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

        public async Task<User> GetProfileAsync(CancellationToken ct, int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId, ct);

            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }

            return user;
        }

        public async Task<User> UpdateProfileAsync(CancellationToken ct, int userId, string? fullName, string? email, string? phone, string? newPassword)
        {
            var user = await _context.Users.FindAsync(new object[] { userId }, ct);

            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден.");
            }

            if (!string.IsNullOrWhiteSpace(fullName))
            {
                user.FullName = fullName;
            }

            if (!string.IsNullOrWhiteSpace(email) && user.Email != email)
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == email, ct);
                if (emailExists)
                {
                    throw new InvalidOperationException("Этот email уже используется.");
                }
                user.Email = email;
            }

            if (!string.IsNullOrWhiteSpace(phone) && user.Phone != phone)
            {
                var phoneExists = await _context.Users
                    .AnyAsync(u => u.Phone == phone && u.UserId != userId, ct);

                if (phoneExists)
                {
                    throw new InvalidOperationException("Этот номер телефона уже используется.");
                }
                user.Phone = phone;
            }

            if (!string.IsNullOrWhiteSpace(newPassword))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(newPassword, workFactor: 13);
            }

            await _context.SaveChangesAsync(ct);
            return user;
        }

        public async Task<List<Account>> GetUserAccountsAsync(CancellationToken ct, int userId)
        {
            var user = await _context.Users
                .Include(u => u.Accounts)
                .FirstOrDefaultAsync(u => u.UserId == userId, ct);

            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }

            return user.Accounts.ToList();
        }

        public async Task LinkAccountAsync(CancellationToken ct, int userId, string accountNumber)
        {
            var user = await _context.Users
                .Include(u => u.Accounts)
                .FirstOrDefaultAsync(u => u.UserId == userId, ct);

            if (user == null)
            {
                throw new KeyNotFoundException("Пользователь не найден");
            }

            // Ищем лицевой счёт в базе
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountNumber == accountNumber, ct);

            if (account == null)
            {
                throw new KeyNotFoundException("Лицевой счёт не найден");
            }

            // Проверяем, не привязан ли уже к этому пользователю
            if (account.UserId == userId)
            {
                throw new InvalidOperationException("Этот счёт уже привязан к вашему профилю");
            }

            // Проверяем, не привязан ли к другому пользователю
            if (account.UserId != null)
            {
                throw new InvalidOperationException("Этот счёт уже привязан к другому пользователю");
            }

            account.UserId = userId;
            await _context.SaveChangesAsync(ct);
        }

        public async Task UnlinkAccountAsync(CancellationToken ct, int userId, int accountId)
        {
            var account = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountId == accountId, ct);

            if (account == null)
            {
                throw new KeyNotFoundException("Лицевой счёт не найден");
            }

            if (account.UserId != userId)
            {
                throw new InvalidOperationException("Этот счёт не принадлежит вам");
            }

            account.UserId = null;
            await _context.SaveChangesAsync(ct);
        }

        public async Task<bool> DoesUserOwnAccount(int userId, int accountId)
        {
            return await _context.Accounts
                .AnyAsync(a => a.AccountId == accountId && a.UserId == userId);
        }
        public async Task<(string accessToken, string refreshToken)> RefreshTokenAsync(CancellationToken ct, string token)
        {
            var existingToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == token, ct);

            if (existingToken == null || existingToken.IsUsed || existingToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token");
            }

            var user = await _context.Users.FindAsync(new object[] { existingToken.UserId }, ct);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            // Помечаем старый как использованный
            existingToken.IsUsed = true;

            var jwtService = new JwtService(_config);
            var newAccessToken = jwtService.GenerateAccessToken(user.UserId, user.Email, user.Role.ToString());
            var newRefreshToken = jwtService.GenerateRefreshToken(user.UserId);

            // Сохраняем новый
            var refreshTokenEntity = new RefreshToken
            {
                UserId = user.UserId,
                Token = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync(ct);

            return (newAccessToken, newRefreshToken);
        }
    }
}
