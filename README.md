# SkillSphere AI 🚀

An intelligent, AI-powered skill exchange platform that connects learners and mentors through smart recommendations, gamification, and personalized guidance. 

Built for the **SkillSphere AI (AI & Machine Learning Hackathon)**.

---

## 📖 The Problem
High-quality learning is expensive, and finding the right mentor can be incredibly difficult. While many platforms offer courses, they lack personalized, 1-on-1 peer mentoring. Traditional skill-swapping forums rely on tedious manual searching and lack intelligent matching or engagement mechanics.

## 💡 The Solution
SkillSphere AI completely revolutionizes peer-to-peer education by using Artificial Intelligence to perfectly match users based on mutual skill needs. We pair this with a powerful Gamification Engine to ensure users stay motivated and engaged throughout their learning journey.

---

## ✨ Key Features

### 🧠 AI & Machine Learning Integration (Powered by Gemini)
- **AI Profile Optimizer**: Acts as a virtual career coach, instantly rewriting user bios to be highly professional and engaging.
- **Smart Trending Skills**: Dynamically generates real-time trending tech skills so users know what the market demands.
- **AI Rating Summarizer**: Analyzes a mentor's feedback and generates a concise, positive one-sentence summary of their teaching strengths.
- **AI Match Scoring**: Intelligently evaluates the compatibility between two users' offered and wanted skills.

### 🎮 Gamification Engine
- **Dynamic XP System**: Users earn XP for interacting, accepting requests, and completing skill swaps.
- **Leveling Up**: Robust backend logic automatically levels up users as they hit XP milestones.
- **Leaderboards**: Dedicated APIs to track and display the top mentors on the platform.

### 💎 Premium Modern UI/UX
- **SaaS Dark Mode**: A sleek, high-contrast Zinc-based dark theme inspired by top-tier developer tools.
- **Interactive Dashboards**: Real-time analytics, dynamic progress rings, and a timeline of recent activity.
- **Sleek Real-time Chat**: Beautiful, modern chat interfaces with dynamic typing indicators.

---

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Premium Dark Theme)
- Framer Motion (Animations & Micro-interactions)
- Recharts (Data Visualization)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Google Generative AI (Gemini 1.5 Flash)
- Socket.io (Real-time Chat infrastructure)
- JWT (Authentication)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/team_hackshield.git
   cd team_hackshield
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Start the frontend server:
   ```bash
   npm run dev
   ```

4. **Seed Mock Data (Optional but recommended)**
   To see the platform fully populated, send a `POST` request to `http://localhost:5000/api/users/seed` (or trigger it via the API).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is licensed under the MIT License.