using Backend.Domain.Enums;
namespace Backend.Api.Dtos;

public class UpdateStatusRequest
    {
        public RequestStatus Status { get; set; }
    }