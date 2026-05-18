'use client'
import { useEffect, useState } from 'react'

type LayoffEvent = {
  id: string
  company: string
  num_laid_off: number | null
  date: string
  industry: string | null
  notes: string | null
}

const FALLBACK: LayoffEvent[] = [
  { id: '1', company: 'Volkswagen Group', num_laid_off: 50000, date: '2026-03-01', industry: 'Automotive', notes: 'Shift to EV and cost restructuring across all divisions.' },
  { id: '2', company: 'Oracle',           num_laid_off: 30000, date: '2026-03-15', industry: 'Enterprise Software', notes: 'Shift to AI-driven automation across business units.' },
  { id: '3', company: 'UPS',              num_laid_off: 20000, date: '2026-01-15', industry: 'Logistics', notes: 'AI-driven automation replacing package sorting and routing roles.' },
  { id: '4', company: 'Meta',             num_laid_off: 16000, date: '2026-03-01', industry: 'Social Media', notes: 'Second round of cuts targeting middle management.' },
  { id: '5', company: 'Amazon',           num_laid_off: 16000, date: '2026-01-20', industry: 'E-commerce / Cloud', notes: 'Q1 restructuring across AWS and retail divisions.' },
  { id: '6', company: 'Intel',            num_laid_off: 15000, date: '2026-01-10', industry: 'Semiconductors', notes: 'Major reorganization following product delays and market share loss.' },
  { id: '7', company: 'Dell',             num_laid_off: 11000, date: '2026-03-10', industry: 'Hardware / Cloud', notes: 'AI-driven automation replacing hardware support and sales roles.' },
  { id: '8', company: 'Salesforce',       num_laid_off: 8000,  date: '2026-01-10', industry: 'CRM / SaaS', notes: 'Continued restructuring following 2023–2024 cuts.' },
]

const SUMMARY_STATS = [
  { label: '2026 total',  value: '414,000+', sub: 'jobs cut so far',             color: 'var(--orange)' },
  { label: 'companies',   value: '150+',      sub: 'tracked in 2026',             color: 'white'         },
  { label: 'per day',     value: '3,900+',    sub: 'jobs lost on average',        color: 'var(--yellow)' },
  { label: 'ai-driven',   value: '64%',       sub: 'of Q1 2026 cuts linked to AI', color: '#85B7EB'      },
]

export default function StatsSection() {
  const [layoffs, setLayoffs] = useState<LayoffEvent[]>(FALLBACK)

  useEffect(() => {
    fetch('/api/layoffs')
      .then(r => r.json())
      .then((d: LayoffEvent[]) => { if (Array.isArray(d) && d.length > 0) setLayoffs(d) })
      .catch(() => {})
  }, [])

  return (
    <div id="tracker" style={{ background: 'var(--black)', borderTop: '3px solid var(--orange)' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 40px' }}>

        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>
          layoff tracker · live data
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
          <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'white', marginBottom: 0 }}>
            the scale of<br />this is real.
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 280, textAlign: 'right' }}>
            these are not anomalies. this is a structural shift happening across every industry, all at once.
          </p>
        </div>

        {/* ── Stat boxes ─────────────────────────────────────────────────── */}
        <div className="tracker-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
          {SUMMARY_STATS.map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '18px 20px' }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, letterSpacing: '-1px', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tracker table ──────────────────────────────────────────────── */}
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
          recent layoffs
        </div>
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
          {/* Header */}
          <div className="tracker-row-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['company', 'people cut', 'industry', 'date'].map(h => (
              <div key={h} style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>{h}</div>
            ))}
          </div>
          {/* Rows */}
          {layoffs.slice(0, 10).map((event, i) => (
            <div
              key={event.id}
              className="tracker-row-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr 1fr',
                padding: '14px 16px',
                borderBottom: i < Math.min(layoffs.length - 1, 9) ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{event.company}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange)' }}>
                {event.num_laid_off ? event.num_laid_off.toLocaleString() : '—'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Courier Prime', monospace" }}>
                {event.industry || '—'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'Courier Prime', monospace" }}>
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
