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

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div style={{
      flexShrink: 0,
      width: 300,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10,
      padding: '16px 18px',
      marginRight: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, flexShrink: 0,
        }}>
          {tweet.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tweet.name}</div>
          <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>@{tweet.username} · {timeAgo(tweet.created_at)}</div>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
      </div>
      {/* Text */}
      <p style={{
        fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.8)',
        display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {tweet.text}
      </p>
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

  // Duplicate for seamless infinite loop
  const doubled = [...tweets, ...tweets]

  return (
    <div style={{ background: 'var(--black)', borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 40px 0' }}>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>live · what people are saying</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-2px', color: 'white', lineHeight: 1 }}>
            the feed.
          </h2>
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            #techlayoffs · updated every 5 min
          </span>
        </div>
      </div>

      {/* Scrolling strip — full bleed */}
      {tweets.length > 0 && (
        <div style={{ position: 'relative', paddingBottom: 56 }}>
          {/* Fade edges */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, var(--black), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, var(--black), transparent)', zIndex: 2, pointerEvents: 'none' }} />

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
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>loading feed...</p>
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
