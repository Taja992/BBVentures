using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

public partial class Transaction
{
    [Key]
    public Guid Id { get; set; }

    public string PlayerId { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? MobilePayTransactionNumber { get; set; }

    [ForeignKey("PlayerId")]
    [InverseProperty("Transactions")]
    public virtual Player Player { get; set; } = null!;
}
