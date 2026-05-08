'use client'
import { useState } from 'react'

export default function FooterCTA() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function join() {
    if (!email.includes('@')) return
    setDone(true)
    setEmail('')
  }

  return (
    <>
      <div id="footer-cta" style={{ background: 'var(--black)', textAlign: 'center', padding: '72px 40px', borderTop: '3px solid var(--orange)' }}>
        <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, color: 'white', marginBottom: 12 }}>
          we made something<br /><span style={{ color: 'var(--orange)' }}>for exactly this.</span>
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28, lineHeight: 1.6 }}>
          not an app. not a productivity tool. something you hold with your hands.<br />something that has never sent you a push notification.
        </p>
        {done ? (
          <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--orange)' }}>you're on the list. we'll be in touch.</p>
        ) : (
          <div style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto 12px', alignItems: 'stretch' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && join()}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '14px 16px', fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: 'white', outline: 'none', height: 52 }}
            />
            <button
              onClick={join}
              style={{ background: 'var(--orange)', color: 'white', border: 'none', borderRadius: 6, padding: '0 24px', fontWeight: 800, fontSize: 14, cursor: 'pointer', height: 52 }}
            >
              join the directory
            </button>
          </div>
        )}
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
          analog-first · batch 1 · limited · juicebokx.com
        </p>
      </div>
      <footer style={{ background: 'var(--black)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>© 2026 juicebokx · yourenotalone</span>
        <a href="https://juicebokx.com" style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'var(--yellow)', textDecoration: 'none', opacity: 0.45 }}>juicebokx.com →</a>
      </footer>
    </>
  )
}
