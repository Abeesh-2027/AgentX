import { useCallback, useEffect, useRef, useState } from "react";
import Login from "./components/Login.jsx";
import Sidebar from "./components/Sidebar.jsx";
import MessageBubble from "./components/MessageBubble.jsx";
import { sendChat, fetchNews } from "./api.js";
import { parseIntent, buildGoogleSearchUrl, buildMapsUrl } from "./intent.js";
import { getCurrentPosition, isHereReference } from "./location.js";
import { useVoice } from "./useVoice.js";

const WELCOME = {
  role: "agent",
  text:
    "AgentX online. Ask me anything, or try a command:\n" +
    '"search apple in google" · "go from here to central park" · "news about ai"',
};

export default function App() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem("agentx_token");
    const username = localStorage.getItem("agentx_username");
    return token && username ? { token, username } : null;
  });
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false); // true = auto-speak agent replies
  const logRef = useRef(null);

  const handleTranscript = useCallback((transcript) => {
    setVoiceMode(true);
    setInput(transcript);
    // slight delay so the state settles before submit
    setTimeout(() => submitText(transcript, true), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const voice = useVoice({ onResult: handleTranscript });

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function pushMessage(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  function handleLoggedIn({ token, username }) {
    localStorage.setItem("agentx_token", token);
    localStorage.setItem("agentx_username", username);
    setSession({ token, username });
  }

  function handleLogout() {
    localStorage.removeItem("agentx_token");
    localStorage.removeItem("agentx_username");
    setSession(null);
    setMessages([WELCOME]);
  }

  async function submitText(rawText, spoken = false) {
    const text = rawText.trim();
    if (!text || !session) return;
    setInput("");
    pushMessage({ role: "user", text });

    const intent = parseIntent(text);

    if (intent.type === "google_search") {
      const url = buildGoogleSearchUrl(intent.query);
      window.open(url, "_blank", "noopener,noreferrer");
      const reply = `Opened Google search for "${intent.query}".`;
      pushMessage({ role: "system", text: reply });
      if (spoken) voice.speak(reply);
      return;
    }

    if (intent.type === "maps_route") {
      try {
        let origin = intent.origin;
        if (isHereReference(origin) || origin === "") {
          origin = await getCurrentPosition();
        }
        const url = buildMapsUrl({ origin, destination: intent.destination });
        window.open(url, "_blank", "noopener,noreferrer");
        const reply = `Opened directions to "${intent.destination}".`;
        pushMessage({ role: "system", text: reply });
        if (spoken) voice.speak(reply);
      } catch (err) {
        pushMessage({ role: "system", text: `Couldn't get your location: ${err.message}` });
      }
      return;
    }

    if (intent.type === "news") {
      setBusy(true);
      try {
        const items = await fetchNews(session.token, intent.topic);
        if (!items.length) {
          pushMessage({ role: "agent", text: "No headlines found for that." });
        } else {
          const summary = items
            .slice(0, 5)
            .map((item, i) => `${i + 1}. ${item.title}${item.source ? ` — ${item.source}` : ""}`)
            .join("\n");
          pushMessage({ role: "agent", text: summary });
          if (spoken) voice.speak(items.slice(0, 3).map((i) => i.title).join(". "));
        }
      } catch (err) {
        pushMessage({ role: "system", text: `News error: ${err.message}` });
      } finally {
        setBusy(false);
      }
      return;
    }

    // plain chat -> Groq
    setBusy(true);
    try {
      const history = [...messages, { role: "user", text }]
        .filter((m) => m.role === "user" || m.role === "agent")
        .slice(-12)
        .map((m) => ({ role: m.role === "agent" ? "assistant" : "user", content: m.text }));

      const reply = await sendChat(session.token, history);
      pushMessage({ role: "agent", text: reply });
      if (spoken) voice.speak(reply);
    } catch (err) {
      pushMessage({ role: "system", text: `Error: ${err.message}` });
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    submitText(input, false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitText(input, false);
    }
  }

  function toggleMic() {
    if (voice.listening) voice.stopListening();
    else voice.startListening();
  }

  if (!session) return <Login onLoggedIn={handleLoggedIn} />;

  return (
    <div className="console">
      <Sidebar username={session.username} onLogout={handleLogout} />
      <div className="main">
        <div className="topbar">
          <div className="status-line">
            <span className="pulse-dot" /> AGENTX ONLINE — GROQ / GPT-OSS-120B
          </div>
          {!voice.supported && (
            <div className="status-line" style={{ color: "var(--danger)" }}>
              Voice not supported in this browser
            </div>
          )}
        </div>

        <div className="log" ref={logRef}>
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} text={m.text} />
          ))}
          {busy && (
            <div className="msg agent">
              <span className="msg-meta">AgentX</span>
              <div className="msg-bubble typing-dots">
                <span /> <span /> <span />
              </div>
            </div>
          )}
        </div>

        <div className="hint-row">
          Try: "search apple in google" · "go from here to eiffel tower" · "news about space"
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <button
            type="button"
            className={`orb-btn ${voice.listening ? "listening" : ""} ${voice.speaking ? "speaking" : ""}`}
            onClick={toggleMic}
            title={voice.supported ? "Speak to AgentX" : "Voice not supported"}
            disabled={!voice.supported}
          >
            {voice.listening ? "●" : "🎙"}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or a command…"
            rows={1}
          />
          <button className="send-btn" type="submit" disabled={busy || !input.trim()}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
