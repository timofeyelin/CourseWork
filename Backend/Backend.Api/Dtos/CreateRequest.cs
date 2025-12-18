namespace Backend.Api.Dtos;

public class CreateRequest
    {
        public int AccountId { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; } = string.Empty;
    }