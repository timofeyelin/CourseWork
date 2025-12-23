using System.Text.Json;
using Backend.Domain.Enums;

namespace Backend.Api.Dtos
{
    public class UpdateOperatorRequestDto
    {
        public RequestStatus? Status { get; set; }
        public RequestPriority? Priority { get; set; }

        // Важно: различаем "нет поля" vs "поле = null"
        public JsonElement? Deadline { get; set; }
    }
}