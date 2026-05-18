export default function Hero() {
  return (
    <div className="section-inner" style={{ padding: '80px 40px 60px', maxWidth: 900, margin: '0 auto' }}>
      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 20 }}>
        navigate · by juicebokx × new consensus · 2026
      </p>
      <h1 style={{ fontSize: 'clamp(52px, 10vw, 96px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-3px', marginBottom: 20 }}>
        worried you're<br />next?
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.65, opacity: 0.6, maxWidth: 520, marginBottom: 32 }}>
        414,000 people have been laid off in 2026. if you're trying to understand what's happening, covering your role, your industry, and your options, this is a place to start.
      </p>
      <a
        href="#tools"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'var(--orange)', color: 'white',
          borderRadius: 8, padding: '14px 24px',
          fontWeight: 800, fontSize: 15, textDecoration: 'none',
          letterSpacing: '-0.3px',
        }}
      >
        check my role →
      </a>
    </div>
  )
}
