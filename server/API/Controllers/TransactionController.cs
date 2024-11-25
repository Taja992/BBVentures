using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[Route("api/[controller]")]
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
    [AllowAnonymous]
    public ActionResult<List<TransactionResponseDto>> GetAllTransactions()
    {
        return service.GetAllTransactions();
    }
    
    [HttpGet]
    [Route("transactionsFromUser")]
    [AllowAnonymous]
    public ActionResult<List<TransactionResponseDto>> GetAllTransactionsFromUser([FromQuery] string guid)
    {
        return service.GetAllTransactionsFromUser(guid);
    }

    [HttpPost]
    [Route("addTransaction")]
    [AllowAnonymous]
    public ActionResult<TransactionDto> AddTransaction([FromBody] TransactionDto dto)
    {
        var trans = service.CreateTransaction(dto);
        return Ok(trans); //lol
    }
    
    [HttpPut]
    [Route("updateTransaction")]
    [AllowAnonymous]
    public ActionResult<TransactionDto> UpdateTransaction([FromBody] TransactionResponseDto dto)
    {
        var trans = service.UpdateTransaction(dto);
        return Ok(trans); 
    }
    
}