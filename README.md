# AgentX

A voice-and-text AI agent console. Chat, speak, and issue live commands:

- **Chat** — powered by Groq (`openai/gpt-oss-120b`)
- **Voice-to-voice** — mic in (Web Speech `SpeechRecognition`), spoken replies out (`speechSynthesis`) — works on any device with a supporting browser (best on Chrome/Edge desktop + Android)
- **"search apple in google"** → opens `google.com/search?q=apple` in a new tab
- **"go from here to eiffel tower"** → opens Google Maps directions, using the device's real GPS location for "here"
- **"news about ai"** → pulls live headlines (Google News RSS, no API key needed)
- **Login** — any username, password must be exactly 5 digits (demo auth, JWT session)
- Responsive — works down to mobile width

## Architecture

```
frontend/  React + Vite  →  deploy to Vercel
backend/   Node + Express →  deploy to Render
```

The frontend calls the backend over `VITE_API_URL`. The backend talks to Groq
for chat and to Google News RSS for headlines. Google Search and Google Maps
are opened directly from the browser — no server involved for those, since
they're just URLs.

## 1. Run locally

**Backend**
```bash
cd backend
cp .env.example .env
# edit .env: paste your GROQ_API_KEY (free at https://console.groq.com/keys)
npm install
npm run dev        # http://localhost:8080
```

**Frontend** (new terminal)
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:8080 (already default)
npm install
npm run dev             # http://localhost:5173
```

Open http://localhost:5173, log in with any username and a 5-digit code (e.g. `42017`).

## 2. Deploy backend → Render

1. Push this repo (or just the `backend/` folder) to GitHub.
2. On [Render](https://render.com) → **New → Web Service** → connect the repo.
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - (Or just use the included `render.yaml` blueprint via "New → Blueprint".)
3. Set environment variables in Render's dashboard:
   - `GROQ_API_KEY` — your key
   - `GROQ_MODEL` — `openai/gpt-oss-120b`
   - `JWT_SECRET` — any long random string
   - `ALLOWED_ORIGINS` — your Vercel URL once you have it, e.g. `https://agentx.vercel.app` (comma-separate multiple)
4. Deploy. Note the Render URL, e.g. `https://agentx-backend.onrender.com`.

## 3. Deploy frontend → Vercel

1. Push `frontend/` to GitHub (same repo is fine).
2. On [Vercel](https://vercel.com) → **New Project** → import the repo.
   - Root directory: `frontend`
   - Framework preset: Vite (auto-detected)
3. Set environment variable:
   - `VITE_API_URL` = your Render URL from step 2 (e.g. `https://agentx-backend.onrender.com`)
4. Deploy. Vercel gives you a live URL, e.g. `https://agentx.vercel.app`.
5. Go back to Render and set `ALLOWED_ORIGINS` to that exact Vercel URL, then redeploy the backend so CORS allows it.

## 4. Connect + verify

- Open your Vercel URL on desktop and on your phone — layout adapts to both.
- Log in, then try:
  - `search apple in google`
  - `go from here to central park` (grant location permission when prompted)
  - `news about space`
  - Tap the mic and just talk — AgentX transcribes, routes the command or replies, and (in voice mode) speaks back.

## Notes for the portfolio writeup

- Auth is intentionally minimal (no user database) — it's a session gate, not a real identity system. Swap in a real DB + hashed passwords if this becomes more than a demo.
- Web search / maps are handled as **client-side actions** (opening the real Google URL) rather than scraped — this is faster, always accurate, and needs no search API key.
- News uses Google's public RSS, so there's no key to manage there either.
- The only paid/keyed dependency is Groq, which has a generous free tier.
