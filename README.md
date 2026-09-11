# ⚡ TypeSprint — Modern Typing Platform & Speed Test

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2019-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](LICENSE)

**TypeSprint** is a high-performance, full-stack typing platform designed for developers, typists, and competitive speed-typers. Featuring real-time ghost racing, weak-key targeted practice, code snippet mode, live 1v1 challenges, custom sound profiles, and detailed analytics.

---

## ✨ Features & Highlights

- **⚡ Multiple Practice Modes**:
  - **Time Mode**: 15s, 30s, 60s, 120s high-intensity typing sprints.
  - **Words Mode**: Fixed count (10, 25, 50, 100 words).
  - **Quote Mode**: Famous developer quotes with author attribution.
  - **Code Mode**: Real-world programming code snippets (JavaScript, Python, Java, HTML/CSS).
  - **Targeted Weak-Keys Mode**: Automatically generates custom tests focused on your most frequently missed keys.

- **🏎️ Ghost Racer**:
  - Compete against your personal best WPM run with a live ghost indicator tracking your historic pace in real time.

- **⚔️ Live 1v1 Multiplayer Challenges**:
  - Challenge friends or online opponents to live synchronized typing duels with live leaderboard rankings and head-to-head stats.

- **📊 Comprehensive Analytics**:
  - Live burst WPM graph, accuracy over time, keystroke log replays, error heatmaps, and consistency scoring.

- **🎨 Themes & Sound Effects**:
  - **8 Vibrant Color Themes**: Classic Yellow, Midnight Dark, Cyberpunk Neon, Nord Frost, Sunset Orange, Clean Light, Hacker Terminal, Dracula.
  - **Web Audio API Keypress Sounds**: Audio feedback toggle directly on the control bar.

- **🏆 Gamification & XP System**:
  - Earn XP rewards, level up your profile badge, unlock achievements, and climb global and friends-only leaderboards.

---

## 📸 App Previews

| Home Typing Viewport | Test Result & Graph | Profile & Stats |
| :---: | :---: | :---: |
| ![Home Screen](screenshots/home-screen.png) | ![Result Screen](screenshots/result-screen.png) | ![User Profile](screenshots/profile1.png) |

---

## 🛠️ Tech Stack Architecture

### Frontend
- **Framework**: React 19 + Vite 8
- **Icons**: Lucide React
- **Styling**: Modern CSS3 (Custom Design System with dynamic CSS variables & Glassmorphism)
- **Audio Engine**: Web Audio API (Synthesized click sound profiles)

### Backend
- **Framework**: Java 17 + Spring Boot 3
- **Data Access**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL
- **Hosting**: Render Cloud Services

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: `v18+`
- **Java JDK**: `17+`
- **Maven**: `v3.8+`
- **PostgreSQL Database**

### 2. Backend Setup (Spring Boot)
```bash
# Navigate to the backend directory
cd backend

# Build and run backend server
mvn spring-boot:run
```
> The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup (React)
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> The frontend application will start on `http://localhost:5173`.

---

## 📂 Repository Structure

```text
TypeSprint/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/ambar/portfolio/
│   │   ├── config/             # CORS & Security Configuration
│   │   ├── controller/         # Auth, TestScore, Challenge & User Controllers
│   │   ├── model/              # JPA Entities (User, TestScore, Challenge)
│   │   └── service/            # Business Logic & Matchmaking Services
│   └── pom.xml
│
├── frontend/                   # React + Vite Application
│   ├── src/
│   │   ├── components/         # TypingBox, TypingViewport, Result, Leaderboard, etc.
│   │   ├── data/               # Words bank, code snippets, quotes, weak key generator
│   │   ├── hooks/              # Custom useTypingEngine logic
│   │   ├── pages/              # Home, DailyChallenge
│   │   ├── services/           # Centralized API service helpers
│   │   └── styles/             # Modular CSS stylesheets
│   ├── package.json
│   └── vite.config.js
```

---

## 📜 License & Community

This project is licensed under the [MIT License](LICENSE).

Contributions, feature suggestions, and bug reports are welcome! Feel free to open an issue on the [TypeSprint GitHub Repository](https://github.com/AmbarMishra973/TypeSprint/issues).
