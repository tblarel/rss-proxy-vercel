import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 🔹 CORS headers – set first so they apply to all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🔹 Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url =
    'https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topalbums/limit=10/xml';

  try {
    const response = await fetch(url);
    const body = await response.text();

    if (!response.ok) {
      console.error(
        'Apple RSS upstream error:',
        response.status,
        body.slice(0, 200)
      );
      // Mirror upstream status, but still include CORS
      return res.status(response.status).send(body);
    }

    // Tell the browser this is XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // You can add caching here if you want:
    // res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=300');

    return res.status(200).send(body);
  } catch (err) {
    console.error('Apple Music Proxy Error:', err);
    // Still CORS-safe because headers were set above
    return res.status(500).json({ error: 'Failed to fetch Apple Music data.' });
  }
}
