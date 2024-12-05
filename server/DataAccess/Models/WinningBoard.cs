using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataAccess.Models;

[Table("WinningBoard")]
public class WinningBoard
{
    [Key] public int WbId { get; set; }

    [Column("numbers")] [StringLength(5)] public string Numbers { get; set; } = null!;

    public int WeekNum { get; set; }
}