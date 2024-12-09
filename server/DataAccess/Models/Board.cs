using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models;

public class Board
{
    [Key] public Guid Id { get; set; }

    public string UserId { get; set; } = null!;

    public Guid GameId { get; set; }

    public List<int>? Numbers { get; set; }

    public bool IsAutoplay { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    
    public Boolean isWon { get; set; }

    [ForeignKey("GameId")]
    [InverseProperty("Boards")]
    public virtual Game Game { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Boards")]
    public virtual User User { get; set; } = null!;
}