import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const pubPath = path.join(publicDir, 'published.json')
    if (fs.existsSync(pubPath)) {
      const archiveDir = path.join(publicDir, 'published_archives')
      if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true })
      const data = fs.readFileSync(pubPath)
      const archivePath = path.join(archiveDir, `${Date.now()}.json`)
      fs.writeFileSync(archivePath, data)
      fs.unlinkSync(pubPath)
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}
