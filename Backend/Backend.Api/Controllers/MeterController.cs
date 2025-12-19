using Backend.Api.Dtos;
using Backend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/meters")]
    [Authorize]
    public class MeterController : ControllerBase
    {
        private readonly IMeterReadingService _meterService;
        private readonly IUserService _userService;
        private readonly IAuditService _auditService;
        private readonly ILogger<MeterController> _logger;
        public MeterController(IMeterReadingService meterService, IUserService userService, IAuditService auditService, ILogger<MeterController> logger)
        {
            _meterService = meterService;
            _userService = userService;
            _auditService = auditService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<MeterDto>>> GetUserMeters(CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var meters = await _meterService.GetUserMetersAsync(userId, ct);
            var dtos = meters.Select(m => new MeterDto
            {
                MeterId = m.MeterId,
                AccountId = m.AccountId,
                AccountNumber = m.Account?.AccountNumber ?? "н/д",
                Type = m.Type,
                SerialNumber = m.SerialNumber,
                InstallationDate = m.InstallationDate
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("account/{accountId}")]
        public async Task<ActionResult<List<MeterDto>>> GetAccountMeters(int accountId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (!await _userService.DoesUserOwnAccount(userId, accountId))
            {
                return Forbid();
            }

            var meters = await _meterService.GetAccountMetersAsync(accountId, ct);
            var dtos = meters.Select(m => new MeterDto
            {
                MeterId = m.MeterId,
                AccountId = m.AccountId,
                Type = m.Type,
                SerialNumber = m.SerialNumber,
                InstallationDate = m.InstallationDate
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("{meterId}/readings")]
        public async Task<ActionResult<List<MeterReadingDto>>> GetMeterReadings(int meterId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userMeters = await _meterService.GetUserMetersAsync(userId, ct);
            if (!userMeters.Any(m => m.MeterId == meterId))
            {
                return Forbid();
            }

            var readings = await _meterService.GetMeterReadingHistoryAsync(meterId, ct);
            var dtos = readings.Select(r => new MeterReadingDto
            {
                ReadingId = r.ReadingId,
                Value = r.Value,
                Period = r.Period,
                SubmittedAt = r.SubmittedAt,
                Validated = r.Validated
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("{meterId}/readings/{readingId}")]
        public async Task<ActionResult<MeterReadingDto>> GetReadingDetails(int meterId, int readingId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var reading = await _meterService.GetReadingByIdAsync(userId, readingId, ct);

                if (reading == null || reading.MeterId != meterId)
                {
                    return NotFound();
                }

                var dto = new MeterReadingDto
                {
                    ReadingId = reading.ReadingId,
                    Value = reading.Value,
                    Period = reading.Period,
                    SubmittedAt = reading.SubmittedAt,
                    Validated = reading.Validated
                };

                return Ok(dto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        [HttpPost("{meterId}/readings")]
        public async Task<ActionResult<MeterReadingDto>> SubmitReading(int meterId, [FromBody] SubmitReadingRequest request, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var reading = await _meterService.SubmitMeterReadingAsync(userId, meterId, request.Value, ct);
                var dto = new MeterReadingDto
                {
                    ReadingId = reading.ReadingId,
                    Value = reading.Value,
                    Period = reading.Period,
                    SubmittedAt = reading.SubmittedAt,
                    Validated = reading.Validated
                };
                try
                {
                    await _auditService.LogAsync(
                        userId,
                        "SubmitReading",
                        "MeterReading",
                        reading.ReadingId.ToString(),
                        $"Счётчик: {meterId}, Значение: {request.Value}",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

                return Ok(dto);
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException ex) { return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPut("{meterId}/readings/{readingId}")]
        public async Task<IActionResult> UpdateReading(int meterId, int readingId, [FromBody] SubmitReadingRequest request, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            try
            {
                await _meterService.UpdateMeterReadingAsync(userId, meterId, readingId, request.Value, ct);

                try
                {
                    await _auditService.LogAsync(
                        userId,
                        "UpdateReading",
                        "MeterReading",
                        readingId.ToString(),
                        $"Счётчик: {meterId}, Новое значение: {request.Value}",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

                return NoContent();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException ex) { return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        }
    }
}