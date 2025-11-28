namespace Backend.Api.Dtos
{
    public class MeterReadingDto
    {
        public int ReadingId { get; set; }
        public decimal Value { get; set; }
        public DateTime Period { get; set; }
        public DateTime SubmittedAt { get; set; }
        public bool Validated { get; set; }
    }
}