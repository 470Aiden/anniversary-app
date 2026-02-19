import { NextResponse } from 'next/server'

type TokenCache = {
  accessToken: string | null
  expiresAt: number
}

const tokenCache: TokenCache = {
  accessToken: null,
  expiresAt: 0,
}

async function fetchClientToken() {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  }

  const creds = Buffer.from(`${id}:${secret}`).toString('base64')
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Spotify token request failed: ${resp.status} ${text}`)
  }

  const data = await resp.json()
  const now = Date.now()
  tokenCache.accessToken = data.access_token
  // expires_in is seconds
  tokenCache.expiresAt = now + (data.expires_in || 3600) * 1000 - 5000
  return tokenCache.accessToken
}

async function getToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken
  }
  return fetchClientToken()
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('q')
    if (!q) return NextResponse.json({ error: 'Missing query parameter q' }, { status: 400 })

    const token = await getToken()

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=8&q=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!searchRes.ok) {
      const txt = await searchRes.text()
      return NextResponse.json({ error: 'Spotify search failed', details: txt }, { status: 502 })
    }

    const data = await searchRes.json()
    const tracks = (data.tracks?.items || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map((a: any) => ({ name: a.name })),
      album: {
        name: t.album?.name,
        images: t.album?.images || [],
      },
      preview_url: t.preview_url,
      external_url: t.external_urls?.spotify,
    }))

    return NextResponse.json({ tracks })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
