namespace Backend.Domain.Entities
{
    public class MeterReading
    {
        public int ReadingId { get; set; }

        public int MeterId { get; set; }
        public Meter? Meter { get; set; }

        public decimal Value { get; set; }
        public DateTime Period { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public bool Validated { get; set; }
        public string? Note { get; set; }
    }
}
