using Backend.Application.Interfaces;
using Backend.Application.Dtos;
using Backend.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.Domain.Entities;

namespace Backend.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IAuditService _auditService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, IAuditService auditService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _auditService = auditService;
            _logger = logger;
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

                try
                {
                    await _auditService.LogAsync(
                        userId,
                        "CreatePayment",
                        "Payment",
                        payment.PaymentId.ToString(),
                        $"Счёт: {request.BillId}, Сумма: {request.Amount}",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

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

                try
                {
                    await _auditService.LogAsync(
                        userId,
                        "CancelPayment",
                        "Payment",
                        paymentId.ToString(),
                        "Платёж отменён",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

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

        // GET: api/payments/balance
        [HttpGet("balance")]
        public async Task<ActionResult<BalanceDetailsDto>> GetBalance(CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var balance = await _paymentService.GetBalanceAsync(userId, ct);
                return Ok(balance);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // POST: api/payments/init
        [HttpPost("init")]
        public async Task<ActionResult> InitPayment([FromBody] InitPaymentRequest request, CancellationToken ct)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var payment = await _paymentService.InitPaymentAsync(userId, request.Amount, request.Method, ct);

                try
                {
                    await _auditService.LogAsync(
                        userId,
                        "InitPayment",
                        "Payment",
                        payment.PaymentId.ToString(),
                        $"Сумма: {request.Amount}, Метод: {request.Method}",
                        ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Не удалось записать аудит");
                }

                return Ok(new { 
                    paymentId = payment.PaymentId, 
                    testUrl = $"https://test-payment-gateway.com/pay?id={payment.PaymentId}&amount={payment.Amount}" 
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
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