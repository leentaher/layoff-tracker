'use client'
import { useState } from 'react'

const groups = [
  { title: 'first 24 hours', items: ['read your severance agreement fully', 'do not sign anything yet', 'file for unemployment today', 'save all your work contacts', ] },
  { title: 'this week', items: ['update your LinkedIn (you don\'t have to announce)', 'text 3 people you trust', 'understand your health insurance timeline', 'calculate your runway'] },
  { title: 'this month', items: ['reach out to your network — just to reconnect', 'pick 2-3 target companies, not 20', 'get your resume reviewed by a human', 'negotiate your severance if you haven\'t'] },
  { title: 'when you\'re ready', items: ['decide what you actually want to do next', 'don\'t accept the first offer out of fear', 'take one day completely off from job hunting', 'accept that this takes longer than it should'] },
]

export default function Checklist() {
  const [done, setDone] = useState<Set<string>>(new Set())

  const allItems = groups.flatMap(g => g.items)
  const doneCount = done.size

  function toggle(item: string) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  return (
    <div id="checklist" style={{ background: 'var(--black)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>tool · 03</p>
        <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'white', marginBottom: 10 }}>what to actually do.</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', maxWidth: 500, marginBottom: 32 }}>not a productivity framework. the things that actually matter when this happens to you.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {groups.map((group) => (
            <div key={group.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 18 }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
                {group.title}
              </div>
              {group.items.map((item) => (
                <div
                  key={item}
                  onClick={() => toggle(item)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 3, border: done.has(item) ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                    background: done.has(item) ? 'var(--yellow)' : 'transparent',
                    flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s'
                  }}>
                    {done.has(item) && <span style={{ fontSize: 10, color: 'var(--black)', fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, color: done.has(item) ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.65)', lineHeight: 1.5, textDecoration: done.has(item) ? 'line-through' : 'none', transition: 'all 0.15s' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(255,255,255,0.25)', marginBottom: 7 }}>
            <span>{doneCount} of {allItems.length} done</span>
            <span>take your time.</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--yellow)', borderRadius: 2, width: `${(doneCount / allItems.length) * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
