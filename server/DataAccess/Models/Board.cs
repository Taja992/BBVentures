using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

[Table("Board")]
public partial class Board
{
    [Key]
    public string BoardId { get; set; } = null!;

    public string UserId { get; set; } = null!;

    [StringLength(15)]
    public string Numbers { get; set; } = null!;

    public int WeekNum { get; set; }

    public decimal? Cost { get; set; }

    [Column("length")]
    public int? Length { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Boards")]
    public virtual AspNetUser User { get; set; } = null!;
}
