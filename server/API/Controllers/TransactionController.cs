using System.Security.Claims;
using DataAccess;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Security;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionController(AppDbContext context) : ControllerBase
{
    private TransactionService service = new TransactionService(context);
    
    [HttpGet]
    [AllowAnonymous]
    public ActionResult<List<TransactionResponseDto>> GetAllTransactions()
    {
        return Ok(service.GetAllTransactions());
    }
    
    [HttpGet]
    [Route("transactionsFromUser")]
    [AllowAnonymous]
    public ActionResult<List<TransactionResponseDto>> GetAllTransactionsFromUser()
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }
        
        return Ok(service.GetAllTransactionsFromUser(userId));
    }

    [HttpPost]
    [Route("addTransaction")]
    [AllowAnonymous]
    public ActionResult<TransactionDto> AddTransaction([FromBody] TransactionDto dto)
    {
        var trans = service.CreateTransaction(dto);
        return Ok(trans); //lol
    }
    
    [HttpPatch]
    [Route("updateTransaction")]
    [AllowAnonymous]
    public ActionResult<TransactionDto> UpdateTransaction([FromBody] TransactionResponseDto dto)
    {
        Console.WriteLine(dto.Id);
        Console.WriteLine(dto.Id);
        Console.WriteLine(dto.Id);
        Console.WriteLine(dto.Id);
        var trans = service.UpdateTransaction(dto);
        return Ok(trans); 
    }
    
}