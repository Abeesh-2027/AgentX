export default function Sidebar({ username, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        Agent<span className="x">X</span>
      </div>

      <div className="nav-section-title">Capabilities</div>
      <ul className="capability-list">
        <li>Chat, powered by Groq</li>
        <li>Voice in, voice out</li>
        <li>"search &lt;x&gt; in google"</li>
        <li>"go from &lt;a&gt; to &lt;b&gt;"</li>
        <li>"news about &lt;topic&gt;"</li>
      </ul>

      <div className="nav-section-title">Session</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Signed in as <strong style={{ color: "var(--text)" }}>{username}</strong>
      </div>

      <div className="sidebar-footer">
        AgentX Console v1.0
        <br />
        <button className="logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
