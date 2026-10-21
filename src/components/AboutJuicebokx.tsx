export default function AboutJuicebokx() {
  return (
    <div style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>

        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 32 }}>
          about the collaboration
        </p>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* ── Juicebokx ─────────────────────────────────────────────────── */}
          <div style={{ background: 'var(--yellow)', borderRadius: 12, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', marginBottom: 12 }}>
              juicebokx
            </p>
            <h3 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', color: 'var(--black)', lineHeight: 1.0, marginBottom: 16 }}>
              what's juicebokx?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(0,0,0,0.7)', marginBottom: 28, flex: 1 }}>
              we make analog things for the moments when screens aren't enough. then the layoffs hit people we knew, so we built this. everything here is free.
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
          <div style={{ background: '#0D1B3E', borderRadius: 12, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              new consensus
            </p>
            <h3 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', color: 'white', lineHeight: 1.0, marginBottom: 16 }}>
              what's new consensus?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.6)', marginBottom: 28, flex: 1 }}>
              a think tank from the people behind the Green New Deal. now they're working on the economic policy response to AI displacement: the frameworks and plans governments will need as this wave keeps building.
            </p>
            <a
              href="https://www.newconsensus.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1A4DB5', color: 'white', borderRadius: 8, padding: '12px 24px', fontWeight: 800, fontSize: 13, textDecoration: 'none', letterSpacing: '-0.3px' }}
            >
              visit new consensus →
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
