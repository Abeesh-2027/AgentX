import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { validateCredentials, issueToken, requireAuth } from "./src/auth.js";
import { getChatCompletion } from "./src/groq.js";
import { getHeadlines } from "./src/news.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

// --- CORS: only allow the configured frontend origin(s) ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin / curl / server-to-server (no origin header)
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// --- basic abuse protection ---
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "online", model: process.env.GROQ_MODEL || "openai/gpt-oss-120b" });
});

// --- Auth ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const result = validateCredentials(username, password);
  if (!result.ok) return res.status(400).json({ error: result.error });

  const token = issueToken(result.username);
  res.json({ token, username: result.username });
});

// --- Chat (Groq) ---
app.post("/api/chat", requireAuth, async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages[] is required." });
  }
  try {
    const reply = await getChatCompletion(messages);
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// --- News ---
app.get("/api/news", requireAuth, async (req, res) => {
  try {
    const items = await getHeadlines(req.query.topic);
    res.json({ items });
  } catch (err) {
    console.error("News error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AgentX backend online on port ${PORT}`);
});
