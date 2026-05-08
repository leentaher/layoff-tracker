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

  // ── Klaviyo v2 ───────────────────────────────────────────
  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (apiKey && listId) {
    const res = await fetch(`https://a.klaviyo.com/api/v2/list/${listId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        profiles: [{ email: clean }],
      }),
    })
    const text = await res.text()
    console.log('[klaviyo]', res.status, text)
  } else {
    console.log('[klaviyo] missing env vars — apiKey:', !!apiKey, 'listId:', !!listId)
  }

  return NextResponse.json({ ok: true })
}
