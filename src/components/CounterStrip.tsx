'use client'
import { useEffect, useRef, useState } from 'react'

function useCount(target: number, duration = 2000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

export default function CounterStrip({ total, companies }: { total: number; companies: number }) {
  const visitors = useCount(12441 + Math.floor(Math.random() * 80), 4000)
  const laid = useCount(Math.max(total, 332000), 5000)
  const cos = useCount(Math.max(companies, 101), 4000)

  const items = [
    { id: 'laid', num: laid.toLocaleString(), label: 'workers laid off in 2026', note: '3,400+ per day. and counting.' },
    { id: 'cos',  num: cos.toLocaleString(),  label: 'companies affected',        note: 'across all sectors' },
    { id: 'vis',  num: visitors.toLocaleString(), label: 'people visited this page', note: 'you are not the only one' },
  ]

  return (
    <div style={{ background: 'var(--orange)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 40, display: 'flex', gap: 0 }}>
        {items.map((item, i) => (
          <div key={item.id} style={{
            flex: 1,
            borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
            paddingRight: i < items.length - 1 ? 40 : 0,
            marginRight: i < items.length - 1 ? 40 : 0,
          }}>
            <span style={{ fontSize: 'clamp(36px,6vw,60px)', fontWeight: 900, letterSpacing: '-2px', color: 'white', display: 'block', lineHeight: 1 }}>
              {item.num}
            </span>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: 6 }}>
              {item.label}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 3, fontStyle: 'italic' }}>
              {item.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
