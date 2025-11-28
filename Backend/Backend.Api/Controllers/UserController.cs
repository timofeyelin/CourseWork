using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Все эндпоинты требуют авторизации
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;  
    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;    
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            throw new InvalidOperationException("User ID not found in token.");
        }
        return userId;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.GetProfileAsync(ct, userId);

            var userProfileDto = new UserProfileDto
            {
                Id = user.UserId,
                Email = user.Email,
                FullName = user.FullName,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt
            };

            return Ok(userProfileDto);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Profile not found for user.");
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user profile.");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
        }
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        try
        {
            var userId = GetCurrentUserId();
            var updatedUser = await _userService.UpdateProfileAsync(ct, userId, request.FullName, request.Email, request.Phone, request.NewPassword);
            return Ok(new { message = "Профиль успешно обновлен" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile.");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
        }
    }

    [HttpGet("accounts")]
    public async Task<IActionResult> GetUserAccounts(CancellationToken ct)
    {
        try
        {
            var userId = GetCurrentUserId();
            var accounts = await _userService.GetUserAccountsAsync(ct, userId);

            var accountDtos = accounts.Select(a => new AccountDto
            {
                Id = a.AccountId,
                AccountNumber = a.AccountNumber,
                Address = a.Address,
                UkName = a.UkName,
                Area = a.Area
            }).ToList();

            return Ok(accountDtos);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user accounts.");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
        }
    }

    [HttpPost("accounts")]
    public async Task<IActionResult> LinkAccount([FromBody] LinkAccountRequest request, CancellationToken ct)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _userService.LinkAccountAsync(ct, userId, request.AccountNumber);
            return Ok(new { message = "Лицевой счет успешно привязан." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error linking account.");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
        }
    }

    [HttpDelete("accounts/{accountId}")]
    public async Task<IActionResult> UnlinkAccount(int accountId, CancellationToken ct)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _userService.UnlinkAccountAsync(ct, userId, accountId);
            return Ok(new { message = "Лицевой счет успешно отвязан." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unlinking account.");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
        }
    }
}