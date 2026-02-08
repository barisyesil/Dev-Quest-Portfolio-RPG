namespace DevQuest.Api.Models
{
    public class GuestBookEntry
    {
        public int Id { get; set; }
        public string Author { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}