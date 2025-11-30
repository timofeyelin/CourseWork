using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class RateRequestValidator : AbstractValidator<RateRequest>
    {
        public RateRequestValidator()
        {
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Оценка должна быть в диапазоне от 1 до 5.");

            RuleFor(x => x.Comment)
                .MaximumLength(2000)
                .When(x => !string.IsNullOrWhiteSpace(x.Comment));
        }
    }
}