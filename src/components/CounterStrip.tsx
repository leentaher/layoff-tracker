'use client'
import { useEffect, useState } from 'react'
import FlipCounter from './FlipCounter'

export default function CounterStrip({ total, companies }: { total: number; companies: number }) {
  const laid = Math.max(total, 332000)
  const cos = Math.max(companies, 101)
  const [visitors, setVisitors] = useState(12441)

  useEffect(() => {
    fetch('/api/visits', { method: 'POST' })
      .then(r => r.json())
      .then(d => { if (d.count) setVisitors(d.count) })
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: 'var(--orange)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 40, display: 'flex', gap: 0, alignItems: 'flex-start' }}>

        {/* Laid off */}
        <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: 40, marginRight: 40 }}>
          <span style={{ fontSize: 'clamp(36px,6vw,60px)', fontWeight: 900, letterSpacing: '-2px', color: 'white', display: 'block', lineHeight: 1 }}>
            {laid.toLocaleString()}
          </span>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: 6 }}>
            workers laid off in 2026
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 3, fontStyle: 'italic' }}>
            3,400+ per day. and counting.
          </span>
        </div>

        {/* Companies */}
        <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: 40, marginRight: 40 }}>
          <span style={{ fontSize: 'clamp(36px,6vw,60px)', fontWeight: 900, letterSpacing: '-2px', color: 'white', display: 'block', lineHeight: 1 }}>
            {cos.toLocaleString()}
          </span>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: 6 }}>
            companies affected
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 3, fontStyle: 'italic' }}>
            across all sectors
          </span>
        </div>

        {/* Visitors — flip clock */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 6 }}>
            <FlipCounter value={visitors} />
          </div>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: 6 }}>
            people visited this page
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 3, fontStyle: 'italic' }}>
            you are not the only one
          </span>
        </div>

      </div>
    </div>
  )
}
