// namespace Service.Validators;
//
// public class BoardValidator
// {
//     // public class OrderValidator : AbstractValidator<CreateOrderDto>
//     // {
//     //     private static readonly string[] ValidStatuses =
//     //         { "Pending", "Processing", "Confirmed", "Shipped", "On Hold", "Completed", "Failed" };
//     //
//     //     public OrderValidator()
//     //     {
//     //         RuleFor(x => x.OrderDate).NotEmpty().WithMessage("Order date must not be empty");
//     //         RuleFor(x => x.DeliveryDate).Must((dto, deliveryDate) => BeAfterOrderDate(dto.OrderDate, deliveryDate))
//     //             .WithMessage("Delivery date must be after order date.");
//     //         RuleFor(x => x.TotalAmount).GreaterThanOrEqualTo(0).WithMessage("Total amount must be above 0");
//     //         RuleFor(x => x.Status).Must(BeAValidStatus).WithMessage("Invalid Status");
//     //     }
// }