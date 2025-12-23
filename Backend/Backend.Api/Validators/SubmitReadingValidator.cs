using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class SubmitReadingValidator : AbstractValidator<SubmitReadingRequest>
    {
        public SubmitReadingValidator()
        {
            RuleFor(x => x.Value)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Значение показаний не может быть отрицательным.");
        }
    }
}