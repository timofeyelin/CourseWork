using Backend.Application.Interfaces;
using Backend.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.Domain.Entities;

namespace Backend.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST: api/payment
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] CreatePaymentRequest request, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            try
            {
                var payment = await _paymentService.CreatePaymentAsync(userId, request.BillId, request.Amount, ct);
                var paymentDto = MapToDto(payment);

                return CreatedAtAction(nameof(GetPayment), new { paymentId = payment.PaymentId }, paymentDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        // GET: api/payment/mine
        [HttpGet("mine")]
        public async Task<ActionResult<List<PaymentDto>>> GetUserPayments(CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var payments = await _paymentService.GetUserPaymentsAsync(userId, ct);
            
            var paymentDtos = payments.Select(MapToDto).ToList();
            return Ok(paymentDtos);
        }

        // GET: api/payment/{paymentId}
        [HttpGet("{paymentId}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int paymentId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var payment = await _paymentService.GetPaymentByIdAsync(paymentId, ct);
            
            if (payment == null)
            {
                return NotFound();
            }

            // Проверка владения: получаем все платежи пользователя и ищем среди них нужный.
            // Это не самый эффективный способ, но он работает в рамках текущего интерфейса IPaymentService.
            var userPayments = await _paymentService.GetUserPaymentsAsync(userId, ct);
            if (!userPayments.Any(p => p.PaymentId == paymentId))
            {
                return Forbid(); // У пользователя нет доступа к этому платежу
            }

            return Ok(MapToDto(payment));
        }

        // POST: api/payment/{paymentId}/cancel
        [HttpPost("{paymentId}/cancel")]
        public async Task<IActionResult> CancelPayment(int paymentId, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            try
            {
                await _paymentService.CancelPaymentAsync(userId, paymentId, ct);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        private static PaymentDto MapToDto(Payment payment)
        {
            return new PaymentDto
            {
                PaymentId = payment.PaymentId,
                BillId = payment.BillId,
                Amount = payment.Amount,
                CreatedAt = payment.Date, 
                Status = payment.Status,
                TransactionId = payment.TransactionId
            };
        }
    }
}