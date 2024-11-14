#!/bin/bash

connectionString="HOST=localhost;DB=bbventure_db;UID=postgres;PWD=postgres;PORT=5432;"
context="AppDbContext"

dotnet ef dbcontext scaffold \
  $connectionString \
  Npgsql.EntityFrameworkCore.PostgreSQL \
  --output-dir Models \
  --context-dir . \
  --context $context \
  --no-onconfiguring \
  --data-annotations \
  --force

pre="
using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public partial class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
"

dbsets=$(grep DbSet AppDbContext.cs | grep -v AspNet)
post="}"

cat <<EOF >$context.cs
$pre
$dbsets
$post
EOF

dotnet format