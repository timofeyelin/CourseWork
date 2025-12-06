using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
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