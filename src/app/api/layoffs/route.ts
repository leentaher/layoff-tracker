import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('layoff_events')
    .select('*')
    .order('date', { ascending: false })
    .limit(50)

  if (error || !data) return NextResponse.json([])
  return NextResponse.json(data)
}
