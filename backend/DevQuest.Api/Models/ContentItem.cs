namespace DevQuest.Api.Models
{
    public class ContentItem
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty; // "Project" veya "Achievement"
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty; // Virgülle ayrılmış: "React,C#,SQL"
        public string? Link { get; set; }
    }
}