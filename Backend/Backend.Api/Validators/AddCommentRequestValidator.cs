using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class AddCommentRequestValidator : AbstractValidator<AddCommentRequestDto>
    {
        public AddCommentRequestValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Текст комментария не может быть пустым.")
                .MaximumLength(2000);
        }
    }
}