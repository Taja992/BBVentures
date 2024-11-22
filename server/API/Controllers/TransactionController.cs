using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[Route("api")]
[ApiController]
public class TransactionController(AppDbContext context) : ControllerBase
{
    private TransactionService service = new TransactionService(context);
    
    /*[HttpGet]
    [Route("transactions")]
    [AllowAnonymous]
    public ActionResult<List<TransactionDto>> GetAllTransactions()
    {
        return service.GetAllTransactions();
    }*/
    
    [HttpGet]
    [Route("transactions")]
    [AllowAnonymous]
    public ActionResult<List<Transaction>> GetAllTransactions()
    {
        return service.GetAllTransactions();
    }

    [HttpPost]
    [Route("addTransaction")]
    [AllowAnonymous]
    public ActionResult<TransactionDto> AddTransaction([FromBody] TransactionDto dto)
    {
        var trans = service.CreateTransaction(dto);
        return Ok(trans); //lol
    }
    
}