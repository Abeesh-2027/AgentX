import { useState } from "react";
import { login } from "../api.js";

export default function Login({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, username: name } = await login(username, password);
      onLoggedIn({ token, username: name });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-eyebrow">
          <span className="pulse-dot" /> AGENTX // SIGN IN
        </div>
        <h1 className="login-title">Welcome back.</h1>
        <p className="login-sub">Enter any username and a 5-digit code to open the console.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. pilot_01"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">5-digit code</label>
            <input
              id="password"
              type="password"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="•••••"
              required
            />
            <div className="field-hint">Exactly 5 digits, e.g. 42017</div>
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Connecting…" : "Enter console"}
          </button>
        </form>
      </div>
    </div>
  );
}
