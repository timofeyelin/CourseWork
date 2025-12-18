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
                .NotEmpty().WithMessage("Содержание обязательно")
                .MaximumLength(5000).WithMessage("Содержание не должно превышать 5000 символов");

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage("Некорректный тип объявления");
        }
    }
}