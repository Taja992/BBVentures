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
    [Authorize(Roles = "Admin")]
    [Route("getTransactions")]
    public ActionResult<List<TransactionResponseDto>> GetAllTransactions()
    {
        return Ok(service.GetAllTransactions());
    }
    
    [HttpGet]
    [Authorize]
    [Route("transactionsFromUser")]
    public ActionResult<List<TransactionResponseDto>> GetAllTransactionsFromUser()
    {
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        return Ok(service.GetAllTransactionsFromUser(userId));
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