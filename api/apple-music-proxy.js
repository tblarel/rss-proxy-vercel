import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = 'https://rss.applemarketingtools.com/api/v2/us/music/most-played/10/albums.json';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Apple Music data.');

    const data = await response.json();

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Apple Music Proxy Error:', err);
    res.status(500).json({ error: 'Failed to fetch Apple Music data.' });
  }
}