import fetch from 'node-fetch';
import xml2js from 'xml2js';

export default async function handler(req, res) {
  const rssUrl = 'https://tblarel.github.io/inyourbones/feed.xml';

  try {
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error("Failed to fetch RSS");

    const xml = await response.text();
    const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(parsed.rss.channel.item || []);
  } catch (err) {
    console.error("RSS Proxy Error:", err);
    res.status(500).json({ error: "Could not load feed." });
  }
}
