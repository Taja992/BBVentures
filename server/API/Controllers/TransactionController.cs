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
public class TransactionController(ITransactionService service) : ControllerBase
{
    
    
    [HttpGet]
    //[Authorize(Roles = "Admin")]
    [AllowAnonymous]
    [Route("getTransactions")]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetAllTransactions()
    {
        return Ok(await service.GetAllTransactions());
    }
    
    [HttpGet]
    [Authorize]
    [Route("transactionsFromUser")]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetAllTransactionsFromUser()
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        return Ok(await service.GetAllTransactionsFromUser(userId));
    }
    
    [HttpGet]
    [AllowAnonymous]
    [Route("transactionsFromName")]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetAllTransactionsFromUsersName(string searchVal)
    {
        return Ok(await service.GetAllTransactionsFromUsersName(searchVal));
    }

    [HttpPost]
    [Authorize]
    [Route("addTransaction")]
    public async Task<ActionResult<Transaction>> AddTransaction([FromBody] TransactionDto dto)
    {
        var trans = await service.CreateTransaction(dto);
        return Ok(trans); //lol
    }
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("updateTransaction")]
    public ActionResult<TransactionDto> UpdateTransaction([FromBody] TransactionResponseDto dto)
    {
        if (string.IsNullOrEmpty(dto.Id.ToString()))
        {
            return NotFound("transaction not found");
        }
        if (string.IsNullOrEmpty(dto.UserId))
        {
            return NotFound("user not found");
        }
        
        var trans = service.UpdateTransaction(dto);
        return Ok(trans); 
    }
    
}