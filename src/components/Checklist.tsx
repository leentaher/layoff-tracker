'use client'
import { useState } from 'react'

const laidOffGroups = [
  { title: 'right now', items: [
    'take a breath. seriously.',
    'screenshot your offer letter and severance terms',
    'save copies of work you\'re proud of',
    'don\'t send that email. just don\'t.',
  ]},
  { title: 'today', items: [
    'file for unemployment. takes time to kick in',
    'review severance before signing',
    'check COBRA / healthcare options',
    'tell 3 people you trust. not on LinkedIn.',
  ]},
  { title: 'this week', items: [
    'negotiate your severance. you can ask for more',
    'update resume quietly, not publicly',
    'reach out to network before posting publicly',
    'do one thing offline. juicebokx.com.',
  ]},
  { title: 'do not do yet', items: [
    'post on LinkedIn about it',
    'make any major financial decisions',
    'accept the first offer you get',
    'decide what you want to do next',
  ]},
]

const mightBeNextGroups = [
  { title: 'right now', items: [
    'screenshot your employment contract',
    'save work you\'re proud of. now, not later.',
    'document your wins and contributions',
    'know your notice period and severance policy',
  ]},
  { title: 'this week', items: [
    'build your emergency fund. 3 to 6 months minimum',
    'quietly update your resume',
    'strengthen relationships before you need them',
    'know exactly what you\'d do if it happened tomorrow',
  ]},
  { title: 'be ready', items: [
    'don\'t sign anything in the room. take 24hrs.',
    'know your COBRA options in advance',
    'have 3 people on speed dial (not LinkedIn)',
    'get clarity on equity and vesting schedule',
  ]},
  { title: 'do not do yet', items: [
    'panic. most people survive this.',
    'quit before you\'re pushed',
    'tell your manager you\'re looking',
    'make any major financial commitments',
  ]},
]

export default function Checklist() {
  const [mode, setMode] = useState<'laid-off' | 'might-be-next'>('laid-off')
  const [done, setDone] = useState<Set<string>>(new Set())

  const groups = mode === 'laid-off' ? laidOffGroups : mightBeNextGroups
  const allItems = groups.flatMap(g => g.items)
  const doneCount = allItems.filter(i => done.has(i)).length

  function toggle(item: string) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  function switchMode(next: 'laid-off' | 'might-be-next') {
    setMode(next)
    setDone(new Set())
  }

  return (
    <div id="checklist" style={{ background: 'var(--black)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>tool · 04</p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, color: 'white', marginBottom: 10 }}>the 48hr<br />checklist.</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', maxWidth: 500, marginBottom: 28 }}>interactive. checkable. do these before anything else.</p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', borderRadius: 100, padding: 4, marginBottom: 32, gap: 4 }}>
          {([
            { key: 'laid-off', label: 'i just got laid off' },
            { key: 'might-be-next', label: 'i might be next' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              style={{
                padding: '9px 20px',
                borderRadius: 100,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Work Sans', sans-serif",
                transition: 'all 0.2s',
                background: mode === key ? 'white' : 'transparent',
                color: mode === key ? 'var(--black)' : 'rgba(255,255,255,0.4)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

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
