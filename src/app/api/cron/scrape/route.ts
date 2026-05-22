import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Runs daily at 6am UTC via vercel.json cron config
// Fetches from layoffhedge.com public CSV and upserts into Supabase

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const events = await fetchLayoffHedge()

    if (events.length === 0) {
      return NextResponse.json({ ok: true, message: 'no new events found', count: 0 })
    }

    const { error, count } = await supabaseAdmin()
      .from('layoff_events')
      .upsert(events, { onConflict: 'company,date', ignoreDuplicates: true })
      .select()

    if (error) {
      console.error('cron upsert error:', error)
      return NextResponse.json({ error: 'db error', details: error.message }, { status: 500 })
    }

    console.log(`cron: upserted ${count} layoff events`)
    return NextResponse.json({ ok: true, count })

  } catch (err) {
    console.error('cron scrape error:', err)
    return NextResponse.json({ error: 'scrape failed' }, { status: 500 })
  }
}

async function fetchLayoffHedge() {
  // layoffhedge.com public CSV — columns: Company, Industry, People Cut, Workforce %, Total Workforce, Date, Category, Source URL
  const CSV_URL = 'https://layoffhedge.com/data/layoffs-2026.csv'

  const res = await fetch(CSV_URL, {
    headers: { 'User-Agent': 'layofftracker/1.0 (juicebokx.com)' },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`layoffhedge responded with ${res.status}`)

  const csv = await res.text()
  const allLines = csv.trim().split('\n')
  const lines = allLines.filter(l => !l.startsWith('#'))
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())

  const events = lines.slice(1).map(line => {
    const cols = parseCsvLine(line)
    const get = (key: string) => cols[headers.indexOf(key)]?.replace(/"/g, '').trim() || null

    const company = get('company')
    const dateStr = get('date')
    if (!company || !dateStr) return null

    const numStr = get('people cut') || ''
    const num_laid_off = numStr ? parseInt(numStr.replace(/,/g, ''), 10) || null : null

    return {
      company,
      num_laid_off,
      date: parseDate(dateStr),
      industry: get('industry'),
      notes: get('category'),
      source_url: get('source url'),
      country: 'United States',
    }
  }).filter(Boolean)

  return events as NonNullable<typeof events[0]>[]
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (const char of line) {
    if (char === '"') { inQuotes = !inQuotes; continue }
    if (char === ',' && !inQuotes) { result.push(current); current = ''; continue }
    current += char
  }
  result.push(current)
  return result
}

// Handles: "May 20" → "2026-05-20", "Mar 2026" → "2026-03-01", "2026" → "2026-01-01"
function parseDate(dateStr: string): string {
  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  }
  const s = dateStr.trim()
  const parts = s.split(' ')
  if (parts.length === 2) {
    const m = months[parts[0].toLowerCase().slice(0, 3)]
    if (m) {
      const second = parts[1]
      // "May 20" — second part is a day number (1-2 digits)
      if (second.length <= 2) return `2026-${m}-${second.padStart(2, '0')}`
      // "Mar 2026" — second part is a 4-digit year
      return `2026-${m}-01`
    }
  }
  // M/D/YYYY
  if (s.includes('/')) {
    const [m, d, y] = s.split('/')
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  // "2026" or "2025-26" — use Jan 1
  if (/^\d{4}/.test(s)) return '2026-01-01'
  return s
}
