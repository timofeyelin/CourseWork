using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class CreateAnnouncementRequestValidator : AbstractValidator<CreateAnnouncementRequest>
    {
        public CreateAnnouncementRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Заголовок не может быть пустым.")
                .MaximumLength(200).WithMessage("Длина заголовка не может превышать 200 символов.");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Содержание не может быть пустым.");
        }
    }
}