namespace Backend.Api.Dtos
{
    public class RefreshTokenRequest
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}