'use client'
import { useEffect, useState } from 'react'

export default function GatePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('gate_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem('gate_dismissed', '1')
    setVisible(false)
  }

  async function unlock() {
    if (email.trim()) {
      // POST email to confessions API reuse pattern — or just save to Supabase waitlist
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {}) // fail silently — don't block UX
      setSubmitted(true)
      setTimeout(dismiss, 1200)
    } else {
      dismiss()
    }
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      {/* Blurred backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,12,10,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#f5f0e8', borderRadius: 16,
        maxWidth: 480, width: '100%',
        padding: '44px 40px',
        textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.4s ease',
      }}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "'Courier Prime', monospace", fontSize: 11,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)', marginBottom: 16,
        }}>
          juicebokx · layoffs 2026
        </p>

        {/* Headline */}
        <h2 style={{
          fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 900,
          letterSpacing: '-1.5px', lineHeight: 1.05,
          color: '#1a1a1a', marginBottom: 12,
        }}>
          laid off or<br />waiting to find out.<br />
          <span style={{ color: '#F03D00' }}>we got you.</span>
        </h2>

        {/* Sub */}
        <p style={{
          fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.5)',
          marginBottom: 28, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto',
        }}>
          free tools for wherever you are right now. built by two people who've been through it. no hustle content. no upsell. just the stuff nobody tells you.
        </p>

        {/* Perks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, textAlign: 'left' }}>
          {[
            ['🧮', 'severance calculator', 'know your number before they call you in'],
            ['🏥', 'healthcare calculator', 'COBRA vs marketplace, your actual cost, your deadline'],
            ['📊', 'skill gap tool', 'how far are you from your next role, actually'],
            ['💬', 'the waiting room', 'anonymous chat with tech workers going through the same wave'],
            ['🙋', 'office hours', 'thursdays 12–1pm ET. mandira + leen in the chat. ask us anything.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <span><strong>{title}</strong>. {desc}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F03D00', marginBottom: 12 }}>
            you're in. welcome. 🧡
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && unlock()}
              placeholder="your@email.com"
              style={{
                flex: 1, border: '1.5px solid rgba(0,0,0,0.12)',
                borderRadius: 8, padding: '13px 16px',
                fontFamily: "'Work Sans', sans-serif", fontSize: 13,
                color: '#1a1a1a', background: 'white', outline: 'none', height: 48,
              }}
            />
            <button
              onClick={unlock}
              style={{
                background: '#F03D00', color: 'white', border: 'none',
                borderRadius: 8, padding: '0 22px', fontWeight: 800,
                fontSize: 13, cursor: 'pointer', height: 48, whiteSpace: 'nowrap',
              }}
            >
              get access →
            </button>
          </div>
        )}

        <p style={{
          fontFamily: "'Courier Prime', monospace", fontSize: 10,
          color: 'rgba(0,0,0,0.3)', lineHeight: 1.6, marginBottom: 4,
        }}>
          no spam. no pitch decks. unsubscribe whenever. we're not linkedin.
        </p>

        <button
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', fontSize: 11,
            color: 'rgba(0,0,0,0.3)', cursor: 'pointer', marginTop: 10,
            fontFamily: "'Work Sans', sans-serif", textDecoration: 'underline',
            display: 'block', marginLeft: 'auto', marginRight: 'auto',
          }}
        >
          skip for now
        </button>
      </div>
    </div>
  )
}
