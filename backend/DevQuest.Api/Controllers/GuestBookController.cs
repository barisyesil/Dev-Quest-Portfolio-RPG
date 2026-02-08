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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GuestBookEntry>>> GetEntries()
        {
            return await _context.GuestBookEntries.OrderByDescending(x => x.CreatedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<GuestBookEntry>> PostEntry(GuestBookEntry entry)
        {
            entry.CreatedAt = DateTime.Now;
            _context.GuestBookEntries.Add(entry);
            await _context.SaveChangesAsync();
            return Ok(entry);
        }
    }
}