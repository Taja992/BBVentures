using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

[Keyless]
[Table("User")]
public partial class User : IdentityUser
{
    [Column("balance")]
    public decimal Balance { get; set; }
}
