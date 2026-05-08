import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('directory')
    .select('id, handle, role, contact, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json([], { status: 200 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { handle, email, company, role, contact } = await req.json()

  if (!handle || !role) {
    return NextResponse.json({ error: 'handle and role required' }, { status: 400 })
  }

  const displayRole = `${role.trim()}${company?.trim() ? ` · ex-${company.trim()}` : ''}`

  const { error } = await supabaseAdmin()
    .from('directory')
    .insert({
      handle: handle.trim(),
      email: email?.trim() || null,
      role: displayRole,
      contact: contact?.trim() || 'anonymous',
    })

  if (error) {
    console.error('directory insert error:', error)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
