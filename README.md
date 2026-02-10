# ⚔️ DevQuest: Interactive RPG Portfolio

> *An interactive, gamified personal portfolio where visitors explore a retro 2D world to discover skills, projects, and achievements.*

---

## 📖 Overview

**DevQuest** reimagines the traditional developer portfolio. Instead of scrolling through a static PDF or HTML page, visitors step into a pixel-art RPG world embedded inside a retro **Arcade Machine**. 

Players control a character to explore a virtual office, interacting with objects (computers, bookshelves, NPCs) to unlock content. The project features a robust **Content Management System (CMS)**, allowing the owner to update projects, certificates, and dialogues in real-time without modifying the source code.

### ✨ Key Features

* **🎮 Interactive RPG World:** Built with **Phaser 3**, featuring character movement, collision detection, and animated tilemaps.
* **🕹️ Arcade Experience:** The game is wrapped in a responsive Arcade Machine interface with a Matrix-style animated background.
* **🔐 Admin Panel (CMS):** A secure, Cyberpunk-themed dashboard (`/admin`) to manage all portfolio content (Projects, Achievements, Dialogues).
* **💾 Dynamic Content System:** All in-game text and data are fetched dynamically from a SQL database via a **.NET 8 Web API**.
* **📖 Real-time Guestbook:** Visitors can leave notes and sign the guestbook, which is instantly saved to the database.
* **📱 Responsive Design:** Optimized for both desktop and mobile viewing.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 (Vite)
* **Game Engine:** Phaser 3
* **Routing:** React Router DOM v6
* **Styling:** CSS3 (Cyberpunk/Retro Aesthetics), CSS Modules
* **HTTP Client:** Fetch API

### Backend
* **Framework:** ASP.NET Core 8 Web API
* **Language:** C#
* **ORM:** Entity Framework Core
* **Database:** SQL Server (LocalDB or Production)
* **Authentication:** Environment-based (Admin Panel)

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
* **Node.js** (v18 or higher)
* **b.NET 8 SDK**
* **SQL Server** (SQL Server Express or LocalDB)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/devquest-portfolio.git](https://github.com/yourusername/devquest-portfolio.git)

cd devquest-portfolio
```
### 2. Backend Setup
Navigate to the API directory:

```bash
cd backend/DevQuest.Api
```

Configure Database & Admin Credentials: Create a file named appsettings.Development.json (if it doesn't exist). 

```
JSON
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=DevQuestDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "AdminSettings": {
    "Username": "admin",
    "Password": "YOUR_STRONG_PASSWORD"
  }
}
```

## Run Migrations & Start Server:

```Bash
# Install EF Core tools if you haven't
dotnet tool install --global dotnet-ef
```
# Update database
```
dotnet ef database update
```
# Run the API
```
dotnet run
```
The backend will typically start on http://localhost:5174 (check Properties/launchSettings.json).


3. Frontend Setup
Open a new terminal and navigate to the frontend directory:

``` Bash
cd frontend
```
Install Dependencies:

```Bash
npm install
```
Start the Game:

```Bash
npm run dev
```
Open your browser and visit http://localhost:5173.

## 📘 Developer Guide

### 1. The Interaction System (`ContentKey`)
The core mechanic linking the game to the database is the **`contentKey`**.

1.  **Tiled Map Editor:** Objects in the game map (e.g., a computer) are assigned a custom property named `contentKey` (e.g., `project_list`).
2.  **Frontend:** When the player interacts (presses 'E'), `InteractionManager.js` reads this key and calls the API.
3.  **Backend:** The API fetches the data associated with that key (Dialogues, Projects, etc.) and returns it to the game.

### 2. Using the Admin Panel
You don't need to touch the code to update your portfolio content.

1.  Go to `http://localhost:5173/login`.
2.  Enter the credentials defined in your `appsettings.json` (or Environment Variables).
3.  **Dashboard Features:**
    * **Projects:** Add, Edit, or Delete your portfolio projects.
    * **Achievements:** Manage certificates and awards.
    * **Dialogues:** Edit what NPCs or objects say in the game.
    * **Guestbook:** Moderate or delete guest entries.

### 3. Modifying the Map
The game uses **Tiled** for map creation.

1.  Download [Tiled Map Editor](https://www.mapeditor.org/).
2.  Open `frontend/public/assets/maps/room1.json` (or the `.tmx` source file).
3.  **To add a new interaction:**
    * Select the **Interactions** Object Layer.
    * Draw a shape (Rectangle) over the object you want to make interactive.
    * Add a Custom Property: Name `contentKey`, Type `String`, Value `my_new_key`.
    * Save and Export as JSON.
4.  **Connect to Data:** Go to the Admin Panel and create a new Dialogue or Project entry with the key `my_new_key`.

---

## 📂 Project Structure

```text
devquest-portfolio/
├── backend/
│   ├── DevQuest.Api/
│   │   ├── Controllers/       # API Endpoints (Content, Auth, Guestbook)
│   │   ├── Data/              # EF Core Context & Migrations
│   │   ├── Models/            # Database Entities
│   │   └── Program.cs         # App Configuration
├── frontend/
│   ├── public/
│   │   └── assets/            # Game assets (sprites, maps, audio)
│   ├── src/
│   │   ├── components/        # React UI (AdminPanel, Login, GuestBook)
│   │   ├── services/          # API Fetch Logic (api.js)
│   │   ├── utils/             # Phaser Interaction Logic
│   │   ├── Game.jsx           # Main Phaser Game Component
│   │   └── App.jsx            # Main Layout & Routing
│   └── package.json
└── README.md
```
## 📜 License
This project is open-source and available under the MIT License.
## 👨‍💻 Author
# Barış Yeşildağ - Tarbarho
