using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Dtos
{
    public class CreateCategoryDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}