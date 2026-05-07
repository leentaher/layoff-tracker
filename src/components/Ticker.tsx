'use client'

const items = [
  '332,000+ WORKERS LAID OFF IN 2026',
  'META · 16,000 · MAR 2026',
  'ORACLE · 30,000 · MAR 2026',
  'AMAZON · 30,000 · Q1 2026',
  '82% OF TECH CUTS ATTRIBUTED TO AI',
  '3,400+ JOBS LOST PER DAY',
  'YOU ARE NOT ALONE · JUICEBOKX.COM',
]

export default function Ticker() {
  const doubled = [...items, ...items]
  return (
    <div style={{ background: 'var(--orange)', color: '#fff', fontFamily: "'Courier Prime', monospace", fontSize: 11, padding: '7px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div style={{ display: 'inline-block', animation: 'ticker 35s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ margin: '0 40px' }}>{item}</span>
        ))}
      </div>
    </div>
  )
}
