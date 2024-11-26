using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

public partial class Board
{
    [Key]
    public Guid Id { get; set; }

    public string PlayerId { get; set; } = null!;

    public Guid GameId { get; set; }

    public List<int>? Numbers { get; set; }

    public bool IsAutoplay { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("GameId")]
    [InverseProperty("Boards")]
    public virtual Game Game { get; set; } = null!;

    [ForeignKey("PlayerId")]
    [InverseProperty("Boards")]
    public virtual Player Player { get; set; } = null!;
}
