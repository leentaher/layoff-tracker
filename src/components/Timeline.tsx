type LayoffEvent = {
  id: string
  company: string
  num_laid_off: number | null
  date: string
  industry: string | null
  notes: string | null
}

export default function Timeline({ layoffs }: { layoffs: LayoffEvent[] }) {
  // Fallback static data if DB is empty
  const fallback: LayoffEvent[] = [
    { id: '1', company: 'Oracle', num_laid_off: 30000, date: '2026-03-15', industry: 'Enterprise Software', notes: 'Shift to AI-driven automation across business units.' },
    { id: '2', company: 'Amazon', num_laid_off: 30000, date: '2026-02-20', industry: 'E-commerce / Cloud', notes: 'Q1 restructuring across AWS and retail divisions.' },
    { id: '3', company: 'Meta', num_laid_off: 16000, date: '2026-03-01', industry: 'Social Media', notes: 'Second round of cuts targeting middle management.' },
    { id: '4', company: 'Salesforce', num_laid_off: 8000, date: '2026-01-10', industry: 'CRM / SaaS', notes: 'Continued restructuring following 2023–2024 cuts.' },
    { id: '5', company: 'Microsoft', num_laid_off: 6000, date: '2025-11-05', industry: 'Enterprise Software', notes: 'Gaming and Azure divisions most affected.' },
  ]

  const data = layoffs.length > 0 ? layoffs : fallback

  return (
    <div id="timeline" style={{ background: 'var(--black)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>history · 06</p>
        <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'white', marginBottom: 10 }}>this has been<br />happening for years.</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', maxWidth: 500, marginBottom: 32 }}>you are not uniquely failing. the industry is doing this to people.</p>

        {data.map((event) => (
          <div key={event.id} style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: '0.5px solid rgba(255,255,255,0.07)', alignItems: 'flex-start' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--orange)', marginTop: 6, flexShrink: 0 }} />
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', minWidth: 70, marginTop: 4 }}>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: 'white', marginBottom: 5 }}>
                {event.company}
                {event.num_laid_off && (
                  <span style={{ display: 'inline-block', background: 'var(--orange)', color: 'white', fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 4, marginLeft: 8, verticalAlign: 'middle' }}>
                    {event.num_laid_off.toLocaleString()}
                  </span>
                )}
              </div>
              {event.notes && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic' }}>{event.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
