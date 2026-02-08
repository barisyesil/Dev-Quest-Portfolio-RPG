namespace DevQuest.Api.Models
{
    public class Dialogue
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty; // "wc_easter_egg"
        public string Text { get; set; } = string.Empty;
    }
}