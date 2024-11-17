using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace DataAccess.Models;

public class Player : IdentityUser
{
    [Key] public string UserId { get; set; } = null!;

    public bool IsActive { get; set; }

    public decimal Balance { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Player")] public virtual ICollection<Board> Boards { get; set; } = new List<Board>();

    [InverseProperty("Player")]
    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    [ForeignKey("UserId")]
    [InverseProperty("Player")]
    public virtual AspNetUser User { get; set; } = null!;
}