using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevQuest.Api.Data;
using DevQuest.Api.Models;

namespace DevQuest.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuestBookController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GuestBookController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LİSTELE
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GuestBookEntry>>> GetEntries()
        {
            return await _context.GuestBookEntries.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }

        // 2. YENİ EKLE
        [HttpPost]
        public async Task<ActionResult<GuestBookEntry>> PostEntry(GuestBookEntry entry)
        {
            entry.CreatedAt = DateTime.Now; // Sunucu saatini bas
            _context.GuestBookEntries.Add(entry);
            await _context.SaveChangesAsync();
            return Ok(entry);
        }

        // 3. SİL (Admin Paneli İçin)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntry(int id)
        {
            var entry = await _context.GuestBookEntries.FindAsync(id);
            if (entry == null) return NotFound();

            _context.GuestBookEntries.Remove(entry);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}