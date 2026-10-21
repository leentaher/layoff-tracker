'use client'

export default function NCMission() {
  const plans = [
    {
      tag: 'mission for america',
      title: 'the break-glass plan',
      desc: 'a sector-by-sector economic plan. built for the scale of disruption we\'re actually facing.',
      link: 'https://www.newconsensus.com/read',
      cta: 'read it →',
    },
    {
      tag: 'crashlab',
      title: 'the AI bubble',
      desc: 'tracking the financial dynamics behind the AI investment wave. what happens if it unwinds.',
      link: 'https://crashlab.org/',
      cta: 'explore →',
    },
    {
      tag: 'bigsim',
      title: 'modeling mass AI layoffs',
      desc: 'an economic simulator that models what mass displacement actually looks like at scale. so policymakers can see it before it arrives.',
      link: 'https://sim.newconsensus.ai',
      cta: 'explore →',
    },
  ]

  return (
    <div id="activate" style={{ background: '#0D1B3E', borderTop: '3px solid #85B7EB' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>

        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>
          new consensus
        </p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'white', marginBottom: 12 }}>
          the policy response to this<br />has to come from people<br />who actually lived it.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', maxWidth: 560, marginBottom: 48 }}>
          new consensus is building the economic frameworks governments will need as AI reshapes work. they want input from people on the inside. not just analysts on the outside.
        </p>

        {/* ── Plan cards ──────────────────────────────────────────────────── */}
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
          {plans.map(card => (
            <a
              key={card.tag}
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '24px 20px',
                textDecoration: 'none',
                display: 'block',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
            >
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#85B7EB', marginBottom: 10 }}>
                {card.tag}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: 10, lineHeight: 1.2 }}>
                {card.title}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 16 }}>
                {card.desc}
              </p>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#85B7EB' }}>{card.cta}</span>
            </a>
          ))}
        </div>

        {/* ── Serve block ──────────────────────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.2 }}>
              want a seat at the table?
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
              if you've been displaced and have something to say about what comes next, new consensus wants to hear from you. this is how policy gets built by the people it's supposed to serve.
            </p>
          </div>
          <a
            href="https://www.newconsensus.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'var(--yellow)', color: 'var(--black)', borderRadius: 8, padding: '12px 24px', fontWeight: 800, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}
          >
            get involved →
          </a>
        </div>

      </div>
    </div>
  )
}
