'use client'
import { useState } from 'react'

const laidOff = [
  { when: 'now',       title: 'read your severance before you sign anything', body: 'you have time. don\'t let them rush you. this document is negotiable.', dark: false },
  { when: '48hrs',     title: 'don\'t send that email',                        body: 'you know the one. wait 48 hours. re-read it. it probably won\'t feel right.', dark: false },
  { when: 'today',     title: 'file for unemployment',                         body: 'do it today not tomorrow. the money takes time to kick in.', dark: false },
  { when: 'this week', title: 'your severance is negotiable',                  body: 'most people don\'t know this. you can ask for more. you have nothing to lose.', dark: false },
  { when: 'always',    title: 'put your phone down',                           body: 'doomscrolling is not helping. we made something for this. juicebokx.com', dark: false },
  { when: 'ongoing',   title: 'you are not your job title',                    body: 'you were a person before this job. you will be a person after. the algorithm lied.', dark: true },
]

const mightBeNext = [
  { when: 'today',     title: 'update your resume while you\'re calm',         body: '20 minutes now is worth 5 panicked hours later. open the doc. just start.', dark: false },
  { when: 'today',     title: 'save copies of your best work',                 body: 'case studies, decks, results you\'re proud of. save them somewhere you own. before access gets cut.', dark: false },
  { when: 'this week', title: 'know your runway number',                       body: 'how many months could you survive on savings? knowing the number is less scary than not knowing.', dark: false },
  { when: 'this week', title: 'warm up 3 people in your network',              body: 'no ask. just reconnect. a message before you need something lands completely differently.', dark: false },
  { when: 'this week', title: 'run the severance calculator',                  body: 'just so you know your number. knowledge is not the same as expecting the worst.', dark: false },
  { when: 'always',    title: 'preparation is not pessimism',                  body: 'being ready doesn\'t mean you think it\'ll happen. it means you\'ll be okay either way.', dark: true },
]

export default function WhatNow() {
  const [tab, setTab] = useState<'laid' | 'next'>('laid')
  const cards = tab === 'laid' ? laidOff : mightBeNext

  const tabBtn = (active: boolean) => ({
    background: active ? 'var(--black)' : 'white',
    color: active ? 'white' : 'rgba(0,0,0,0.45)',
    border: active ? '2px solid var(--black)' : '2px solid rgba(0,0,0,0.12)',
    borderRadius: 40,
    padding: '10px 22px',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'Work Sans', sans-serif",
    transition: 'all 0.15s',
  })

  return (
    <div id="what-now" style={{ background: 'var(--bg)', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '70px 40px' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 12 }}>
          first things first · 01
        </p>
        <h2 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, marginBottom: 10 }}>
          what now.<br />honestly.
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.65, opacity: 0.6, maxWidth: 500, marginBottom: 32 }}>
          not career advice. the actual things worth doing.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <button style={tabBtn(tab === 'laid')} onClick={() => setTab('laid')}>i just got laid off</button>
          <button style={tabBtn(tab === 'next')} onClick={() => setTab('next')}>i might be next</button>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {cards.map((c, i) => (
            <div key={i} style={{
              background: c.dark ? 'var(--black)' : 'white',
              borderRadius: 8, padding: 18,
              border: c.dark ? '1px solid var(--black)' : '1px solid rgba(0,0,0,0.06)',
            }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: c.dark ? 'var(--yellow)' : 'var(--orange)', letterSpacing: '-0.5px', display: 'block', marginBottom: 8 }}>
                {c.when}
              </span>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 5, color: c.dark ? 'white' : 'var(--black)', lineHeight: 1.3 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 12, color: c.dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
                {c.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
