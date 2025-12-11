using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class MeterDto
    {
        public int MeterId { get; set; }
        public int AccountId { get; set; }
        public MeterType Type { get; set; }
        public string SerialNumber { get; set; }
        public DateTime InstallationDate { get; set; }
    }
}