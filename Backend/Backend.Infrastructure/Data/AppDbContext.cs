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
    public DbSet<Request> Requests { get; set; }
    public DbSet<RequestComment> RequestComments { get; set; }
    public DbSet<RequestAttachment> RequestAttachments { get; set; }
    public DbSet<Meter> Meters { get; set; }
    public DbSet<MeterReading> MeterReadings { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<AnnouncementRead> AnnouncementReads { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
      public DbSet<RequestCategory> RequestCategories => Set<RequestCategory>();

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

        modelBuilder.Entity<Request>(entity =>
        {
            entity.HasKey(r => r.RequestId);

            entity.Property(r => r.CategoryId)
                  .IsRequired();
    
            entity.Property(r => r.Description)
                  .IsRequired();

            entity.Property(r => r.Rating)
                  .HasColumnType("integer");

            entity.HasOne(r => r.Account)
                  .WithMany()
                  .HasForeignKey(r => r.AccountId)
                  .OnDelete(DeleteBehavior.Cascade);
            
             entity.HasOne(r => r.Category)
                  .WithMany(c => c.Requests)
                  .HasForeignKey(r => r.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RequestComment>(entity =>
        {
            entity.HasKey(c => c.CommentId);

            entity.Property(c => c.Text)
                  .IsRequired();

            entity.HasOne(c => c.Request)
                  .WithMany(r => r.Comments)
                  .HasForeignKey(c => c.RequestId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Author)
                  .WithMany()
                  .HasForeignKey(c => c.AuthorId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RequestAttachment>(entity =>
        {
            entity.HasKey(a => a.AttachmentId);

            entity.Property(a => a.FileUri)
                  .IsRequired();

            entity.Property(a => a.FileType)
                  .IsRequired()
                  .HasMaxLength(256);

            entity.HasOne(a => a.Request)
                  .WithMany(r => r.Attachments)
                  .HasForeignKey(a => a.RequestId);
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

        modelBuilder.Entity<Announcement>(entity =>
        {
            entity.HasKey(a => a.AnnouncementId);
            entity.Property(a => a.Title).IsRequired().HasMaxLength(200);
            entity.Property(a => a.Content).IsRequired();

            // Связь с AnnouncementRead (каскадное удаление)
            entity.HasMany(a => a.Reads)
                  .WithOne(ar => ar.Announcement)
                  .HasForeignKey(ar => ar.AnnouncementId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AnnouncementRead>(entity =>
        {
            entity.HasKey(ar => ar.Id);

            
            entity.HasOne(ar => ar.User)
                  .WithMany()
                  .HasForeignKey(ar => ar.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(n => n.NotificationId);

            entity.Property(n => n.Title).IsRequired().HasMaxLength(200);
            entity.Property(n => n.Text).IsRequired();
            
            // При удалении пользователя удаляем и его уведомления
            entity.HasOne(n => n.User)
                  .WithMany()
                  .HasForeignKey(n => n.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RequestCategory>()
            .HasData(
                new RequestCategory { Id = 1, Name = "Сантехника" },
                new RequestCategory { Id = 2, Name = "Электрика" },
                new RequestCategory { Id = 3, Name = "Лифт" },
                new RequestCategory { Id = 4, Name = "Уборка" }
            );

        modelBuilder.Entity<Request>()
            .HasOne(r => r.Category)
            .WithMany(c => c.Requests)
            .HasForeignKey(r => r.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}