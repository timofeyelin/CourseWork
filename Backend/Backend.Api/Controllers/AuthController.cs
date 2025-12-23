using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Backend.Application.Services;
using Backend.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;
    private readonly IAppDbContext _context;
    private readonly IAuditService _auditService;
    public AuthController(IUserService userService, ILogger<AuthController> logger, IAppDbContext context, IAuditService auditService)
    {
        _userService = userService;
        _logger = logger;
        _context = context;
        _auditService = auditService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request, CancellationToken ct)
    {
        try
        {
            var user = await _userService.RegisterAsync(
                ct,
                request.Email,
                request.Password,
                request.FullName,
                request.Phone
            );

            try
            {
                await _auditService.LogAsync(
                    user.UserId,
                    "Register",
                    "User",
                    user.UserId.ToString(),
                    $"Новый пользователь: {request.Email}",
                    ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Не удалось записать аудит");
            }

            return Ok(new { message = "Регистрация успешна", userId = user.UserId });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Ошибка регистрации: {Message}", ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при регистрации");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
        }
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        try
        {
            var (accessToken, refreshToken) = await _userService.LoginAsync(ct,
                request.EmailOrPhone,
                request.Password
            );
            var user = await _context.Users.FirstAsync(u => u.Email == request.EmailOrPhone || u.Phone == request.EmailOrPhone);
            try
            {
                await _auditService.LogAsync(
                user.UserId,
                "Login",
                "User",
                user.UserId.ToString(),
                "Успешный вход в систему",
                ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Не удалось записать аудит");
            }
            
            return Ok(new
            {
                accessToken,
                refreshToken
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Ошибка логина");
            return Unauthorized(new { error = ex.Message });
        }
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        try
        {
            var (accessToken, refreshToken) = await _userService.RefreshTokenAsync(ct, request.RefreshToken);
            return Ok(new { accessToken, refreshToken });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid token" });
        }
    }

}