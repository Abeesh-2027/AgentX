import fetch from "node-fetch";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are AgentX, a fast, plain-spoken AI assistant embedded in a
control console. You can chat normally, and you're aware the app around you can also:
open a Google search in a new tab, open Google Maps with directions between two places,
read out replies with voice, and pull live headlines. When a user's message is actually
one of those actions, the client handles it before it reaches you — so if you're being
asked something, just answer it directly and concisely. Keep replies tight and useful;
avoid filler and avoid saying you're an AI language model.`;

export async function getChatCompletion(messages) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  const payload = {
    model: MODEL,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.6,
    max_tokens: 1024,
  };

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error("Groq returned an empty response.");
  return reply;
}
