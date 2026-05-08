'use client'
import { useState } from 'react'

const responses = [
  { verdict: "honestly? the signs are there.", text: "Companies in your sector have been cutting <strong>{dept}</strong> roles at roughly 18% over the last 6 months. <strong>{tenure}</strong> of tenure offers some protection — but less than it used to. <strong>{company}</strong> has made cuts before and the macro environment suggests they're not done. Update your resume this week. Not because panic is useful. Because control is." },
  { verdict: "you're probably safer than you think.", text: "Recent waves at companies like <strong>{company}</strong> targeted middle management and redundant roles. <strong>{dept}</strong> teams at your tenure tend to get retained. Nobody is truly safe right now but your profile isn't the highest risk. Keep your network warm." },
  { verdict: "we genuinely don't know. and neither does anyone else.", text: "Here's the honest answer: <strong>{company}</strong> hasn't announced anything publicly, <strong>{dept}</strong> cuts have been inconsistent across the industry, and <strong>{tenure}</strong> of tenure is neither a shield nor a target. The uncertainty is real and it's designed to keep you anxious. You're not imagining it." },
  { verdict: "the data is not comforting.", text: "<strong>{company}</strong>'s sector has been hit harder than most. <strong>{dept}</strong> roles are among the most affected in the current cycle. Have the conversation you've been avoiding. Update the resume. Put your phone down for 20 minutes." },
]

export default function AmINext() {
  const [company, setCompany] = useState('')
  const [dept, setDept] = useState('')
  const [tenure, setTenure] = useState('')
  const [result, setResult] = useState<{ verdict: string; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  function analyze() {
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const r = responses[Math.floor(Math.random() * responses.length)]
      const co = company || 'your company'
      const dp = dept || 'your department'
      const tn = tenure || 'your tenure'
      setResult({
        verdict: r.verdict,
        text: r.text.replace(/{company}/g, co).replace(/{dept}/g, dp).replace(/{tenure}/g, tn),
      })
      setLoading(false)
    }, 1600)
  }

  const field = { label: { display: 'block', fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }, input: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '12px 14px', fontFamily: "'Work Sans', sans-serif", fontSize: 13, color: 'white', outline: 'none' } }

  return (
    <div id="am-i-next" style={{ background: 'var(--black)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '50px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>tool · 01</p>
        <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'white', marginBottom: 10 }}>am i next?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', maxWidth: 500, marginBottom: 32 }}>
          we can't tell you for sure. nobody can. but we can tell you what the data says about your situation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={field.label}>company name</label>
            <input style={field.input} placeholder="e.g. Salesforce" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div>
            <label style={field.label}>your department</label>
            <input style={field.input} placeholder="e.g. Engineering" value={dept} onChange={e => setDept(e.target.value)} />
          </div>
          <div>
            <label style={field.label}>years at company</label>
            <select style={field.input} value={tenure} onChange={e => setTenure(e.target.value)}>
              <option value="">select...</option>
              <option value="under 1 year">under 1 year</option>
              <option value="1–2 years">1–2 years</option>
              <option value="3–5 years">3–5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>

        <button
          onClick={analyze}
          disabled={loading}
          style={{ background: 'var(--yellow)', color: 'var(--black)', border: 'none', borderRadius: 6, padding: '13px 0', fontWeight: 800, fontSize: 14, cursor: 'pointer', width: '100%', marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'analyzing...' : 'analyze my risk'}
        </button>

        {result && (
          <div style={{ marginTop: 20, padding: 24, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 8, animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--yellow)', marginBottom: 12 }}>{result.verdict}</div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }} dangerouslySetInnerHTML={{ __html: result.text }} />
            <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 14, lineHeight: 1.6 }}>
              this is not a prediction. it's a pattern match based on publicly available layoff data. no algorithm can tell you whether you're safe. use this as one input among many.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
