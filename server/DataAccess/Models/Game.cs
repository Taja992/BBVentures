using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

public partial class Game
{
    [Key]
    public Guid Id { get; set; }

    public List<string>? WinnerNumbers { get; set; }

    public decimal TotalRevenue { get; set; }
    
    public bool IsActive { get; set; }
    
    public int WeekNumber { get; set; }

    [InverseProperty("Game")]
    public virtual ICollection<Board> Boards { get; set; } = new List<Board>();
}
