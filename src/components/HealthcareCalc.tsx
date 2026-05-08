'use client'
import { useState } from 'react'

// 2024 Federal Poverty Level
const FPL: Record<number, number> = { 1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580 }

// Full COBRA monthly premiums (employer + employee share, 2024 KFF data)
const COBRA_MONTHLY: Record<string, number> = {
  single: 703,
  spouse: 1444,
  children: 1242,
  family: 1997,
}

// Family size per plan type
const FAMILY_SIZE: Record<string, number> = {
  single: 1,
  spouse: 2,
  children: 3,
  family: 4,
}

// Medicaid expansion states (as of 2024)
const EXPANSION_STATES = new Set([
  'AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MO','MT','NE','NV','NH','NJ','NM',
  'NY','NC','ND','OH','OK','OR','PA','RI','SD','UT','VT','VA','WA','WV',
])

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','Washington DC'],['FL','Florida'],
  ['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],
  ['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],
  ['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],
  ['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],
  ['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],
  ['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],
  ['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],
  ['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
]

type Result = {
  cobra: { monthly: number; annual: number }
  marketplace: { monthly: number; subsidy: number; net: number } | null
  medicaid: boolean
  coverageGap: boolean
  recommendation: string
  urgency: string
}

const fieldStyle = {
  width: '100%',
  background: 'white',
  border: '1.5px solid rgba(0,0,0,0.12)',
  borderRadius: 8,
  padding: '14px 16px',
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 13,
  color: 'var(--black)',
  outline: 'none',
  boxSizing: 'border-box' as const,
  appearance: 'none' as const,
}

const labelStyle = {
  display: 'block' as const,
  fontFamily: "'Courier Prime', monospace",
  fontSize: 9,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: 'rgba(0,0,0,0.4)',
  marginBottom: 6,
}

export default function HealthcareCalc() {
  const [salary, setSalary] = useState('')
  const [plan, setPlan] = useState('')
  const [state, setState] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  function calculate() {
    const monthlySalary = parseFloat(salary.replace(/,/g, '')) || 5000
    const annualIncome = monthlySalary * 12
    const planKey = plan || 'single'
    const stateKey = state || 'CA'
    const familySize = FAMILY_SIZE[planKey]
    const fpl = FPL[familySize] ?? FPL[4]

    // COBRA: full premium + 2% admin
    const cobraMonthly = Math.round(COBRA_MONTHLY[planKey] * 1.02)
    const cobraAnnual = cobraMonthly * 12

    // Medicaid: income < 138% FPL in expansion state
    const medicaid = EXPANSION_STATES.has(stateKey) && annualIncome < fpl * 1.38

    // Coverage gap: non-expansion state, income < 100% FPL
    const coverageGap = !EXPANSION_STATES.has(stateKey) && annualIncome < fpl

    // ACA marketplace subsidy (based on 8.5% income cap for benchmark silver plan)
    // Benchmark plan roughly ≈ COBRA_MONTHLY[planKey] (pre-subsidy average)
    const benchmarkMonthly = COBRA_MONTHLY[planKey] * 0.85 // marketplace ~15% cheaper than COBRA
    let marketplace = null
    if (!medicaid && !coverageGap) {
      const maxContribution = (annualIncome * 0.085) / 12 // 8.5% of income cap
      const subsidy = Math.max(0, benchmarkMonthly - maxContribution)
      const net = Math.max(0, Math.round(benchmarkMonthly - subsidy))
      marketplace = { monthly: Math.round(benchmarkMonthly), subsidy: Math.round(subsidy), net }
    }

    // Recommendation
    let recommendation = ''
    let urgency = ''
    if (medicaid) {
      recommendation = `you likely qualify for Medicaid in ${stateKey} — apply immediately at healthcare.gov. it's free and your income qualifies based on 138% of the federal poverty level.`
      urgency = 'apply now · free coverage'
    } else if (coverageGap) {
      recommendation = `${stateKey} hasn't expanded Medicaid and your income may fall in the coverage gap. look into marketplace plans during your 60-day SEP window — some states have low-cost options.`
      urgency = 'act within 60 days'
    } else if (marketplace && marketplace.net < cobraMonthly * 0.6) {
      recommendation = `a marketplace plan is likely your best option — you'd pay ~$${marketplace.net}/mo vs $${cobraMonthly}/mo for COBRA. apply at healthcare.gov within 60 days of losing coverage.`
      urgency = 'marketplace is cheaper'
    } else if (marketplace && marketplace.net < cobraMonthly) {
      recommendation = `marketplace is slightly cheaper than COBRA. if you have ongoing care with specific doctors, check if they're in-network before switching. you have 60 days to decide.`
      urgency = 'compare networks first'
    } else {
      recommendation = `COBRA keeps your exact same plan and network. if you have ongoing treatment or specialist care, the continuity may be worth the higher cost while you job search.`
      urgency = 'COBRA for continuity'
    }

    setResult({ cobra: { monthly: cobraMonthly, annual: cobraAnnual }, marketplace, medicaid, coverageGap, recommendation, urgency })
  }

  return (
    <div style={{ background: 'white' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 12 }}>tool · 03</p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'var(--black)', marginBottom: 12 }}>
          what happens to<br />your healthcare.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(0,0,0,0.5)', maxWidth: 520, marginBottom: 36 }}>
          the clock starts the day you're cut. you have 60 days to decide. here's what it actually costs.
        </p>

        {/* Form */}
        <div style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 28, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>monthly salary</label>
              <input
                style={fieldStyle}
                type="number"
                placeholder="5000"
                value={salary}
                onChange={e => setSalary(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>plan type</label>
              <select style={fieldStyle} value={plan} onChange={e => setPlan(e.target.value)}>
                <option value="">select...</option>
                <option value="single">just me</option>
                <option value="spouse">me + spouse/partner</option>
                <option value="children">me + child(ren)</option>
                <option value="family">family (me + spouse + kids)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>US state</label>
              <select style={fieldStyle} value={state} onChange={e => setState(e.target.value)}>
                <option value="">select...</option>
                {US_STATES.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={calculate}
            style={{ width: '100%', background: 'var(--black)', color: 'white', border: 'none', borderRadius: 8, padding: '15px 0', fontWeight: 800, fontSize: 14, cursor: 'pointer', letterSpacing: '-0.3px' }}
          >
            calculate my options
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ animation: 'fadeUp 0.3s ease' }}>
            {/* Urgency banner */}
            <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 700 }}>⏱ {result.urgency}</span>
              <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>you have 60 days from your last day to elect coverage</span>
            </div>

            {/* Option cards */}
            <div style={{ display: 'grid', gridTemplateColumns: result.medicaid ? '1fr 1fr 1fr' : result.marketplace ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 20 }}>

              {/* COBRA */}
              <div style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: 20 }}>
                <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 8 }}>option A · COBRA</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--black)', letterSpacing: '-1.5px', lineHeight: 1 }}>${result.cobra.monthly.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, marginBottom: 12 }}>per month · ${result.cobra.annual.toLocaleString()}/yr</div>
                <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                  <li>same plan, same doctors</li>
                  <li>no network disruption</li>
                  <li>covers up to 18 months</li>
                  <li>most expensive option</li>
                </ul>
              </div>

              {/* Marketplace */}
              {result.marketplace && !result.medicaid && (
                <div style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.3)', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 8 }}>option B · ACA marketplace</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--black)', letterSpacing: '-1.5px', lineHeight: 1 }}>${result.marketplace.net.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, marginBottom: 12 }}>
                    per month after ~${result.marketplace.subsidy.toLocaleString()} subsidy
                  </div>
                  <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                    <li>subsidy based on your income</li>
                    <li>enroll at healthcare.gov</li>
                    <li>60-day special enrollment</li>
                    <li>check your doctors are in-network</li>
                  </ul>
                </div>
              )}

              {/* Medicaid */}
              {result.medicaid && (
                <div style={{ background: 'rgba(100,200,100,0.06)', border: '1px solid rgba(60,160,60,0.25)', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2e8b2e', marginBottom: 8 }}>option B · Medicaid</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--black)', letterSpacing: '-1.5px', lineHeight: 1 }}>$0</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, marginBottom: 12 }}>per month · you qualify</div>
                  <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                    <li>income qualifies at 138% FPL</li>
                    <li>apply at healthcare.gov</li>
                    <li>coverage starts immediately</li>
                    <li>no enrollment window deadline</li>
                  </ul>
                </div>
              )}

              {/* Coverage gap warning */}
              {result.coverageGap && (
                <div style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(200,60,60,0.2)', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c0392b', marginBottom: 8 }}>heads up · coverage gap</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 12 }}>your state hasn't expanded Medicaid</div>
                  <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                    <li>check your state's assistance programs</li>
                    <li>community health centers offer sliding-scale care</li>
                    <li>COBRA may be your best option short-term</li>
                    <li>prescription assistance programs exist separately</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendation */}
            <div style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 8 }}>our read</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(0,0,0,0.75)', margin: 0 }}>{result.recommendation}</p>
              <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 12, lineHeight: 1.6 }}>
                estimates based on 2024 KFF data and federal poverty guidelines. actual costs vary by plan, age, and insurer. always verify at healthcare.gov.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
