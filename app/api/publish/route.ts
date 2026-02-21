import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

async function saveData(publicDir: string, payload: any) {
  // Ensure directories
  const publishedDir = path.join(publicDir)
  const uploadsDir = path.join(publicDir, 'uploads')
  const versionsDir = path.join(publicDir, 'published_versions')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  if (!fs.existsSync(versionsDir)) fs.mkdirSync(versionsDir, { recursive: true })

  // Helper to write data URLs to files and return public path
  const writeDataUrl = (dataUrl: string, prefix: string) => {
    const match = dataUrl.match(/^data:(.+);base64,(.*)$/)
    if (!match) return null
    const mime = match[1]
    const ext = mime.split('/')[1].split('+')[0] || 'bin'
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(uploadsDir, filename)
    const buffer = Buffer.from(match[2], 'base64')
    fs.writeFileSync(filePath, buffer)
    return `/uploads/${filename}`
  }

  // Normalize photos: if data URLs, write files
  const photos = (payload.photos || []).map((p: string) => {
    if (typeof p === 'string' && p.startsWith('data:')) {
      const pub = writeDataUrl(p, 'photo')
      return pub || p
    }
    return p
  })

  // Normalize uploaded tracks: write data urls and update previewUrl
  const uploaded = (payload.uploadedTracks || []).map((t: any) => {
    if (t.previewUrl && typeof t.previewUrl === 'string' && t.previewUrl.startsWith('data:')) {
      const pub = writeDataUrl(t.previewUrl, 'audio')
      return { ...t, previewUrl: pub || t.previewUrl }
    }
    return t
  })

  // Update queue entries to point to uploaded file paths where needed
  const queue = (payload.queue || []).map((s: any) => {
    if (s.previewUrl && s.previewUrl.startsWith('data:')) {
      const pub = writeDataUrl(s.previewUrl, 'audio')
      return { ...s, previewUrl: pub || s.previewUrl }
    }
    return s
  })

  const published = {
    photos,
    uploadedTracks: uploaded,
    queue,
    metadata: payload.metadata || {},
    publishedAt: new Date().toISOString(),
  }

  const outPath = path.join(publishedDir, 'published.json')
  fs.writeFileSync(outPath, JSON.stringify(published, null, 2))

  const versionPath = path.join(versionsDir, `${Date.now()}.json`)
  fs.writeFileSync(versionPath, JSON.stringify(published, null, 2))

  return published
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const publicDir = path.join(process.cwd(), 'public')
    const published = await saveData(publicDir, body)
    return NextResponse.json({ ok: true, published })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
