'use client'
import { useEffect, useState } from 'react'

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
    }, 300)
    return () => clearTimeout(t)
  }, [digit]) // eslint-disable-line react-hooks/exhaustive-deps

  if (digit === ',' || digit === ' ') {
    return (
      <span style={{
        fontSize: 26, color: 'rgba(255,255,255,0.4)', fontWeight: 700,
        alignSelf: 'center', fontFamily: "'Courier Prime', monospace",
        margin: '0 2px', lineHeight: 1,
      }}>
        {digit === ',' ? ',' : ''}
      </span>
    )
  }

  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      width: 32,
      height: 44,
      margin: '0 1px',
      borderRadius: 4,
      overflow: 'hidden',
      background: '#1a1a1a',
      boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      {/* Top half — clips digit to upper portion */}
      <div style={{
        flex: 1,
        background: '#222',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 26, color: 'white', lineHeight: 1, flexShrink: 0 }}>
          {current}
        </span>
      </div>

      {/* Center seam */}
      <div style={{ height: 1, background: 'rgba(0,0,0,0.7)', flexShrink: 0, zIndex: 2 }} />

      {/* Bottom half — clips digit to lower portion */}
      <div style={{
        flex: 1,
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <span style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 26, color: 'white', lineHeight: 1, flexShrink: 0 }}>
          {current}
        </span>
      </div>

      {/* Flip overlay — old digit folding away */}
      {flipping && (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
            background: '#333',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            overflow: 'hidden',
            transformOrigin: 'bottom center',
            animation: 'flipTop 0.15s ease-in forwards',
            zIndex: 3,
          }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 26, color: 'white', lineHeight: 1, flexShrink: 0 }}>
              {prev}
            </span>
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
            background: '#1a1a1a',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            overflow: 'hidden',
            transformOrigin: 'top center',
            animation: 'flipBottom 0.15s ease-out 0.15s forwards',
            zIndex: 3,
            transform: 'rotateX(90deg)',
          }}>
            <span style={{ fontFamily: "'Courier Prime', monospace", fontWeight: 700, fontSize: 26, color: 'white', lineHeight: 1, flexShrink: 0 }}>
              {current}
            </span>
          </div>
        </>
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
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: 0,
      width: 'max-content',
    }}>
      {formatted.split('').map((ch, i) => (
        <FlipDigit key={i} digit={ch} />
      ))}
    </div>
  )
}
