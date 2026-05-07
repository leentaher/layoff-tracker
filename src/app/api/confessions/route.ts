import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text required' }, { status: 400 })
  }

  const clean = text.trim()
  if (clean.length < 10 || clean.length > 280) {
    return NextResponse.json({ error: 'text must be 10–280 characters' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('confessions')
    .insert({ text: clean })

  if (error) {
    console.error('confession insert error:', error)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('confessions')
    .select('id, text, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: 'failed to fetch' }, { status: 500 })
  return NextResponse.json(data)
}
