const GOOGLE_SEARCH_PATTERNS = [
  /^(?:google|search)\s+(.+?)\s+(?:on|in)\s+google$/i,
  /^(?:search|google)\s+(?:for\s+)?(.+)$/i,
  /^open google(?:\s+and)?\s+search\s+(?:for\s+)?(.+)$/i,
];

const ROUTE_PATTERNS = [
  /^(?:directions|route|navigate)\s+from\s+(.+?)\s+to\s+(.+)$/i,
  /^(?:go|drive|walk|travel)\s+from\s+(.+?)\s+to\s+(.+)$/i,
  /^(?:how do i get|how to get)\s+from\s+(.+?)\s+to\s+(.+)$/i,
  /^(?:directions|route|navigate)\s+to\s+(.+)$/i,
];

const NEWS_PATTERNS = [
  /^(?:news|headlines|latest news)(?:\s+(?:about|on|for))?\s*(.*)$/i,
  /^what'?s\s+(?:new|happening|the latest)(?:\s+(?:with|on|about))?\s*(.*)$/i,
];

export function parseIntent(rawText) {
  const text = rawText.trim();
  if (!text) return { type: "chat", text };

  for (const pattern of GOOGLE_SEARCH_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return { type: "google_search", query: match[1].trim() };
    }
  }

  for (const pattern of ROUTE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      if (match.length === 3) {
        return { type: "maps_route", origin: match[1].trim(), destination: match[2].trim() };
      }
      if (match.length === 2) {
        return { type: "maps_route", origin: "", destination: match[1].trim() };
      }
    }
  }

  for (const pattern of NEWS_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return { type: "news", topic: (match[1] || "").trim() };
    }
  }

  return { type: "chat", text };
}

export function buildGoogleSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function buildMapsUrl({ origin, destination }) {
  const params = new URLSearchParams({ api: "1" });
  params.set("destination", destination);
  if (origin) params.set("origin", origin);
  else params.set("travelmode", "driving"); // uses device's current location as origin
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
