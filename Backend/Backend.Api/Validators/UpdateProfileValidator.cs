using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class UpdateProfileValidator : AbstractValidator<UpdateProfileRequest>
    {
        public UpdateProfileValidator()
        {
            When(x => x.FullName != null, () =>
            {
                RuleFor(x => x.FullName)
                    .NotEmpty().WithMessage("Имя не может быть пустым.")
                    .MinimumLength(2).WithMessage("Имя должно содержать не менее 2 символов.");
            });

            When(x => x.Email != null, () =>
            {
                RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email не может быть пустым.")
                    .EmailAddress().WithMessage("Некорректный формат email.");
            });

            When(x => x.NewPassword != null, () =>
            {
                RuleFor(x => x.NewPassword)
                    .NotEmpty().WithMessage("Пароль не может быть пустым.")
                    .MinimumLength(8).WithMessage("Пароль должен содержать не менее 8 символов.")
                    .Matches("[A-Z]").WithMessage("Пароль должен содержать хотя бы одну заглавную букву.")
                    .Matches("[a-z]").WithMessage("Пароль должен содержать хотя бы одну строчную букву.")
                    .Matches("[0-9]").WithMessage("Пароль должен содержать хотя бы одну цифру.");
            });
        }
    }
}