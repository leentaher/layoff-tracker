import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('directory')
    .select('id, handle, role, company, contact, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { handle, email, company, role, contact } = await req.json()

  if (!handle) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('directory')
    .insert({
      handle: handle.trim(),
      email: email?.trim() || null,
      company: company?.trim() || null,
      role: role?.trim() || null,
      contact: contact?.trim() || null,
    })

  if (error) {
    console.error('directory insert error:', error)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
