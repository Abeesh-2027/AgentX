function timeLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ role, text, time }) {
  const label = role === "user" ? "You" : role === "agent" ? "AgentX" : "System";
  return (
    <div className={`msg ${role}`}>
      <span className="msg-meta">
        {label} · {time || timeLabel()}
      </span>
      <div className="msg-bubble">{text}</div>
    </div>
  );
}
