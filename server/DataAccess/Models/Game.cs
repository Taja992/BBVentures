using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models;

public class Game
{
    [Key] public Guid Id { get; set; }

    public List<int>? WinnerNumbers { get; set; }


    public bool IsActive { get; set; }

    public int WeekNumber { get; set; }
    
    public DateTime? EndedAt { get; set; }
    
    public int Winners { get; set; }
    
    public decimal TotalRevenue { get; set; }
    
    public decimal ClubRevenue { get; set; }

    public decimal WinnersRevenue { get; set; }
    
    public decimal WinnerShare { get; set; }

    public List<string>? WinnersUserId { get; set; }

    [InverseProperty("Game")] public virtual ICollection<Board> Boards { get; set; } = new List<Board>();
}