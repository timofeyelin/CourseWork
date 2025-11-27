using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Dtos
{
    public class CreatePaymentRequest
    {
        [Required]
        public int BillId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Сумма платежа должна быть больше нуля.")]
        public decimal Amount { get; set; }
    }
}