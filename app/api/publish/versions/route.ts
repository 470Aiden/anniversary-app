import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const versionsDir = path.join(process.cwd(), 'public', 'published_versions')
    if (!fs.existsSync(versionsDir)) return NextResponse.json({ versions: [] })
    const files = fs.readdirSync(versionsDir).filter((f) => f.endsWith('.json'))
    const list = files.map((f) => ({
      file: f,
      path: `/published_versions/${f}`,
      ts: parseInt(f.replace('.json', ''), 10),
    })).sort((a,b)=>b.ts-a.ts)
    return NextResponse.json({ versions: list })
  } catch (e:any) {
    return NextResponse.json({ error: e.message||String(e) }, { status: 500 })
  }
}
