using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

[Table("WinningBoard")]
public partial class WinningBoard
{
    [Key]
    public int WbId { get; set; }

    [Column("numbers")]
    [StringLength(5)]
    public string Numbers { get; set; } = null!;

    public int WeekNum { get; set; }
}
