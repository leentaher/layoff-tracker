'use client'
import { useEffect, useState } from 'react'

type Entry = { id: string; handle: string; role: string; contact: string; created_at: string }

const SEED_ENTRIES: Entry[] = [
  { id: 'seed-1', handle: 'anonymous', role: 'senior product designer, open to UX research or design systems', contact: 'linkedin.com/in/example', created_at: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 'seed-2', handle: 'anonymous', role: 'engineering manager, 8 yrs, looking for director roles at series B+', contact: '@handle on linkedin', created_at: new Date(Date.now() - 34 * 60000).toISOString() },
]

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '14px 16px',
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 13,
  color: 'white',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

export default function Community() {
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES)
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [joined, setJoined] = useState(false)
  const [dirError, setDirError] = useState('')
  const [subscribeDispatch, setSubscribeDispatch] = useState(false)

  const [dispatchEmail, setDispatchEmail] = useState('')
  const [dispatchDone, setDispatchDone] = useState(false)

  useEffect(() => {
    fetch('/api/directory')
      .then(r => r.json())
      .then((data: Entry[]) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data)
      })
      .catch(() => {})
  }, [])

  async function joinDirectory() {
    if (!handle.trim()) return setDirError('add your name or handle.')
    if (!role.trim()) return setDirError('tell us what you\'re looking for.')
    setDirError('')
    setSubmitting(true)
    const res = await fetch('/api/directory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: handle.trim(), email: email.trim(), company: company.trim(), role: role.trim(), contact: contact.trim() }),
    })
    if (res.ok) {
      const newEntry: Entry = { id: crypto.randomUUID(), handle: handle.trim(), role: `${role.trim()}${company.trim() ? ` · ex-${company.trim()}` : ''}`, contact: contact.trim() || 'anonymous', created_at: new Date().toISOString() }
      setEntries(prev => [newEntry, ...prev])
      if (subscribeDispatch && email.trim().includes('@')) {
        fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        }).catch(() => {})
      }
      setHandle(''); setEmail(''); setCompany(''); setRole(''); setContact('')
      setJoined(true)
    } else {
      setDirError('something went wrong. try again.')
    }
    setSubmitting(false)
  }

  async function joinDispatch() {
    if (!dispatchEmail.includes('@')) return
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dispatchEmail.trim() }),
    }).catch(() => {})
    setDispatchDone(true)
    setDispatchEmail('')
  }

  return (
    <div id="community" style={{ background: 'var(--black)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>

        {/* Header */}
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>community · 06</p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'white', marginBottom: 12 }}>
          you don't have to<br />navigate this alone.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 48, lineHeight: 1.6 }}>
          real people. real situations. no linkedin energy.
        </p>

        {/* Two column cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, alignItems: 'start' }}>

          {/* Directory card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 32, display: 'flex', gap: 40, alignItems: 'flex-start' }}>

            {/* Left — header + entries */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>📦</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: 10, lineHeight: 1.2 }}>
                find people.<br />make warm intros.
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 6 }}>
                a searchable directory of people going through it. add yourself, find others. no algorithms. no feed. just a list of humans and what they need.
              </p>
              <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 18 }}>
                role · what you're open to · how to reach you
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {entries.slice(0, 6).map(e => (
                  <div key={e.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: 4 }}>{e.role}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                      {e.contact} · {timeAgo(e.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div style={{ width: 340, flexShrink: 0 }}>
              {joined ? (
                <div style={{ background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: 8, padding: '24px', textAlign: 'center', marginTop: 60 }}>
                  <p style={{ color: 'var(--orange)', fontWeight: 800, fontSize: 14 }}>you're in the directory ✓</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>others can find you now.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 60 }}>
                  <input style={inputStyle} placeholder="first & last name" value={handle} onChange={e => setHandle(e.target.value)} />
                  <input style={inputStyle} placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <input style={inputStyle} placeholder="last company (optional)" value={company} onChange={e => setCompany(e.target.value)} />
                  <input style={inputStyle} placeholder="what are you looking for? (optional)" value={role} onChange={e => setRole(e.target.value)} />
                  <input style={inputStyle} placeholder="how to reach you — linkedin, twitter, email" value={contact} onChange={e => setContact(e.target.value)} />
                  {dirError && <p style={{ fontSize: 11, color: 'var(--orange)', marginTop: -2 }}>{dirError}</p>}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 2px' }}>
                    <input
                      type="checkbox"
                      checked={subscribeDispatch}
                      onChange={e => setSubscribeDispatch(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--orange)', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      subscribe to the weekly dispatch
                    </span>
                  </label>
                  <button
                    onClick={joinDirectory}
                    disabled={submitting}
                    style={{ background: 'var(--orange)', color: 'white', border: 'none', borderRadius: 8, padding: '14px 20px', fontWeight: 800, fontSize: 14, cursor: 'pointer', opacity: submitting ? 0.7 : 1, marginTop: 4 }}
                  >
                    {submitting ? 'adding you...' : 'add me to the directory →'}
                  </button>
                </div>
              )}
            </div>

          </div>


        </div>
      </div>
    </div>
  )
}
