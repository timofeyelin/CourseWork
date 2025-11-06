using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class LoginValidator : AbstractValidator<LoginRequest>
    {
        public LoginValidator()
        {
            RuleFor(x => x.EmailOrPhone)
                .NotEmpty().WithMessage("Email или телефон обязателен")
                .Must(ValidationHelpers.IsValidEmailOrPhone)
                .WithMessage("Введите корректный email или телефон");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль обязателен");
        }
    }
}
