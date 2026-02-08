using Microsoft.EntityFrameworkCore;
using DevQuest.Api.Models;

namespace DevQuest.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<GuestBookEntry> GuestBookEntries { get; set; }
        public DbSet<ContentItem> ContentItems { get; set; }
        public DbSet<Dialogue> Dialogues { get; set; }
    }
}