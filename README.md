⚔️ DevQuest: Interactive RPG Portfolio
(Replace this link with a real screenshot of your game inside the arcade machine)

DevQuest is a unique, gamified personal portfolio web application. Instead of scrolling through a boring PDF resume, visitors explore a retro-styled 2D RPG world, interact with objects (computers, bookshelves, NPCs) to discover my skills, projects, and achievements.

It features a fully functional Arcade Machine interface, a Real-time Guestbook, and a secure Admin Panel (CMS) to manage content dynamically without touching the code.

🌟 Key Features
🎮 Interactive RPG World: Built with Phaser 3, featuring a character controller, collision detection, and animated tilemaps.

🕹️ Arcade Experience: The game is embedded inside a realistic Arcade Machine wrapper with a Matrix-style animated background.

🔐 Secure Admin Panel: A Cyberpunk-themed CMS (/admin) to Create, Read, Update, and Delete (CRUD) projects, achievements, and dialogues.

💾 Dynamic Content System: All in-game interactions fetch data from a SQL database via a .NET API.

📖 Live Guestbook: Visitors can sign the guestbook in real-time.

📱 Responsive Design: Works on desktop and adapts to different screen sizes.

🛠️ Tech Stack
Frontend
Framework: React 18 (Vite)

Game Engine: Phaser 3

Routing: React Router DOM v6

Styling: CSS Modules, Cyberpunk/Retro Aesthetics

HTTP Client: Fetch API

Backend
Framework: ASP.NET Core 8 Web API

Language: C#

ORM: Entity Framework Core

Database: SQL Server (LocalDB or Production)

Security: Environment-based Authentication

🚀 Getting Started
Follow these instructions to set up the project locally.

Prerequisites
Node.js (v18 or higher)

.NET 8 SDK

SQL Server (or SQL Server Express / LocalDB)

1. Clone the Repository
Bash
git clone https://github.com/yourusername/devquest-portfolio.git
cd devquest-portfolio
2. Backend Setup
Navigate to the API folder:

Bash
cd backend/DevQuest.Api
Configure Database & Admin Credentials: Create a file named appsettings.Development.json (if it doesn't exist) and configure your connection string and Admin credentials. Do not commit this file to GitHub if it contains real secrets.

JSON
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=DevQuestDb;Trusted_Connection=True;"
  },
  "AdminSettings": {
    "Username": "admin",
    "Password": "CHANGE_THIS_PASSWORD"
  }
}
Run Migrations & Start Server:

Bash
dotnet tool install --global dotnet-ef
dotnet ef database update
dotnet run
The backend will typically start on http://localhost:5174 (check your launchSettings.json).

3. Frontend Setup
Open a new terminal and navigate to the frontend folder:

Bash
cd frontend
Install Dependencies:

Bash
npm install
Start the Game:

Bash
npm run dev
Open your browser and visit http://localhost:5173.

📘 Developer Guide & Architecture
This section explains how to maintain and extend the project.

1. The ContentKey System (How Interaction Works)
The bridge between the Game (Phaser) and the Database (API) is the contentKey.

Tiled Map Editor: In Tiled, we place an "Object" on the Interactions layer.

Custom Property: We give this object a custom property named contentKey (e.g., project_list or about_me).

Frontend Logic: When the player presses 'E' near this object, InteractionManager.js reads the contentKey.

API Call: The frontend requests data from the backend using this key.

Result: The specific content (Modal, Dialogue, or Guestbook) associated with that key opens.

2. Managing Content (The Admin Panel)
You don't need to edit code to change your projects or skills.

Navigate to /admin.

Login with the credentials defined in appsettings.json.

Projects/Achievements: You can Add, Edit, or Delete entries. These updates reflect immediately in the game.

Dialogues: You can edit what NPCs or objects "say" by updating the text associated with their contentKey.

3. Updating the Map
The game uses Tiled Map Editor.

Install Tiled.

Open frontend/public/assets/maps/room1.json (or the .tmx source file if included).

To add a new interactive object:

Select the Interactions Object Layer.

Draw a rectangle.

Add a property: Name: contentKey, Type: String, Value: your_new_key.

Export: Export the map as JSON to the assets/maps folder.

Backend: Go to the Admin Panel and create a new Dialogue or Project entry that matches your_new_key.

📂 Project Structure
devquest-portfolio/
├── backend/
│   ├── Controllers/       # API Endpoints (Content, Auth, Guestbook)
│   ├── Data/              # EF Core DbContext
│   ├── Models/            # Database Entities
│   └── Program.cs         # App Configuration
├── frontend/
│   ├── public/assets/     # Game sprites, tilesets, and JSON maps
│   ├── src/
│   │   ├── components/    # React UI (AdminPanel, Login, GuestBook, Modals)
│   │   ├── services/      # API Fetch Logic (api.js)
│   │   ├── utils/         # Phaser Interaction Logic
│   │   ├── Game.jsx       # Main Phaser Game Component
│   │   └── App.jsx        # Main Layout & Routing
│   └── package.json
└── README.md
🛡️ Security Note
Environment Variables: The Admin Login uses appsettings.json or Environment Variables. Never commit your real passwords to GitHub.

The .gitignore file is configured to exclude sensitive settings files.

📜 License
This project is open-source and available under the MIT License.

👨‍💻 Author
[Your Name]

Computer Engineering Student & Full Stack Developer

[LinkedIn Profile]

[Kaggle Profile]

Built with ❤️ and Pixel Art.
