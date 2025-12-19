namespace Backend.Api.Dtos
{
    public class InitPaymentRequest
    {
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
    }
}
