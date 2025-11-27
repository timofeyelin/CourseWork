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

        public MeterController(IMeterReadingService meterService, IUserService userService)
        {
            _meterService = meterService;
            _userService = userService;
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
                SerialNumber = m.SerialNumber
            }).ToList();
            
            return Ok(dtos);
        }
        
        [HttpGet("{meterId}/history")]
        public async Task<ActionResult<List<MeterReadingDto>>> GetMeterHistory(int meterId, CancellationToken ct)
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
                return Ok(dto);
            }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        }
    }
}