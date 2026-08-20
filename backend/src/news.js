import fetch from "node-fetch";
export async function getHeadlines(topic) {
  const query = topic && topic.trim() ? encodeURIComponent(topic.trim()) : null;
  const url = query
    ? `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`
    : `https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (AgentX news client)" },
  });
  if (!res.ok) throw new Error(`News feed error (${res.status})`);

  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, 8)
    .map((match) => {
      const block = match[1];
      const title = (block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "")
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .trim();
      const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").trim();
      const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "").trim();
      const source = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "")
        .replace(/<!\[CDATA\[|\]\]>/g, "")
        .trim();
      return { title, link, pubDate, source };
    })
    .filter((item) => item.title);

  return items;
}
