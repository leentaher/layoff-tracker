import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'valid email required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('waitlist')
    .insert({ email: email.trim().toLowerCase() })

  if (error) {
    // If duplicate, still return ok — don't expose that email exists
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
