using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[Route("api")]
public class TransactionController(AppDbContext context) : ControllerBase
{
    private TransactionService service = new TransactionService(context);
    
    [HttpGet]
    [Route("/transactions")]
    [AllowAnonymous]
    public List<TransactionDto> GetAllTransactions()
    {
        return service.GetAllTransactions();
    }
    
}