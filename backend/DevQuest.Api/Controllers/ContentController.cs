using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevQuest.Api.Data;
using DevQuest.Api.Models;

namespace DevQuest.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ContentController(AppDbContext context) => _context = context;

        // --- OKUMA (READ) ---

        [HttpGet("items/{category}")]
        public async Task<ActionResult<IEnumerable<ContentItem>>> GetItems(string category)
        {
            return await _context.ContentItems
                .Where(x => x.Category.ToLower() == category.ToLower())
                .ToListAsync();
        }

        [HttpGet("dialogues")]
        public async Task<ActionResult<IEnumerable<Dialogue>>> GetDialogues()
        {
            return await _context.Dialogues.ToListAsync();
        }

        // --- EKLEME (CREATE) ---

        [HttpPost("items")]
        public async Task<ActionResult<ContentItem>> PostItem(ContentItem item)
        {
            _context.ContentItems.Add(item);
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPost("dialogues")]
        public async Task<ActionResult<Dialogue>> PostDialogue(Dialogue dialogue)
        {
            _context.Dialogues.Add(dialogue);
            await _context.SaveChangesAsync();
            return Ok(dialogue);
        }

        // --- SİLME (DELETE) ---

        [HttpDelete("items/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.ContentItems.FindAsync(id);
            if (item == null) return NotFound();
            
            _context.ContentItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("dialogues/{id}")]
        public async Task<IActionResult> DeleteDialogue(int id)
        {
            var dialogue = await _context.Dialogues.FindAsync(id);
            if (dialogue == null) return NotFound();

            _context.Dialogues.Remove(dialogue);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // --- GÜNCELLEME (UPDATE) ---

        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(int id, ContentItem item)
        {
            if (id != item.Id) return BadRequest();
            
            _context.Entry(item).State = EntityState.Modified;
            
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!_context.ContentItems.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpPut("dialogues/{id}")]
        public async Task<IActionResult> UpdateDialogue(int id, Dialogue dialogue)
        {
            if (id != dialogue.Id) return BadRequest();
            
            _context.Entry(dialogue).State = EntityState.Modified;
            
            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!_context.Dialogues.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }
    }
}