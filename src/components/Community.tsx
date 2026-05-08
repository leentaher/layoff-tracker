'use client'
import { useEffect, useState } from 'react'

type Entry = { id: string; handle: string; role: string; contact: string; created_at: string }

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
  const [entries, setEntries] = useState<Entry[]>([])
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [joined, setJoined] = useState(false)
  const [dirError, setDirError] = useState('')
  const [subscribeDispatch, setSubscribeDispatch] = useState(false)

  useEffect(() => {
    fetch('/api/directory')
      .then(r => r.json())
      .then((data: Entry[]) => { if (Array.isArray(data)) setEntries(data) })
      .catch(() => {})

    // poll every 30s for live count updates
    const poll = setInterval(() => {
      fetch('/api/directory')
        .then(r => r.json())
        .then((data: Entry[]) => { if (Array.isArray(data)) setEntries(data) })
        .catch(() => {})
    }, 30000)
    return () => clearInterval(poll)
  }, [])

  async function joinDirectory() {
    if (!handle.trim()) return setDirError('add your name.')
    if (!role.trim()) return setDirError('add your role.')
    setDirError('')
    setSubmitting(true)
    const res = await fetch('/api/directory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: handle.trim(), email: email.trim(), company: company.trim(), role: role.trim(), contact: contact.trim() }),
    })
    if (res.ok) {
      const newEntry: Entry = { id: crypto.randomUUID(), handle: handle.trim(), role: role.trim(), contact: contact.trim(), created_at: new Date().toISOString() }
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

  const count = entries.length
  const latest = entries[0]

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

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 32, display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* Left — copy + live stats */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>📦</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: 10, lineHeight: 1.2 }}>
              find people.<br />make warm intros.
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 28 }}>
              a directory of people actively navigating the market. add yourself, get found by the people who can actually help.
            </p>

            {/* Live count */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: 'white', letterSpacing: '-2px', lineHeight: 1 }}>
                  {count > 0 ? count : '—'}
                </span>
                <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  people in the directory
                </span>
              </div>
              {latest && (
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
                  last added · <span style={{ color: 'rgba(255,255,255,0.45)' }}>{latest.handle}</span> · {timeAgo(latest.created_at)}
                </p>
              )}
              {!latest && (
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                  be the first to join.
                </p>
              )}
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
                <input style={inputStyle} placeholder="your role *" value={role} onChange={e => setRole(e.target.value)} />
                <input style={inputStyle} placeholder="last company (optional)" value={company} onChange={e => setCompany(e.target.value)} />
                <input style={inputStyle} placeholder="linkedin URL" type="url" value={contact} onChange={e => setContact(e.target.value)} />
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
  )
}
