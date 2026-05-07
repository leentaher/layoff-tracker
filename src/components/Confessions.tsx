'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Confession = { id: string; text: string; created_at: string }

export default function Confessions({ initialConfessions }: { initialConfessions: Confession[] }) {
  const [confessions, setConfessions] = useState<Confession[]>(initialConfessions)
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Realtime subscription — new confessions appear live
  useEffect(() => {
    const channel = supabase
      .channel('confessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'confessions' }, (payload) => {
        setConfessions((prev) => [payload.new as Confession, ...prev.slice(0, 19)])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function submit() {
    if (!input.trim() || input.length < 10) return setError('too short — say a little more.')
    if (input.length > 280) return setError('keep it under 280 characters.')
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/confessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.trim() }),
    })

    if (res.ok) {
      setInput('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } else {
      setError('something went wrong. try again.')
    }
    setSubmitting(false)
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div id="confessions" style={{ background: 'var(--bg)', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 12 }}>tool · 02</p>
        <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 10 }}>confessions.</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.6, maxWidth: 500, marginBottom: 32 }}>anonymous. no account. say the thing you haven't said out loud yet.</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          <input
            style={{ flex: 1, border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: '12px 16px', fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: 'var(--black)', background: 'white', outline: 'none' }}
            placeholder="say something..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            maxLength={280}
          />
          <button
            onClick={submit}
            disabled={submitting}
            style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 6, padding: '12px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? '...' : submitted ? 'sent ✓' : 'post anonymously'}
          </button>
        </div>
        {error && <p style={{ fontSize: 12, color: 'var(--orange)', marginBottom: 16 }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {confessions.map((c) => (
            <div key={c.id} style={{ background: 'white', borderRadius: 8, padding: '18px 20px', fontSize: 14, lineHeight: 1.65, color: 'var(--black)', border: '1px solid rgba(0,0,0,0.08)', fontStyle: 'italic', fontWeight: 500 }}>
              "{c.text}"
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 10, fontStyle: 'normal' }}>
                {timeAgo(c.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
