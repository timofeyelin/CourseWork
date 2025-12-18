using Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; set; }
    DbSet<Account> Accounts { get; set; }
    DbSet<Bill> Bills { get; set; }
    DbSet<BillItem> BillItems { get; set; } 
    DbSet<Payment> Payment { get; set; }
    DbSet<RefreshToken> RefreshTokens { get; set; }
    DbSet<Request> Requests { get; set; }
    DbSet<RequestComment> RequestComments { get; set; }
    DbSet<RequestAttachment> RequestAttachments { get; set; }
    DbSet<Meter> Meters { get; set; }
    DbSet<MeterReading> MeterReadings { get; set; }
    DbSet<Announcement> Announcements { get; set; }
    DbSet<AnnouncementRead> AnnouncementReads { get; set; }
    DbSet<Notification> Notifications { get; set; }
    DbSet<AuditLog> AuditLogs { get; set; }
    DbSet<RequestCategory> RequestCategories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}