'use client'
import { useEffect, useRef, useState } from 'react'

function FlipDigit({ digit }: { digit: string }) {
  const [current, setCurrent] = useState(digit)
  const [prev, setPrev] = useState(digit)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (digit === current) return
    setPrev(current)
    setFlipping(true)
    const t = setTimeout(() => {
      setCurrent(digit)
      setFlipping(false)
    }, 280)
    return () => clearTimeout(t)
  }, [digit])

  const cardStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 60,
    background: '#1a1a1a',
    borderRadius: 6,
    margin: '0 2px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
    fontFamily: "'Courier Prime', monospace",
    fontWeight: 700,
    fontSize: 36,
    color: 'white',
    letterSpacing: 0,
  }

  const isComma = digit === ',' || digit === ' '
  if (isComma) {
    return (
      <span style={{ fontSize: 36, color: 'rgba(255,255,255,0.4)', fontWeight: 700, alignSelf: 'flex-end', paddingBottom: 4, fontFamily: "'Courier Prime', monospace", margin: '0 1px' }}>
        {digit === ',' ? ',' : ''}
      </span>
    )
  }

  return (
    <div style={cardStyle}>
      {/* Centre line */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.5)', zIndex: 3 }} />

      {/* Top half — static current */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: '#222' }}>
        <span style={{ lineHeight: 1, paddingBottom: 2 }}>{current}</span>
      </div>

      {/* Bottom half — static current */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#1a1a1a' }}>
        <span style={{ lineHeight: 1, paddingTop: 2 }}>{current}</span>
      </div>

      {/* Flip top — old top folding down */}
      {flipping && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: '#333', zIndex: 2, transformOrigin: 'bottom center',
          animation: 'flipTop 0.28s ease-in forwards',
        }}>
          <span style={{ lineHeight: 1, paddingBottom: 2 }}>{prev}</span>
        </div>
      )}

      {/* Flip bottom — new bottom revealed */}
      {flipping && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          overflow: 'hidden', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          background: '#1a1a1a', zIndex: 2, transformOrigin: 'top center',
          animation: 'flipBottom 0.28s ease-out 0.14s forwards',
        }}>
          <span style={{ lineHeight: 1, paddingTop: 2 }}>{digit}</span>
        </div>
      )}

      <style>{`
        @keyframes flipTop {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        @keyframes flipBottom {
          0%   { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }
      `}</style>
    </div>
  )
}

export default function FlipCounter({ value }: { value: number }) {
  const formatted = value.toLocaleString()

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
      {formatted.split('').map((ch, i) => (
        <FlipDigit key={i} digit={ch} />
      ))}
    </div>
  )
}
