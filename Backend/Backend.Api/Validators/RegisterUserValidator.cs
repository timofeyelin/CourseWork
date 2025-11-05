using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class RegisterUserValidator: AbstractValidator<RegisterUserRequest>
    {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email обязателен")
                .Must(ValidationHelpers.IsValidEmail).WithMessage("Неверный формат email");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Телефон обязателен")
                .Must(ValidationHelpers.IsValidPhone).WithMessage("Неверный формат телефона");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль обязателен")
                .MinimumLength(8).WithMessage("Минимум 8 символов");
                

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("ФИО обязательно")
                .MinimumLength(2).WithMessage("Минимум 2 символа");
        }
    }
}
