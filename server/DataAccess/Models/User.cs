using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

public partial class User : IdentityUser
{
    
    public bool IsActive { get; set; }

    public decimal Balance { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    
    // [MaxLength(50)]
    // public string? Role { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Board> Boards { get; set; } = new List<Board>();
    
    [InverseProperty("User")]
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
