'use client'

const items = [
  'ORACLE · 30,000 · MAR 2026',
  'META · 16,000 · FEB 2026',
  'AMAZON · 30,000 · Q1 2026',
  'INTEL · 15,000 · JAN 2026',
  '414,000+ WORKERS LAID OFF IN 2026',
  '64% OF Q1 CUTS LINKED TO AI',
  '3,900+ JOBS LOST PER DAY',
  'YOU ARE NOT ALONE',
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
