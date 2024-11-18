// using DataAccess;
// using DataAccess.Interfaces;
// using FluentValidation;
// using Microsoft.Extensions.Logging;
// using Service.TransferModels.Requests.Create;
// using Service.TransferModels.Requests.Update;
//
// namespace Service;
//
//
// public interface IBoardService
// {
//     // Task<Order> CreateOrder(CreateOrderDto createOrderDto);
// }
//
// public class BoardService(AppDbContext context, IBoardRepository boardRepository, IValidator<CreateBoardDto> createValidator, IValidator<UpdateBoardDto> updateValidator) : IBoardService
// {
//     
//     // public async Task<OrderDto> CreateOrder(CreateOrderDto createOrderDto)
//     // {
//     //     await createValidator.ValidateAndThrowAsync(createOrderDto);
//     //     var order = createOrderDto.ToOrder();
//     //     order.Status = "Pending"; // Force newly created orders to be Pending
//     //     order.TotalAmount = 0; //set this to 0 at first to avoid null
//     //     Order newOrder = await orderRepository.CreateOrder(order);
//     //     return new OrderDto().FromEntity(newOrder, mapper);
//     // }
//
// }