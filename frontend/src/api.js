const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed.");
  return data; // { token, username }
}

export async function sendChat(token, messages) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AgentX couldn't reply.");
  return data.reply;
}

export async function fetchNews(token, topic) {
  const qs = topic ? `?topic=${encodeURIComponent(topic)}` : "";
  const res = await fetch(`${API_URL}/api/news${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Couldn't load news.");
  return data.items;
}
