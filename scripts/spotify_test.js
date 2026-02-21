const fs = require('fs');
const path = require('path');

async function main() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found at', envPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(envPath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const m = line.match(/^\s*([^=#]+)=([^#]+)\s*$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  const id = env.SPOTIFY_CLIENT_ID || env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const secret = env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local');
    process.exit(1);
  }

  const creds = Buffer.from(`${id}:${secret}`).toString('base64');
  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('Failed to get token', tokenData);
      process.exit(1);
    }
    const token = tokenData.access_token;

    const q = process.argv[2] || 'perfect';
    const searchRes = await fetch(`https://api.spotify.com/v1/search?type=track&limit=12&q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await searchRes.json();
    const items = (data.tracks && data.tracks.items) || [];
    const out = items.map((t) => ({ id: t.id, name: t.name, preview_url: t.preview_url, artists: t.artists.map(a=>a.name), album_images: (t.album&&t.album.images)||[] }));
    console.log(JSON.stringify(out, null, 2));
  } catch (e) {
    console.error('Error', e);
    process.exit(1);
  }
}

main();
