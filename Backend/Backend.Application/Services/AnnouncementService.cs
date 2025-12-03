using Backend.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAppDbContext _context;

        public AnnouncementService(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Announcement> CreateAnnouncementAsync(string title, string content, bool isEmergency, CancellationToken ct)
        {
            var announcement = new Announcement
            {
                Title = title,
                Content = content,
                IsEmergency = isEmergency,
                CreatedAt = DateTime.UtcNow
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync(ct);
            return announcement;
        }

        public async Task DeleteAnnouncementAsync(int announcementId, CancellationToken ct)
        {
            var announcement = await _context.Announcements.FindAsync(new object[] { announcementId }, ct);
            if (announcement == null)
            {
                throw new KeyNotFoundException("Объявление не найдено.");
            }
            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<List<Announcement>> GetAllAnnouncementsAsync(int? userId, CancellationToken ct)
        {
            var query = _context.Announcements.AsQueryable();

            if (userId.HasValue)
            {
                query = query.Include(a => a.Reads.Where(r => r.UserId == userId.Value));
            }

            return await query
                .OrderByDescending(a => a.IsEmergency) 
                .ThenByDescending(a => a.CreatedAt)    
                .ToListAsync(ct);
        }

        public async Task<List<Announcement>> GetUnreadAnnouncementsAsync(int userId, CancellationToken ct)
        {
            return await _context.Announcements
                .Where(a => !a.Reads.Any(r => r.UserId == userId))
                .OrderByDescending(a => a.IsEmergency)
                .ThenByDescending(a => a.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task MarkAsReadAsync(int userId, int announcementId, CancellationToken ct)
        {
            var announcementExists = await _context.Announcements.AnyAsync(a => a.AnnouncementId == announcementId, ct);
            if (!announcementExists)
            {
                throw new KeyNotFoundException("Объявление не найдено.");
            }
            
            var alreadyRead = await _context.AnnouncementReads
                .AnyAsync(ar => ar.AnnouncementId == announcementId && ar.UserId == userId, ct);

            if (alreadyRead)
            {
                return; 
            }

            var readEntry = new AnnouncementRead
            {
                UserId = userId,
                AnnouncementId = announcementId,
                ReadAt = DateTime.UtcNow
            };

            _context.AnnouncementReads.Add(readEntry);
            await _context.SaveChangesAsync(ct);
        }
    }
}