using Backend.Domain.Enums;


namespace Backend.Domain.Entities
{
    public class Meter
    {
        public int MeterId { get; set; }

        public int AccountId { get; set; }
        public Account? Account { get; set; }

        public MeterType Type { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
        public DateTime InstallationDate { get; set; }
        public DateTime? LastVerified { get; set; }

        public List<MeterReading> Readings { get; set; } = new();
    }
}
