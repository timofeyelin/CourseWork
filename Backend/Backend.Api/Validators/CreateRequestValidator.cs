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

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Необходимо выбрать категорию заявки.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Описание заявки не может быть пустым.");
        }
    }
}