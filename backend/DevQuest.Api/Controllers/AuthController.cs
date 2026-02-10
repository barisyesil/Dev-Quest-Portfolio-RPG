using Microsoft.AspNetCore.Mvc;

namespace DevQuest.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // appsettings.json dosyasından değerleri oku
            var validUser = _configuration["AdminSettings:Username"];
            var validPass = _configuration["AdminSettings:Password"];

            if (request.Username == validUser && request.Password == validPass)
            {
                // Basit bir token dönüyoruz (MVP için yeterli)
                // İleride buraya JWT (Json Web Token) ekleyebiliriz.
                return Ok(new { token = "admin-access-granted-token-123" });
            }

            return Unauthorized("Invalid credentials");
        }
    }

    // Gelen veriyi karşılamak için basit bir sınıf
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}