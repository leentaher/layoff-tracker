'use client'
import { useState } from 'react'

// ─── Shared styles ────────────────────────────────────────────────────────────
const fieldStyle = {
  width: '100%',
  background: 'white',
  border: '1.5px solid rgba(0,0,0,0.12)',
  borderRadius: 8,
  padding: '12px 14px',
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

// ─── Healthcare constants ─────────────────────────────────────────────────────
const FPL: Record<number, number> = { 1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580 }
const COBRA_MONTHLY: Record<string, number> = { single: 703, spouse: 1444, children: 1242, family: 1997 }
const FAMILY_SIZE: Record<string, number> = { single: 1, spouse: 2, children: 3, family: 4 }
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

// ─── Next move data ───────────────────────────────────────────────────────────
type MoveData = { pivot: string; reason: string; transferable: string[] }
const NEXT_MOVE: Record<string, Record<string, MoveData>> = {
  designer: {
    early:   { pivot: 'Product Designer at an AI company', reason: 'AI tools still need humans who understand usability. AI design is the hottest niche right now — and you\'re already most of the way there.', transferable: ['user research', 'prototyping', 'figma', 'systems thinking'] },
    mid:     { pivot: 'Head of Design or AI Product Designer', reason: 'With 4–7 years you\'re ready to lead or go deep in AI/ML product design. Both paths are in demand.', transferable: ['design systems', 'cross-functional leadership', 'product thinking'] },
    senior:  { pivot: 'Design Director or Fractional CDO', reason: 'Your experience is rare. Companies cutting teams still need design leadership — on a fractional basis if not full-time.', transferable: ['team building', 'design strategy', 'executive communication'] },
    veteran: { pivot: 'Fractional CDO or Design Advisor', reason: 'You\'ve seen cycles. Advising 3–4 startups simultaneously beats working inside one company in this market.', transferable: ['institutional knowledge', 'crisis navigation', 'investor relations'] },
  },
  pm: {
    early:   { pivot: 'AI Product Manager', reason: 'Every company needs PMs who understand AI. An AI PM certification is a 3-month pivot that changes your entire positioning.', transferable: ['roadmapping', 'stakeholder management', 'data analysis'] },
    mid:     { pivot: 'Senior PM at an AI-native company', reason: 'Mid-level PMs with any AI exposure are in demand right now. Companies like Anthropic, Cursor, and others are actively hiring.', transferable: ['sprint planning', 'go-to-market', 'cross-functional coordination'] },
    senior:  { pivot: 'Group PM or Director of Product', reason: 'You\'re probably overdue for a promotion. Use this reset to title-jump, not lateral.', transferable: ['product strategy', 'org design', 'OKR setting'] },
    veteran: { pivot: 'VP of Product or Chief Product Officer', reason: 'The market for senior PMs is tight — go up, not sideways. Fractional CPO is also a real path in this market.', transferable: ['portfolio management', 'company strategy', 'fundraising narratives'] },
  },
  engineer: {
    early:   { pivot: 'AI/ML Engineer or Full-Stack + AI', reason: 'Every engineering job now expects some AI knowledge. Fast.ai or Hugging Face courses in 6 weeks completely changes your positioning.', transferable: ['debugging', 'systems design', 'version control'] },
    mid:     { pivot: 'Senior Engineer at an AI-first company', reason: 'Mid-level engineers with AI interest are getting poached. If you haven\'t started — now is the time to learn the stack.', transferable: ['architecture', 'code review', 'mentorship'] },
    senior:  { pivot: 'Staff/Principal Engineer or Engineering Manager', reason: 'Senior engineers who can also lead are rare. If management sounds interesting, this is the right moment to make that move.', transferable: ['technical leadership', 'systems thinking', 'cross-team coordination'] },
    veteran: { pivot: 'Engineering Director or CTO', reason: 'You\'ve built systems at scale. Someone needs you to do that again — just at a higher level and with more equity.', transferable: ['organizational design', 'technical vision', 'vendor relationships'] },
  },
  data: {
    early:   { pivot: 'Data Analyst → AI Analyst', reason: 'Add LLM APIs to your SQL skillset. The upgrade is real and interviewers notice immediately.', transferable: ['SQL', 'visualization', 'business acumen'] },
    mid:     { pivot: 'Data Scientist or ML Engineer', reason: 'With 4–7 years of analysis you\'re ready to cross over into ML. Python + scikit-learn bridges the gap.', transferable: ['statistical modeling', 'A/B testing', 'product metrics'] },
    senior:  { pivot: 'Head of Data or Analytics Director', reason: 'Senior data people are scarce. Lead analytics for a Series A/B startup — more impact, more equity.', transferable: ['data strategy', 'team management', 'executive reporting'] },
    veteran: { pivot: 'Chief Data Officer or Data Advisor', reason: 'Data governance is a board-level issue now. Your experience is policy-relevant in ways it wasn\'t 5 years ago.', transferable: ['compliance', 'data architecture', 'regulatory knowledge'] },
  },
  marketing: {
    early:   { pivot: 'Growth Marketer with AI tools', reason: 'Early marketers who\'ve shipped AI-assisted campaigns are getting hired immediately. Jasper, Clay, Perplexity — pick one and get good.', transferable: ['copywriting', 'campaign analytics', 'social media'] },
    mid:     { pivot: 'Content or Demand Generation Lead', reason: 'Companies are scaling content 10x with AI — they need marketers who can orchestrate it, not just write it.', transferable: ['campaign strategy', 'SEO', 'email marketing'] },
    senior:  { pivot: 'Head of Marketing or CMO at a startup', reason: 'Big company marketing is consolidating. Startups still need senior marketing leaders who can roll up their sleeves.', transferable: ['brand strategy', 'pipeline generation', 'team building'] },
    veteran: { pivot: 'Fractional CMO', reason: '3 companies at fractional rate > 1 company at salary, in this market. You have the credibility. Use it.', transferable: ['go-to-market', 'board communication', 'brand positioning'] },
  },
  ops: {
    early:   { pivot: 'Operations Analyst with AI tools', reason: 'Operations people who automate workflows with n8n, Zapier, or Make are getting hired immediately. This is a real edge right now.', transferable: ['process mapping', 'project coordination', 'cross-functional work'] },
    mid:     { pivot: 'RevOps or BizOps Manager', reason: 'Revenue operations is one of the fastest-growing functions. Your generalist skills are the foundation they\'re looking for.', transferable: ['data analysis', 'tool administration', 'stakeholder alignment'] },
    senior:  { pivot: 'Head of Operations or Chief of Staff', reason: 'COO and Chief of Staff roles are opening up. Your experience running things is the job description.', transferable: ['organizational management', 'vendor negotiation', 'strategic planning'] },
    veteran: { pivot: 'COO or Operations Consultant', reason: 'You\'ve optimized multiple orgs. Consulting to 3–4 companies simultaneously is a real path.', transferable: ['operational excellence', 'change management', 'executive leadership'] },
  },
  hr: {
    early:   { pivot: 'People Ops at a tech company', reason: 'HR is being rethought from scratch. Early HR people who understand tech culture and modern tooling are in demand.', transferable: ['recruiting', 'onboarding', 'HRIS systems'] },
    mid:     { pivot: 'HR Business Partner or People Partner', reason: 'HRBP roles at growth-stage companies are stable and well-compensated. Your mid-level experience is the sweet spot.', transferable: ['employee relations', 'performance management', 'compensation design'] },
    senior:  { pivot: 'VP of People or Chief People Officer', reason: 'Companies laying off at scale need experienced HR leadership to manage the fallout with dignity. You are that person.', transferable: ['culture design', 'executive coaching', 'DEI strategy'] },
    veteran: { pivot: 'CHRO or HR Consultant', reason: 'You\'ve managed the hard stuff. Other companies need that expertise and will pay well for it.', transferable: ['M&A integration', 'board-level HR', 'regulatory compliance'] },
  },
  sales: {
    early:   { pivot: 'Account Executive at an AI company', reason: 'Selling AI products is the hottest job in sales right now. If you\'ve sold SaaS, you\'re 80% of the way there.', transferable: ['cold outreach', 'CRM', 'pipeline management'] },
    mid:     { pivot: 'Account Executive or Sales Manager', reason: 'Mid-level AEs who\'ve hit quota are still getting hired. Document your numbers — that\'s your entire pitch.', transferable: ['enterprise deals', 'contract negotiation', 'sales process'] },
    senior:  { pivot: 'Head of Sales or VP of Sales', reason: 'Early-stage companies need sales leaders who\'ve been in the trenches, not just managed people from above.', transferable: ['territory planning', 'sales team building', 'customer success handoffs'] },
    veteran: { pivot: 'CRO or Sales Advisor', reason: 'If you\'ve built multiple sales orgs, you know what B2B companies actually need. Advise 2–3 simultaneously.', transferable: ['revenue strategy', 'partnership development', 'investor narrative'] },
  },
}

// ─── Tool card definitions ────────────────────────────────────────────────────
type TabId = 'severance' | 'healthcare' | 'nextmove' | 'legal'
const TOOLS = [
  { id: 'severance' as TabId, icon: '🧮', title: 'severance calculator', desc: 'know your number before they call you in. most people don\'t negotiate. most people should.', cta: 'calculate mine →' },
  { id: 'healthcare' as TabId, icon: '🏥', title: 'healthcare calculator', desc: 'COBRA vs marketplace. your actual cost. your 60-day deadline. US workers only.', cta: 'calculate mine →' },
  { id: 'nextmove' as TabId, icon: '🧭', title: 'what\'s your next move?', desc: 'your role is changing. here\'s where it\'s going and what you\'re already most of the way to.', cta: 'find out →' },
  { id: 'legal' as TabId, icon: '⚖️', title: 'do you have legal options?', desc: 'you might. most people don\'t look into it because lawyers are expensive. here\'s what to know.', cta: 'find out →' },
]

type HCResult = {
  cobra: { monthly: number; annual: number }
  marketplace: { monthly: number; subsidy: number; net: number } | null
  medicaid: boolean
  coverageGap: boolean
  recommendation: string
  urgency: string
}
type SevResult = { weeks: string; label: string; text: string; script: string }

export default function ToolsSection() {
  const [activeTab, setActiveTab] = useState<TabId | null>(null)

  // Severance state
  const [sevYears, setSevYears] = useState('')
  const [sevLevel, setSevLevel] = useState('')
  const [sevSize, setSevSize] = useState('')
  const [sevResult, setSevResult] = useState<SevResult | null>(null)

  // Healthcare state
  const [hcSalary, setHcSalary] = useState('')
  const [hcPlan, setHcPlan] = useState('')
  const [hcState, setHcState] = useState('')
  const [hcResult, setHcResult] = useState<HCResult | null>(null)

  // Next move state
  const [nmRole, setNmRole] = useState('')
  const [nmYears, setNmYears] = useState('')
  const [nmResult, setNmResult] = useState<MoveData | null>(null)

  function toggleTab(id: TabId) {
    setActiveTab(prev => (prev === id ? null : id))
  }

  function calcSeverance() {
    const y = parseFloat(sevYears) || 1
    const multipliers: Record<string, number> = { startup: 1, mid: 1.5, large: 2, faang: 3 }
    const levelBonus: Record<string, number> = { ic: 0, senior: 2, manager: 4, vp: 8 }
    const base = Math.round(y * (multipliers[sevSize] || 1.5) + (levelBonus[sevLevel] || 0))
    const weeks = Math.max(base, 2)
    const extra = (multipliers[sevSize] || 1.5) > 2 ? 6 : 3
    const scripts: Record<string, string> = {
      startup: `"I appreciate the offer. Given my ${y} years here and the transition ahead, I'd like to discuss extending to ${weeks + 2} weeks. I want to help with a smooth handoff and this would let me do that without the immediate pressure."`,
      mid: `"Thank you for the package. I've reviewed it and would like to request ${weeks + 3} weeks given my tenure and the market conditions. I believe this is fair and consistent with industry standards."`,
      large: `"I've spoken with an employment attorney and I believe ${weeks + 4} weeks better reflects my ${y} years of contribution. I'd like to request that adjustment before I sign."`,
      faang: `"I understand the package follows standard policy. Given my tenure of ${y} years at the ${sevLevel || 'IC'} level, I'd like to formally request a review for ${weeks + 6} weeks. I'm happy to work with HR directly."`,
    }
    setSevResult({
      weeks: `${weeks}–${weeks + extra} weeks`,
      label: 'industry benchmark severance',
      text: `Based on ${y} year${y !== 1 ? 's' : ''} at a ${sevSize || 'mid-size'} company at the ${sevLevel || 'IC'} level, the typical severance range is ${weeks} to ${weeks + extra} weeks. Most people accept the first offer. You don't have to.`,
      script: scripts[sevSize] || scripts.mid,
    })
  }

  function calcHealthcare() {
    const monthlySalary = parseFloat(hcSalary.replace(/,/g, '')) || 5000
    const annualIncome = monthlySalary * 12
    const planKey = hcPlan || 'single'
    const stateKey = hcState || 'CA'
    const familySize = FAMILY_SIZE[planKey]
    const fpl = FPL[familySize] ?? FPL[4]
    const cobraMonthly = Math.round(COBRA_MONTHLY[planKey] * 1.02)
    const cobraAnnual = cobraMonthly * 12
    const medicaid = EXPANSION_STATES.has(stateKey) && annualIncome < fpl * 1.38
    const coverageGap = !EXPANSION_STATES.has(stateKey) && annualIncome < fpl
    const benchmarkMonthly = COBRA_MONTHLY[planKey] * 0.85
    let marketplace = null
    if (!medicaid && !coverageGap) {
      const maxContribution = (annualIncome * 0.085) / 12
      const subsidy = Math.max(0, benchmarkMonthly - maxContribution)
      const net = Math.max(0, Math.round(benchmarkMonthly - subsidy))
      marketplace = { monthly: Math.round(benchmarkMonthly), subsidy: Math.round(subsidy), net }
    }
    let recommendation = ''
    let urgency = ''
    if (medicaid) {
      recommendation = `you likely qualify for Medicaid in ${stateKey} — apply immediately at healthcare.gov. it's free and your income qualifies based on 138% of the federal poverty level.`
      urgency = 'apply now · free coverage'
    } else if (coverageGap) {
      recommendation = `${stateKey} hasn't expanded Medicaid and your income may fall in the coverage gap. look into marketplace plans during your 60-day SEP window.`
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
    setHcResult({ cobra: { monthly: cobraMonthly, annual: cobraAnnual }, marketplace, medicaid, coverageGap, recommendation, urgency })
  }

  function calcNextMove() {
    const result = NEXT_MOVE[nmRole]?.[nmYears]
    if (result) setNmResult(result)
  }

  return (
    <div id="tools" style={{ background: 'var(--bg)', borderTop: '3px solid var(--orange)' }}>
      <div className="section-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>

        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 14 }}>
          layer 1 · stabilize · juicebokx tools
        </p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.0, color: 'var(--black)', marginBottom: 12 }}>
          get stable.<br />then get found.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(0,0,0,0.5)', maxWidth: 520, marginBottom: 40 }}>
          use these before you do anything else. they take 5 minutes each and most people don't know they exist.
        </p>

        {/* ── Tool cards ─────────────────────────────────────────────────────── */}
        <div className="grid-tools" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {TOOLS.map(tool => {
            const isActive = activeTab === tool.id
            return (
              <div
                key={tool.id}
                onClick={() => toggleTab(tool.id)}
                style={{
                  background: 'white',
                  border: `1.5px solid ${isActive ? 'var(--orange)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: 12,
                  padding: '24px 20px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxShadow: isActive ? '0 0 0 3px rgba(240,61,0,0.1)' : 'none',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{tool.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--black)', marginBottom: 8, letterSpacing: '-0.3px', lineHeight: 1.2 }}>{tool.title}</div>
                <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6, marginBottom: 16 }}>{tool.desc}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)' }}>
                  {isActive ? 'close ↑' : tool.cta}
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Expanded panel ─────────────────────────────────────────────────── */}
        {activeTab && (
          <div style={{ marginTop: 16, background: 'white', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 32, animation: 'fadeUp 0.25s ease' }}>

            {/* ── SEVERANCE ── */}
            {activeTab === 'severance' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: 6 }}>is your severance fair?</h3>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 24, lineHeight: 1.6 }}>most people don't negotiate. most people should. enter your details to get a benchmark and a negotiation script.</p>
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 20 }}>
                  <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>years at company</label>
                      <input type="number" style={fieldStyle} placeholder="3" min={0} max={30} value={sevYears} onChange={e => setSevYears(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>level</label>
                      <select style={fieldStyle} value={sevLevel} onChange={e => setSevLevel(e.target.value)}>
                        <option value="">select...</option>
                        <option value="ic">individual contributor</option>
                        <option value="senior">senior / staff</option>
                        <option value="manager">manager / director</option>
                        <option value="vp">VP / executive</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>company size</label>
                      <select style={fieldStyle} value={sevSize} onChange={e => setSevSize(e.target.value)}>
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
                  <button onClick={calcSeverance} style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%' }}>
                    calculate
                  </button>
                  {sevResult && (
                    <div style={{ marginTop: 18, padding: 18, background: 'white', borderRadius: 6, animation: 'fadeUp 0.3s ease' }}>
                      <span style={{ fontSize: 42, fontWeight: 900, color: 'var(--orange)', letterSpacing: '-2px', display: 'block', lineHeight: 1, marginBottom: 4 }}>{sevResult.weeks}</span>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>{sevResult.label}</span>
                      <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)', marginBottom: 12 }}>{sevResult.text}</div>
                      <div style={{ background: 'var(--bg)', borderRadius: 6, padding: 14, borderLeft: '3px solid var(--orange)', fontSize: 12, color: 'rgba(0,0,0,0.65)', lineHeight: 1.65, fontStyle: 'italic' }}>
                        {sevResult.script}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── HEALTHCARE ── */}
            {activeTab === 'healthcare' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', margin: 0 }}>what happens to your healthcare.</h3>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eef0f8', border: '1px solid #c8cde8', borderRadius: 20, padding: '4px 10px', fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2d3a6b', fontWeight: 700 }}>
                    🇺🇸 US workers only
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 24, lineHeight: 1.6 }}>the clock starts the day you're cut. you have 60 days to decide. here's what it actually costs.</p>
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 20 }}>
                  <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>monthly salary</label>
                      <input type="number" style={fieldStyle} placeholder="5000" value={hcSalary} onChange={e => setHcSalary(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>plan type</label>
                      <select style={fieldStyle} value={hcPlan} onChange={e => setHcPlan(e.target.value)}>
                        <option value="">select...</option>
                        <option value="single">just me</option>
                        <option value="spouse">me + spouse/partner</option>
                        <option value="children">me + child(ren)</option>
                        <option value="family">family (me + spouse + kids)</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>US state</label>
                      <select style={fieldStyle} value={hcState} onChange={e => setHcState(e.target.value)}>
                        <option value="">select...</option>
                        {US_STATES.map(([code, name]) => (
                          <option key={code} value={code}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button onClick={calcHealthcare} style={{ width: '100%', background: 'var(--black)', color: 'white', border: 'none', borderRadius: 8, padding: '15px 0', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                    calculate my options
                  </button>
                  {hcResult && (
                    <div style={{ marginTop: 18, animation: 'fadeUp 0.3s ease' }}>
                      <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)', borderRadius: 8, padding: '10px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', fontWeight: 700 }}>⏱ {hcResult.urgency}</span>
                        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>you have 60 days from your last day to elect coverage</span>
                      </div>
                      <div className="hc-result-grid" style={{ display: 'grid', gridTemplateColumns: hcResult.medicaid ? '1fr 1fr 1fr' : hcResult.marketplace ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 16 }}>
                        {/* COBRA */}
                        <div style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: 18 }}>
                          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 8 }}>option A · COBRA</div>
                          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--black)', letterSpacing: '-1.5px', lineHeight: 1 }}>${hcResult.cobra.monthly.toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, marginBottom: 10 }}>per month · ${hcResult.cobra.annual.toLocaleString()}/yr</div>
                          <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                            <li>same plan, same doctors</li>
                            <li>no network disruption</li>
                            <li>covers up to 18 months</li>
                          </ul>
                        </div>
                        {/* Marketplace */}
                        {hcResult.marketplace && !hcResult.medicaid && (
                          <div style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.3)', borderRadius: 10, padding: 18 }}>
                            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 8 }}>option B · ACA marketplace</div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--black)', letterSpacing: '-1.5px', lineHeight: 1 }}>${hcResult.marketplace.net.toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, marginBottom: 10 }}>per month after ~${hcResult.marketplace.subsidy.toLocaleString()} subsidy</div>
                            <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                              <li>subsidy based on your income</li>
                              <li>enroll at healthcare.gov</li>
                              <li>60-day special enrollment</li>
                            </ul>
                          </div>
                        )}
                        {/* Medicaid */}
                        {hcResult.medicaid && (
                          <div style={{ background: 'rgba(100,200,100,0.06)', border: '1px solid rgba(60,160,60,0.25)', borderRadius: 10, padding: 18 }}>
                            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: '#2e8b2e', marginBottom: 8 }}>option B · Medicaid</div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--black)', letterSpacing: '-1.5px', lineHeight: 1 }}>$0</div>
                            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', marginTop: 4, marginBottom: 10 }}>per month · you qualify</div>
                            <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                              <li>income qualifies at 138% FPL</li>
                              <li>apply at healthcare.gov</li>
                              <li>no enrollment window deadline</li>
                            </ul>
                          </div>
                        )}
                        {/* Coverage gap */}
                        {hcResult.coverageGap && (
                          <div style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(200,60,60,0.2)', borderRadius: 10, padding: 18 }}>
                            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: '#c0392b', marginBottom: 8 }}>heads up · coverage gap</div>
                            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 10 }}>your state hasn't expanded Medicaid</div>
                            <ul style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.7, paddingLeft: 14, margin: 0 }}>
                              <li>check your state's assistance programs</li>
                              <li>COBRA may be your best option short-term</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <div style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '16px 20px' }}>
                        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 6 }}>our read</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(0,0,0,0.75)', margin: 0 }}>{hcResult.recommendation}</p>
                        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(0,0,0,0.3)', marginTop: 10, marginBottom: 0 }}>
                          estimates based on 2024 KFF data and federal poverty guidelines. always verify at healthcare.gov.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── NEXT MOVE ── */}
            {activeTab === 'nextmove' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: 6 }}>what's your next move?</h3>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 24, lineHeight: 1.6 }}>your role is changing. here's where it's going and what you're already most of the way to. powered by new consensus research.</p>
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 20 }}>
                  <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>your last role</label>
                      <select style={fieldStyle} value={nmRole} onChange={e => setNmRole(e.target.value)}>
                        <option value="">select...</option>
                        <option value="designer">Designer / UX</option>
                        <option value="pm">Product Manager</option>
                        <option value="engineer">Software Engineer</option>
                        <option value="data">Data Analyst</option>
                        <option value="marketing">Marketing</option>
                        <option value="ops">Operations</option>
                        <option value="hr">HR / People</option>
                        <option value="sales">Sales</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>years of experience</label>
                      <select style={fieldStyle} value={nmYears} onChange={e => setNmYears(e.target.value)}>
                        <option value="">select...</option>
                        <option value="early">0–3 years</option>
                        <option value="mid">4–7 years</option>
                        <option value="senior">8–12 years</option>
                        <option value="veteran">12+ years</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={calcNextMove} style={{ background: 'var(--black)', color: 'white', border: 'none', borderRadius: 6, padding: '14px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%' }}>
                    show me my next move →
                  </button>
                  {nmResult && (
                    <div style={{ marginTop: 18, animation: 'fadeUp 0.3s ease' }}>
                      <div style={{ background: 'white', borderRadius: 8, padding: 20, borderLeft: '4px solid var(--orange)', marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 6 }}>your next move</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.5px', marginBottom: 8 }}>{nmResult.pivot}</div>
                        <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', lineHeight: 1.65, margin: 0 }}>{nmResult.reason}</p>
                      </div>
                      <div style={{ background: 'white', borderRadius: 8, padding: 20 }}>
                        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: 10 }}>skills that transfer directly</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {nmResult.transferable.map(skill => (
                            <span key={skill} style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: 'rgba(0,0,0,0.65)', fontWeight: 600 }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── LEGAL ── */}
            {activeTab === 'legal' && (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.8px', marginBottom: 6 }}>do you have legal options?</h3>
                <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', marginBottom: 24, lineHeight: 1.6 }}>you might. most people don't look into it because lawyers are expensive. but some protections don't require a lawyer at all — and some lawyers don't charge unless you win.</p>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>🆓</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--black)', marginBottom: 14, letterSpacing: '-0.3px' }}>free and low-cost options</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        ['legal aid societies', 'free employment law help for qualifying income levels. search "legal aid [your city]".'],
                        ['law school clinics', 'law students supervised by attorneys. often free. search "[nearest university] employment law clinic".'],
                        ['contingency lawyers', 'employment attorneys who only get paid if you win. no upfront cost. worth a free consultation.'],
                        ['EEOC filing', 'if you suspect discrimination, you can file with the Equal Employment Opportunity Commission yourself for free.'],
                      ].map(([title, desc]) => (
                        <div key={title} style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', lineHeight: 1.65, paddingLeft: 12, borderLeft: '2px solid var(--orange)' }}>
                          <strong>{title}</strong> — {desc}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--black)', marginBottom: 14, letterSpacing: '-0.3px' }}>things worth looking into</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        ['WARN Act', 'companies with 100+ employees must give 60 days notice before mass layoffs, or pay 60 days wages. if they didn\'t, you may be owed money.'],
                        ['wrongful termination', 'if you were laid off after raising safety concerns, taking protected leave, or reporting misconduct, that may be illegal.'],
                        ['discrimination', 'if your layoff disproportionately targeted people of a protected class (age, race, gender, disability), that\'s worth looking into.'],
                        ['non-compete agreements', 'many are unenforceable. a free consultation with an employment lawyer can tell you if yours actually applies.'],
                      ].map(([title, desc]) => (
                        <div key={title} style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', lineHeight: 1.65, paddingLeft: 12, borderLeft: '2px solid #1A4DB5' }}>
                          <strong>{title}</strong> — {desc}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '14px 18px', fontSize: 12, color: 'rgba(0,0,0,0.4)', lineHeight: 1.7, fontFamily: "'Courier Prime', monospace" }}>
                  this is not legal advice. we are two people who made a word search book. but we do think you deserve to know your options before assuming you have none.
                </div>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
