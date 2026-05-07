import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// This runs daily at 6am UTC via vercel.json cron config
// It scrapes layoffs.fyi and upserts into Supabase

export async function GET(req: NextRequest) {
  // Verify the request is from Vercel cron (or your own call with secret)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const events = await scrapeLayoffsFyi()
    
    if (events.length === 0) {
      return NextResponse.json({ ok: true, message: 'no new events found', count: 0 })
    }

    // Upsert — won't duplicate on company+date conflict
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

async function scrapeLayoffsFyi() {
  // layoffs.fyi exposes a public CSV at this URL
  // This is the cleanest way to get their data without scraping HTML
  const CSV_URL = 'https://layoffs.fyi/layoffs.csv'
  
  const res = await fetch(CSV_URL, {
    headers: { 'User-Agent': 'layofftracker/1.0 (juicebokx.com)' },
    next: { revalidate: 0 }, // never cache this
  })

  if (!res.ok) {
    throw new Error(`layoffs.fyi responded with ${res.status}`)
  }

  const csv = await res.text()
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())

  // Parse CSV — layoffs.fyi columns: Company, Reported_Employees_Laid_Off, Date, Industry, Stage, Country, Source
  const events = lines.slice(1).slice(0, 100).map(line => {
    const cols = parseCsvLine(line)
    const get = (key: string) => cols[headers.indexOf(key)]?.replace(/"/g, '').trim() || null

    const company = get('company')
    const date = get('date')
    if (!company || !date) return null

    const numStr = get('reported_employees_laid_off') || get('# laid off') || ''
    const num_laid_off = numStr ? parseInt(numStr.replace(/,/g, ''), 10) || null : null

    return {
      company,
      num_laid_off,
      date: parseDate(date),
      industry: get('industry'),
      stage: get('stage'),
      country: get('country') || 'United States',
      source_url: get('source') || get('sources') || null,
      notes: null,
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

function parseDate(dateStr: string): string {
  // Handle M/D/YYYY and YYYY-MM-DD formats
  if (dateStr.includes('/')) {
    const [m, d, y] = dateStr.split('/')
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return dateStr
}
