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
    .then(() => {}) // ignore duplicate errors

  // ── Klaviyo ──────────────────────────────────────────────
  const apiKey = process.env.KLAVIYO_API_KEY
  const listId = process.env.KLAVIYO_LIST_ID

  if (apiKey && listId) {
    await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'revision': '2023-12-15',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: { email: clean },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: { type: 'list', id: listId },
            },
          },
        },
      }),
    }).catch(() => {}) // fail silently — don't block UX
  }

  return NextResponse.json({ ok: true })
}
