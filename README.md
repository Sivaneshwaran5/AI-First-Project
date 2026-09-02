# AI-Powered Sales Intelligence Platform

A full-stack, enterprise-grade **Sales Intelligence Platform** built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, Recharts, Web Audio API, and OpenAI Whisper / Google Gemini AI integration.

The platform turns sales calls into actionable revenue intelligence by automatically transcribing meeting audio, identifying speakers (Sales Rep vs. Prospect), tracking customer sentiment moment-by-moment, calculating buyer intent scores, generating automated action items, and providing AI coaching feedback.

---

## 🚀 Key Features

### 1. Audio Upload & Live Recording Studio
- **Live Microphone Recording**: Real-time microphone audio capture with Web Audio API frequency/waveform visualizer, pause/resume, and instant playback review.
- **Multi-Format Audio Upload**: Drag-and-drop support for `MP3`, `WAV`, `M4A`, `WEBM`, and `OGG` audio files with file size validation.
- **Direct Transcript Analysis**: Paste or type raw transcripts for instant AI synthesis.
- **Instant Demo Presets**: 1-click test datasets for Cloud SaaS & FinTech sales calls.

### 2. Deep Customer Sentiment & Intent Analytics
- **Sentiment Timeline Curve**: Recharts interactive graph visualizing conversational tone progression (positive, neutral, objections) across meeting minutes.
- **Tone Breakdown**: Donut chart tracking Positive Affirmations, Neutral Inquiries, and Customer Objections.
- **Buyer Intent Meter (0–100%)**: Quantitative intent index with readiness level (Low, Medium, High, Very High).
- **Deal Win Probability**: Statistical deal close forecast based on objection resolution and buyer signals.

### 3. Interactive Action Items & Follow-ups
- **Automated Task Extraction**: AI extracts commitments, follow-ups, owners, and due dates directly from the call audio.
- **Interactive Checklist**: Real-time completion toggle synced with MongoDB.
- **Task Management**: Add custom tasks, filter by status (`All`, `Pending`, `High Priority`, `Completed`), and delete finished items.

### 4. Full Speaker Diarization & Audio Player
- **Diarized Dialogue**: Distinguishes between **Sales Rep** and **Prospect** turns with distinct badges and timestamp chips.
- **Synchronized Audio Playback**: Audio player integrated with transcript scrubbing.
- **In-Transcript Search**: Instant keyword search with match highlighting.
- **Turn-by-Turn Sentiment & Intent**: Micro-sentiment and intent ratings for every spoken paragraph.

### 5. AI Sales Coach & Objection Handling
- **Talk-to-Listen Ratio**: Visual indicator comparing rep vs. prospect speaking time against optimal 45/55 benchmarks.
- **Objection Counter-Strategies**: Lists prospect objections by severity (`High`, `Medium`, `Low`) with suggested counter-arguments.
- **Competitor Tracking**: Automatically identifies and tracks competitor mentions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts, Axios, Web Audio API |
| **Backend** | Node.js, Express.js, Multer, JWT, Bcrypt.js, Morgan, CORS |
| **Database** | MongoDB, Mongoose (with automated In-Memory MongoDB zero-config fallback) |
| **AI Engines** | OpenAI Whisper API, Google Gemini API (`@google/generative-ai`), GPT-4o |

---

## 📦 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection with zero-config in-memory fallback
│   │   ├── controllers/     # Auth, Meeting Intelligence, and Analytics controllers
│   │   ├── middleware/      # JWT auth, Multer audio upload, and error handler
│   │   ├── models/          # User and Meeting Mongoose schemas
│   │   ├── routes/          # RESTful API route definitions
│   │   ├── services/        # Whisper/Gemini STT & LLM synthesis service, seed data
│   │   ├── uploads/         # Saved audio recordings
│   │   └── server.js        # Express server entry point
│   ├── .env.example         # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar, AudioRecorder, AudioUploader, TranscriptViewer,
│   │   │                    # SentimentChart, ActionItemsList, CoachingCard, MeetingCard, StatCard
│   │   ├── context/         # AuthContext (JWT state & demo profile switcher)
│   │   ├── pages/           # Dashboard, MeetingsList, MeetingDetail, NewMeeting, Analytics, Login, Register
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # React Router & Layout
│   │   ├── index.css        # Tailwind & Glassmorphism design tokens
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json             # Root runner
└── README.md
```

---

## ⚡ Quickstart & Installation

### Prerequisites
- Node.js v18+ and npm installed.
- (Optional) MongoDB running locally or a MongoDB Atlas URI. *Note: If MongoDB is not running locally, the application automatically launches an in-memory MongoDB instance with zero manual setup.*

### 1. Clone & Install Dependencies
Run from the root directory:
```bash
# Install backend and frontend dependencies
npm run install:all
```
Or install individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration
Create `.env` inside `backend/`:
```bash
cp backend/.env.example backend/.env
```

Default configuration in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sales_intelligence
JWT_SECRET=super_secret_sales_ai_jwt_key_2026_production_ready
JWT_EXPIRES_IN=7d

# Optional AI API Keys (Intelligent realistic simulation active if left blank)
GEMINI_API_KEY=
OPENAI_API_KEY=

MAX_FILE_SIZE_MB=50
```

### 3. Run Application

**Start Backend:**
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Start Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo User Credentials

The platform comes pre-seeded with realistic B2B enterprise sales conversations. You can sign in using 1-click demo buttons on the login screen or with:

| Role | Email | Password |
|---|---|---|
| **Sales Rep** | `alex@salesai.com` | `password123` |
| **Sales Manager** | `elena@salesai.com` | `password123` |

---

## 📡 RESTful API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new sales rep or manager account
- `POST /api/auth/login` — Sign in with email and password
- `POST /api/auth/demo-login` — 1-click demo authentication
- `GET /api/auth/me` — Retrieve active authenticated user profile

### Meeting Intelligence (`/api/meetings`)
- `GET /api/meetings` — List meetings with search, stage/sentiment filters, and sorting
- `GET /api/meetings/:id` — Retrieve full meeting details (summary, transcript, sentiment curve, action items)
- `POST /api/meetings/upload` — Upload audio file (MP3/WAV) + run STT + LLM pipeline
- `POST /api/meetings/analyze-text` — Submit raw transcript text for AI analysis
- `PATCH /api/meetings/:id/action-items/:itemId` — Toggle or update an action item
- `POST /api/meetings/:id/action-items` — Add a new action item
- `DELETE /api/meetings/:id/action-items/:itemId` — Delete an action item
- `DELETE /api/meetings/:id` — Delete a meeting record
- `POST /api/meetings/seed` — Reset and seed demo sales calls

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` — Aggregated metrics (pipeline value, average sentiment, buyer intent, objections, competitor frequency)

---

## 📄 License
MIT License.
