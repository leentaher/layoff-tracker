'use client'
import { useState } from 'react'

type LayoffEvent = { id: string; company: string; num_laid_off: number | null; date: string; industry: string | null; notes: string | null }

const FALLBACK: LayoffEvent[] = [
  { id: '1', company: 'Oracle',     num_laid_off: 30000, date: '2026-03-15', industry: 'Enterprise Software',  notes: 'Shift to AI-driven automation across business units.' },
  { id: '2', company: 'Amazon',     num_laid_off: 30000, date: '2026-02-20', industry: 'E-commerce / Cloud',   notes: 'Q1 restructuring across AWS and retail divisions.' },
  { id: '3', company: 'Meta',       num_laid_off: 16000, date: '2026-03-01', industry: 'Social Media',         notes: 'Second round of cuts targeting middle management.' },
  { id: '4', company: 'Salesforce', num_laid_off: 8000,  date: '2026-01-10', industry: 'CRM / SaaS',           notes: 'Continued restructuring following 2023–2024 cuts.' },
  { id: '5', company: 'Microsoft',  num_laid_off: 6000,  date: '2025-11-05', industry: 'Enterprise Software',  notes: 'Gaming and Azure divisions most affected.' },
]

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [layoffs, setLayoffs] = useState<LayoffEvent[]>([])
  const [loaded, setLoaded] = useState(false)

  function openTimeline() {
    setDrawerOpen(true)
    if (!loaded) {
      fetch('/api/layoffs')
        .then(r => r.json())
        .then((d: LayoffEvent[]) => { setLayoffs(Array.isArray(d) && d.length > 0 ? d : FALLBACK) })
        .catch(() => setLayoffs(FALLBACK))
        .finally(() => setLoaded(true))
    }
  }

  const data = loaded ? layoffs : FALLBACK

  return (
    <>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 40px', background: 'var(--bg)', position: 'sticky',
        top: 0, zIndex: 100, borderBottom: '1.5px solid rgba(0,0,0,0.08)'
      }}>
        <a href="https://directory.juicebokx.com" style={{ textDecoration: 'none', lineHeight: 1.2 }}>
          <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-1px', color: 'var(--black)' }}>Directory</div>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(0,0,0,0.4)', textTransform: 'lowercase' }}>by juicebokx</div>
        </a>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {[
            ['#what-now',   'what now'],
            ['#severance',  'severance'],
            ['#checklist',  'checklist'],
          ].map(([href, label]) => (
            <li key={href} className="nav-link-item">
              <a href={href} style={{ fontSize: 12, fontWeight: 600, color: 'var(--black)', textDecoration: 'none', opacity: 0.55 }}>
                {label}
              </a>
            </li>
          ))}
          <li className="nav-link-item">
            <button
              onClick={openTimeline}
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--black)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.55, padding: 0 }}
            >
              timeline
            </button>
          </li>
          <li>
            <a href="#community" style={{
              background: 'var(--orange)', color: '#fff', padding: '7px 16px',
              borderRadius: 6, fontWeight: 700, fontSize: 12, textDecoration: 'none'
            }}>
              join the directory
            </a>
          </li>
        </ul>
      </nav>

      {/* Timeline drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(2px)' }}
          />

          {/* Panel */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 520,
            background: '#111', zIndex: 201, overflowY: 'auto',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Panel header */}
            <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#111', zIndex: 1 }}>
              <div>
                <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>history</p>
                <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-1px', color: 'white', lineHeight: 1 }}>this has been happening for years.</h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >×</button>
            </div>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, padding: '16px 32px 8px' }}>
              you are not uniquely failing. the industry has been doing this to people for years.
            </p>

            {/* Events */}
            <div style={{ padding: '0 32px 40px' }}>
              {data.map((event) => (
                <div key={event.id} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '0.5px solid rgba(255,255,255,0.07)', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', marginTop: 7, flexShrink: 0 }} />
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', minWidth: 60, marginTop: 5 }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: 'white', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {event.company}
                      {event.num_laid_off && (
                        <span style={{ background: 'var(--orange)', color: 'white', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                          {event.num_laid_off.toLocaleString()} laid off
                        </span>
                      )}
                    </div>
                    {event.industry && <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{event.industry}</div>}
                    {event.notes && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{event.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
