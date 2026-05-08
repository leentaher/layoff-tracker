export default function AboutJuicebokx() {
  return (
    <div style={{ background: 'var(--yellow)', borderTop: '3px solid var(--black)' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>
          the people behind this
        </p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'var(--black)', marginBottom: 20 }}>
          what's juicebokx?
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(0,0,0,0.7)', maxWidth: 620, marginBottom: 32 }}>
          we started by making something you hold with your hands. then we noticed how many people needed help navigating what's happening right now. so we built this. the directory is free. what comes next is at juicebokx.com.
        </p>
        <a
          href="https://juicebokx.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--black)', color: 'white',
            borderRadius: 8, padding: '14px 28px',
            fontWeight: 800, fontSize: 14, textDecoration: 'none',
            letterSpacing: '-0.3px',
          }}
        >
          visit juicebokx.com →
        </a>
      </div>
    </div>
  )
}
