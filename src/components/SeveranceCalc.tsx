'use client'
import { useState } from 'react'

export default function SeveranceCalc() {
  const [years, setYears] = useState('')
  const [level, setLevel] = useState('')
  const [size, setSize] = useState('')
  const [result, setResult] = useState<{ weeks: string; label: string; text: string; script: string } | null>(null)

  function calc() {
    const y = parseFloat(years) || 1
    const multipliers: Record<string, number> = { startup: 1, mid: 1.5, large: 2, faang: 3 }
    const levelBonus: Record<string, number> = { ic: 0, senior: 2, manager: 4, vp: 8 }
    const base = Math.round(y * (multipliers[size] || 1.5) + (levelBonus[level] || 0))
    const weeks = Math.max(base, 2)

    const scripts: Record<string, string> = {
      startup: `"I appreciate the offer. Given my ${y} years here and the transition ahead, I'd like to discuss extending to ${weeks + 2} weeks. I want to help with a smooth handoff and this would let me do that without the immediate pressure."`,
      mid: `"Thank you for the package. I've reviewed it and would like to request ${weeks + 3} weeks given my tenure and the market conditions. I believe this is fair and consistent with industry standards."`,
      large: `"I've spoken with an employment attorney and I believe ${weeks + 4} weeks better reflects my ${y} years of contribution. I'd like to request that adjustment before I sign."`,
      faang: `"I understand the package follows standard policy. Given my tenure of ${y} years at the ${level} level, I'd like to formally request a review for ${weeks + 6} weeks. I'm happy to work with HR directly."`,
    }

    setResult({
      weeks: `${weeks}–${weeks + (multipliers[size] > 2 ? 6 : 3)} weeks`,
      label: 'industry benchmark severance',
      text: `Based on ${y} year${y !== 1 ? 's' : ''} at a ${size || 'mid-size'} company at the ${level || 'IC'} level, the typical severance range is ${weeks} to ${weeks + 4} weeks. Most people accept the first offer. You don't have to.`,
      script: scripts[size] || scripts.mid,
    })
  }

  const inputStyle = { width: '100%', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 6, padding: '10px 12px', fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: 'var(--black)', background: 'var(--bg)', outline: 'none' }
  const labelStyle = { display: 'block', fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.3)', marginBottom: 5 }

  return (
    <div id="severance" style={{ background: 'var(--yellow)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 12 }}>tool · 02</p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, marginBottom: 10 }}>is your severance fair?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(0,0,0,0.55)', maxWidth: 560, marginBottom: 32 }}>most people don't negotiate. most people should. enter your details. get a benchmark and a script.</p>

        <div style={{ background: 'white', borderRadius: 8, padding: 22 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><label style={labelStyle}>years at company</label><input type="number" style={inputStyle} placeholder="3" min={0} max={30} value={years} onChange={e => setYears(e.target.value)} /></div>
            <div>
              <label style={labelStyle}>level</label>
              <select style={inputStyle} value={level} onChange={e => setLevel(e.target.value)}>
                <option value="">select...</option>
                <option value="ic">individual contributor</option>
                <option value="senior">senior / staff</option>
                <option value="manager">manager / director</option>
                <option value="vp">VP / executive</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>company size</label>
              <select style={inputStyle} value={size} onChange={e => setSize(e.target.value)}>
                <option value="">select...</option>
                <option value="startup">startup (&lt;200)</option>
                <option value="mid">mid-size (200–2000)</option>
                <option value="large">large (2000–20000)</option>
                <option value="faang">FAANG / big tech</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fff5f2', borderLeft: '3px solid var(--orange)', borderRadius: 4, fontSize: 12, fontFamily: "'Courier Prime', monospace", color: 'rgba(0,0,0,0.55)' }}>
            <strong>severance is negotiable.</strong> most people don't know that. run the numbers first.
          </div>
          <button onClick={calc} style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%' }}>
            calculate
          </button>

          {result && (
            <div style={{ marginTop: 18, padding: 18, background: 'var(--bg)', borderRadius: 6, animation: 'fadeUp 0.3s ease' }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: 'var(--orange)', letterSpacing: '-2px', display: 'block', lineHeight: 1, marginBottom: 4 }}>{result.weeks}</span>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>{result.label}</span>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', marginBottom: 12 }}>{result.text}</div>
              <div style={{ background: 'white', borderRadius: 6, padding: 14, borderLeft: '3px solid var(--orange)', fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: 1.65, fontStyle: 'italic' }}>
                {result.script}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
