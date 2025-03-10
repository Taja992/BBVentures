﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

[PrimaryKey("UserId", "LoginProvider", "Name")]
public class AspNetUserToken
{
    [Key] public string UserId { get; set; } = null!;

    [Key] public string LoginProvider { get; set; } = null!;

    [Key] public string Name { get; set; } = null!;

    public string? Value { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("AspNetUserTokens")]
    public virtual AspNetUser User { get; set; } = null!;
}