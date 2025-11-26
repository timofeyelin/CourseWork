using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators;

public class LinkAccountValidator : AbstractValidator<LinkAccountRequest>
{
    public LinkAccountValidator()
    {
        RuleFor(x => x.AccountNumber)
            .NotEmpty().WithMessage("Номер лицевого счета не может быть пустым.");
    }
}