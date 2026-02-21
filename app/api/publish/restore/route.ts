import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const file = body.file
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const versionsDir = path.join(process.cwd(), 'public', 'published_versions')
    const src = path.join(versionsDir, file)
    if (!fs.existsSync(src)) return NextResponse.json({ error: 'Version not found' }, { status: 404 })

    const dest = path.join(process.cwd(), 'public', 'published.json')
    fs.copyFileSync(src, dest)
    const published = JSON.parse(fs.readFileSync(dest, 'utf8'))
    return NextResponse.json({ ok: true, published })
  } catch (e:any) {
    return NextResponse.json({ error: e.message||String(e) }, { status: 500 })
  }
}
