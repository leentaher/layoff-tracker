import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { username, text } = await req.json()

  if (!username || !text) {
    return NextResponse.json({ error: 'username and text required' }, { status: 400 })
  }

  const cleanText = text.trim()
  const cleanUser = username.trim()

  if (cleanText.length < 1 || cleanText.length > 300) {
    return NextResponse.json({ error: 'text must be 1–300 characters' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('chat_messages')
    .insert({ username: cleanUser, text: cleanText })

  if (error) {
    console.error('chat insert error:', error)
    return NextResponse.json({ error: 'failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: 'failed to fetch' }, { status: 500 })
  return NextResponse.json(data?.reverse() ?? [])
}
