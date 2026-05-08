import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const db = supabaseAdmin()

  // Upsert: increment the visitor count
  const { data, error } = await db.rpc('increment_visitors')

  if (error) {
    // Fallback: return a static number if table doesn't exist yet
    return NextResponse.json({ count: 12441 })
  }

  return NextResponse.json({ count: data })
}

export async function GET() {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('site_stats')
    .select('value')
    .eq('key', 'visitors')
    .single()

  if (error || !data) return NextResponse.json({ count: 12441 })
  return NextResponse.json({ count: data.value })
}
