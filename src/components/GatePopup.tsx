'use client'
import { useEffect, useState } from 'react'

const CalcIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F03D00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="7" x2="16" y2="7"/>
    <rect x="8" y="11" width="2" height="2" rx="0.5"/>
    <rect x="11" y="11" width="2" height="2" rx="0.5"/>
    <rect x="14" y="11" width="2" height="2" rx="0.5"/>
    <rect x="8" y="15" width="2" height="2" rx="0.5"/>
    <rect x="11" y="15" width="2" height="2" rx="0.5"/>
    <rect x="14" y="15" width="2" height="2" rx="0.5"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F03D00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F03D00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const PeopleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F03D00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

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
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {})
      setSubmitted(true)
      setTimeout(dismiss, 1200)
    } else {
      dismiss()
    }
  }

  if (!visible) return null

  const perks: [React.ReactNode, string, string][] = [
    [<CalcIcon key="calc" />, 'severance calculator', 'know your number before they call you in'],
    [<HeartIcon key="heart" />, 'healthcare calculator', 'COBRA vs marketplace, your actual cost, your deadline'],
    [<ChatIcon key="chat" />, 'the waiting room', 'anonymous chat with tech workers going through the same wave'],
    [<PeopleIcon key="people" />, 'the directory', 'find people navigating the market. get found by the ones who can help.'],
  ]

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
      <div className="gate-card" style={{
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
          fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900,
          letterSpacing: '-2px', lineHeight: 1.0,
          color: '#1a1a1a', marginBottom: 14,
        }}>
          you're not<br /><span style={{ color: '#F03D00' }}>alone.</span>
        </h2>

        {/* Sub */}
        <p style={{
          fontSize: 14, lineHeight: 1.7, color: 'rgba(0,0,0,0.5)',
          marginBottom: 24, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto',
        }}>
          the best jobs don't get posted. they get passed along. we built tools to help you get ready and a directory to help you get found.
        </p>

        {/* Perks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, textAlign: 'left' }}>
          {perks.map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: 'rgba(0,0,0,0.65)', lineHeight: 1.5 }}>
              {icon}
              <span><strong>{title}.</strong> {desc}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {submitted ? (
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F03D00', marginBottom: 12 }}>
            you're in. welcome. 🧡
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && unlock()}
              placeholder="your@email.com"
              style={{
                width: '100%', border: '1.5px solid rgba(0,0,0,0.12)',
                borderRadius: 50, padding: '14px 20px',
                fontFamily: "'Work Sans', sans-serif", fontSize: 14,
                color: '#1a1a1a', background: 'white', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={unlock}
              style={{
                width: '100%', background: '#F03D00', color: 'white', border: 'none',
                borderRadius: 50, padding: '15px 0', fontWeight: 800,
                fontSize: 15, cursor: 'pointer',
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
          i'll look around first
        </button>
      </div>
    </div>
  )
}
