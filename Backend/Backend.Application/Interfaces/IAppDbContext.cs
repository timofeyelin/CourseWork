using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; set; }
    DbSet<Account> Accounts { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}