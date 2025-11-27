using Backend.Api.Dtos;
using FluentValidation;

namespace Backend.Api.Validators
{
    public class CreatePaymentValidator : AbstractValidator<CreatePaymentRequest>
    {
        public CreatePaymentValidator()
        {
            RuleFor(x => x.BillId)
                .GreaterThan(0)
                .WithMessage("Необходимо указать корректный ID счета на оплату.");

            RuleFor(x => x.Amount)
                .GreaterThan(0)
                .WithMessage("Сумма платежа должна быть больше нуля.");
        }
    }
}