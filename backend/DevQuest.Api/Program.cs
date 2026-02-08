using DevQuest.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Bağlantısı (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=guestbook.db"));

// 2. CORS Ayarları (Frontend portun farklıysa 5173'ü ona göre güncelle)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevQuestPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite varsayılan portu
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevQuestPolicy");
app.UseAuthorization();
app.MapControllers();

// Veritabanını otomatik oluştur
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();