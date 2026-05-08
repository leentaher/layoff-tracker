'use client'

const SAMPLE_MSGS = [
  { user: 'exhausted_pm_19',       color: '#c0392b', text: 'hi',                                          time: '07:49 PM' },
  { user: 'ghosted_again_64',      color: '#c0392b', text: "hi im worried someone's going to lay me off", time: '08:04 PM' },
  { user: 'jobless_in_sf_47',      color: '#c0392b', text: 'hey im confused',                             time: '08:04 PM' },
  { user: 'ghosted_again_64',      color: '#c0392b', text: 'hi leen',                                     time: '08:05 PM' },
  { user: 'day_12_still_weird_22', color: '#8b1a1a', text: 'anyone else just sitting here refreshing linkedin?', time: '09:21 PM' },
]

export default function WaitingRoom() {
  function openChat() {
    window.dispatchEvent(new CustomEvent('open-chat'))
    // scroll to bottom so the chat window is visible
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100)
  }

  return (
    <div style={{ background: 'var(--black)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 40px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Left — copy */}
          <div>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>live · right now</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, color: 'white', marginBottom: 16 }}>
              the waiting<br />room is open.
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginBottom: 28, maxWidth: 360 }}>
              anonymous. no account. just a room full of people going through the same thing. say hi. or just lurk. both are fine.
            </p>
            <button
              onClick={openChat}
              style={{
                background: 'var(--orange)', color: 'white', border: 'none',
                borderRadius: 8, padding: '14px 28px',
                fontWeight: 800, fontSize: 14, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>💬</span> join the waiting room
            </button>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 14, letterSpacing: '0.08em' }}>
              no login · anonymous · real people
            </p>
          </div>

          {/* Right — messenger preview */}
          <div style={{
            fontFamily: 'Tahoma, Arial, sans-serif',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            border: '3px solid #0a246a',
            borderRadius: 6,
            overflow: 'hidden',
            userSelect: 'none',
          }}>
            {/* Title bar */}
            <div style={{ background: 'linear-gradient(180deg,#0a246a 0%,#3a6ea5 100%)', padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12 }}>💬</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 11 }}>juicebokx messenger</span>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {['_','□','×'].map((c,i) => (
                  <div key={i} style={{ width: 16, height: 16, background: i===2 ? '#c0392b' : '#3a8fde', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu */}
            <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', padding: '2px 8px', display: 'flex', gap: 16 }}>
              {['File','View','Actions','Help'].map(m => (
                <span key={m} style={{ fontSize: 10, color: '#000' }}>{m}</span>
              ))}
            </div>

            {/* User bar */}
            <div style={{ background: '#d9e8fb', borderBottom: '1px solid #b3cce8', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f0a500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, border: '2px solid #0a246a', flexShrink: 0 }}>😶</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 10, color: '#0a246a' }}>exhausted_pm_27</div>
                <div style={{ fontSize: 9, color: '#555' }}>waiting for recruiter to reply 🪄</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
                <span style={{ fontSize: 9, color: '#333' }}>online</span>
              </div>
            </div>

            {/* Room label */}
            <div style={{ background: '#c5d9f1', borderBottom: '1px solid #b3cce8', padding: '3px 10px' }}>
              <span style={{ fontSize: 10, color: '#0a246a', fontWeight: 700 }}>▼ the waiting room (10)</span>
            </div>

            {/* Messages */}
            <div style={{ background: 'white', padding: '8px 10px', minHeight: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SAMPLE_MSGS.map((m, i) => (
                <div key={i} style={{ fontSize: 11, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: m.color }}>{m.user} says:</span>
                  <span style={{ fontSize: 9, color: '#999', marginLeft: 5 }}>({m.time})</span>
                  <div style={{ color: '#111', paddingLeft: 2 }}>{m.text}</div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div style={{ background: '#ece9d8', borderTop: '1px solid #aca899', padding: '6px 8px', display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, border: '1px solid #7f9db9', borderRadius: 2, padding: '5px 8px', background: 'white', fontSize: 11, color: '#999' }}>
                type a message...
              </div>
              <div style={{ background: 'linear-gradient(180deg,#0a246a 0%,#3a6ea5 100%)', color: 'white', borderRadius: 3, padding: '5px 12px', fontSize: 10, fontWeight: 700 }}>
                Send
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
