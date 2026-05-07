export default function WhatNow() {
  const cards = [
    { when: 'now', title: 'read your severance before you sign anything', body: 'you have time. don\'t let them rush you. this document is negotiable.', dark: false },
    { when: '48hrs', title: 'don\'t send that email', body: 'you know the one. wait 48 hours. re-read it. it probably won\'t feel right.', dark: false },
    { when: 'today', title: 'file for unemployment', body: 'do it today not tomorrow. the money takes time to kick in.', dark: false },
    { when: 'this week', title: 'your severance is negotiable', body: 'most people don\'t know this. you can ask for more. you have nothing to lose.', dark: false },
    { when: 'always', title: 'put your phone down', body: 'doomscrolling is not helping.', dark: false },
    { when: 'ongoing', title: 'you are not your job title', body: 'you were a person before this job. you will be a person after. the algorithm lied.', dark: true },
  ]

  return (
    <div id="what-now" style={{ background: 'var(--bg)', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 12 }}>survival guide · 05</p>
        <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 10 }}>what now.<br />honestly.</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.6, maxWidth: 500, marginBottom: 32 }}>not career advice. the actual things worth doing.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {cards.map((c) => (
            <div key={c.when} style={{ background: c.dark ? 'var(--black)' : 'white', borderRadius: 8, padding: 18, border: c.dark ? '1px solid var(--black)' : '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: c.dark ? 'var(--yellow)' : 'var(--orange)', letterSpacing: '-0.5px', display: 'block', marginBottom: 8 }}>{c.when}</span>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 5, color: c.dark ? 'white' : 'var(--black)' }}>{c.title}</div>
              <div style={{ fontSize: 12, color: c.dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>{c.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
