using Backend.Application.Interfaces;
using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Bill> Bills { get; set; }
    public DbSet<BillItem> BillItems { get; set; }
    public DbSet<Payment> Payment { get; set; }
    public DbSet<Meter> Meters { get; set; }
    public DbSet<MeterReading> MeterReadings { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Конфигурация для сущности User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.UserId);
            entity.HasIndex(u => u.Email).IsUnique(); // Уникальный email

            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(200);
            entity.Property(u => u.Phone).HasMaxLength(20);
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("now() at time zone 'utc'");
        });

        // Конфигурация для сущности Account
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(a => a.AccountId);
            entity.HasIndex(a => a.AccountNumber).IsUnique(); // Уникальный номер счета

            entity.Property(a => a.AccountNumber).IsRequired().HasMaxLength(50);
            entity.Property(a => a.Address).IsRequired().HasMaxLength(300);
            entity.Property(a => a.Area).HasColumnType("decimal(18,2)"); // Точность для площади
            entity.Property(a => a.HouseType).HasMaxLength(100);
            entity.Property(a => a.UkName).HasMaxLength(150);
        });

        // Конфигурация связи "один-ко-многим"
        // У одного User может быть много Accounts
        modelBuilder.Entity<User>()
            .HasMany(u => u.Accounts)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict); // защита истории и ссылочной целостности

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.HasIndex(r => r.Token).IsUnique();
            entity.Property(r => r.Token).IsRequired();
            entity.Property(r => r.ExpiresAt).IsRequired();
        });

        // Конфигурация Meter
        modelBuilder.Entity<Meter>(entity =>
        {
            entity.HasKey(m => m.MeterId);
            entity.Property(m => m.SerialNumber).IsRequired().HasMaxLength(50);

            entity.HasOne(m => m.Account)
                  .WithMany()
                  .HasForeignKey(m => m.AccountId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Конфигурация MeterReading
        modelBuilder.Entity<MeterReading>(entity =>
        {
            entity.HasKey(mr => mr.ReadingId);
            entity.Property(mr => mr.Value).HasPrecision(18, 4);

            // Связь с Meter
            entity.HasOne(mr => mr.Meter)
                  .WithMany(m => m.Readings)
                  .HasForeignKey(mr => mr.MeterId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}