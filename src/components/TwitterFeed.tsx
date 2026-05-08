'use client'
import { useEffect, useRef, useState } from 'react'

type Tweet = { id: string; text: string; username: string; name: string; created_at: string }

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

function CardInner({ tweet }: { tweet: Tweet }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 700, flexShrink: 0,
        }}>
          {tweet.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tweet.name}</div>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(0,0,0,0.3)' }}>@{tweet.username} · {timeAgo(tweet.created_at)}</div>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}><XIcon /></div>
      </div>
      <p style={{
        fontSize: 13, lineHeight: 1.55, color: 'rgba(0,0,0,0.7)',
        display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', margin: 0,
      }}>
        {tweet.text}
      </p>
    </>
  )
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  const isReal = !tweet.id.startsWith('f')

  const baseStyle: React.CSSProperties = {
    flexShrink: 0,
    width: 300,
    background: 'var(--bg)',
    border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: 10,
    padding: '16px 18px',
    marginRight: 12,
  }

  if (isReal) {
    return (
      <a
        href={`https://x.com/i/web/status/${tweet.id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...baseStyle, display: 'block', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      >
        <CardInner tweet={tweet} />
      </a>
    )
  }

  return (
    <div style={baseStyle}>
      <CardInner tweet={tweet} />
    </div>
  )
}

export default function TwitterFeed() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/tweets')
      .then(r => r.json())
      .then((data: Tweet[]) => { if (Array.isArray(data)) setTweets(data) })
      .catch(() => {})
  }, [])

  const doubled = [...tweets, ...tweets]

  return (
    <div style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 40px 0' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 12 }}>live · what people are saying</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--black)', lineHeight: 1 }}>
            the feed.
          </h2>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: 'rgba(0,0,0,0.3)' }}>
            #techlayoffs · updated every 5 min
          </span>
        </div>
      </div>

      {tweets.length > 0 && (
        <div style={{ position: 'relative', paddingBottom: 56 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, white, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, white, transparent)', zIndex: 2, pointerEvents: 'none' }} />

          <div ref={trackRef} style={{
            display: 'flex',
            paddingLeft: 40,
            animation: `scrollTweets ${tweets.length * 6}s linear infinite`,
            width: 'max-content',
          }}>
            {doubled.map((tweet, i) => (
              <TweetCard key={`${tweet.id}-${i}`} tweet={tweet} />
            ))}
          </div>
        </div>
      )}

      {tweets.length === 0 && (
        <div style={{ padding: '20px 40px 56px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: 'rgba(0,0,0,0.2)' }}>loading feed...</p>
        </div>
      )}

      <style>{`
        @keyframes scrollTweets {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        div[style*="scrollTweets"]:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
