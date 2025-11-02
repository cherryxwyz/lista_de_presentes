export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const fetchRes = await fetch(url);
    const html = await fetchRes.text();

    // pega a imagem principal da página
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    const image = match ? match[1] : null;

    // pega o título também (opcional)
    const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    const title = titleMatch ? titleMatch[1] : url;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ image, title });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch", details: err.toString() });
  }
}
