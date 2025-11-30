using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class CreateRequestValidator : AbstractValidator<CreateRequest>
    {
        public CreateRequestValidator()
        {
            RuleFor(x => x.AccountId)
                .GreaterThan(0).WithMessage("Необходимо указать лицевой счет.");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Категория заявки не может быть пустой.")
                .MaximumLength(100).WithMessage("Длина категории не должна превышать 100 символов.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Описание заявки не может быть пустым.");
        }
    }
}