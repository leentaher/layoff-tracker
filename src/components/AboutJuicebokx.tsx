export default function AboutJuicebokx() {
  return (
    <div style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>

        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 32 }}>
          about the collaboration
        </p>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* ── Juicebokx ─────────────────────────────────────────────────── */}
          <div style={{ background: 'var(--yellow)', borderRadius: 12, padding: '36px 32px' }}>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', marginBottom: 12 }}>
              juicebokx
            </p>
            <h3 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', color: 'var(--black)', lineHeight: 1.0, marginBottom: 16 }}>
              what's juicebokx?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(0,0,0,0.7)', marginBottom: 28 }}>
              we started by making something you hold with your hands. then we noticed how many people needed help navigating what's happening right now. so we built this. the directory is free. what comes next is at juicebokx.com.
            </p>
            <a
              href="https://juicebokx.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--black)', color: 'white', borderRadius: 8, padding: '12px 24px', fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '-0.3px' }}
            >
              visit juicebokx.com →
            </a>
          </div>

          {/* ── New Consensus ──────────────────────────────────────────────── */}
          <div style={{ background: '#0D1B3E', borderRadius: 12, padding: '36px 32px' }}>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              new consensus
            </p>
            <h3 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', color: 'white', lineHeight: 1.0, marginBottom: 16 }}>
              what's new consensus?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', marginBottom: 28 }}>
              a think tank writing the economic policy the next president will need on day one. the people losing jobs to AI are exactly who should build what comes next. new consensus is how that happens.
            </p>
            <a
              href="https://www.newconsensus.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1A4DB5', color: 'white', borderRadius: 8, padding: '12px 24px', fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '-0.3px' }}
            >
              visit newconsensus.com →
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
