import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'valid email required' }, { status: 400 })
  }

  const clean = email.trim().toLowerCase()

  // ── Supabase backup ──────────────────────────────────────
  await supabaseAdmin()
    .from('waitlist')
    .insert({ email: clean })
    .then(() => {})

  // ── Klaviyo v2 subscribe ─────────────────────────────────
  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  console.log('Klaviyo env check — apiKey present:', !!apiKey, '| listId:', listId)

  if (apiKey && listId) {
    const res = await fetch(`https://a.klaviyo.com/api/v2/list/${listId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        profiles: [{ email: clean }],
      }),
    })

    const body = await res.text()
    console.log('Klaviyo response:', res.status, body)
  }

  return NextResponse.json({ ok: true })
}
