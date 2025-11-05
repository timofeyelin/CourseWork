namespace Backend.Api.Dtos
{
    public record LoginRequest
    {
        public string EmailOrPhone { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
    }
}
