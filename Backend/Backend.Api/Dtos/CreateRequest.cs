namespace Backend.Api.Dtos;

public class CreateRequest
    {
        public int AccountId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }