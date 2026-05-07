'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Message = { id: string; username: string; text: string; created_at: string }

const ANON_NAMES = ['exhausted_pm', 'laid_off_lucia', 'jobless_in_sf', 'surviving_dev', 'day_12_still_weird', 'waiting_room_wren', 'severance_pending', 'updating_resume', 'ghosted_again', 'recruiter_replied']

function randomName() {
  return ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)] + '_' + Math.floor(Math.random() * 99)
}

export default function ChatRoom() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [username] = useState(randomName)
  const [onlineCount, setOnlineCount] = useState(10)
  const chatRef = useRef<HTMLDivElement>(null)
  const optimisticIds = useRef<Set<string>>(new Set())

  // Load messages when chat opens
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/chat')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data) })
      .finally(() => setLoading(false))
  }, [open])

  // Realtime subscription — skip own messages (already added optimistically)
  useEffect(() => {
    const channel = supabase
      .channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const msg = payload.new as Message
        if (optimisticIds.current.has(msg.username + msg.text)) {
          optimisticIds.current.delete(msg.username + msg.text)
          return
        }
        setMessages(prev => [...prev.slice(-99), msg])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, open])

  // Randomize count on client, then fluctuate
  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 12) + 8)
    const t = setInterval(() => {
      setOnlineCount(n => Math.max(5, n + (Math.random() > 0.5 ? 1 : -1)))
    }, 15000)
    return () => clearInterval(t)
  }, [])

  async function send() {
    const t = input.trim()
    if (!t) return
    setInput('')
    optimisticIds.current.add(username + t)
    const optimistic: Message = {
      id: crypto.randomUUID(),
      username,
      text: t,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev.slice(-99), optimistic])
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, text: t }),
    })
  }

  function timeStr(ts: string) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: 'var(--black)', color: 'white', border: '2px solid var(--yellow)',
          borderRadius: 12, padding: '12px 18px', fontFamily: "'Work Sans', sans-serif",
          fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4cff91', display: 'inline-block' }} />
        waiting room · {onlineCount} online
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 998,
          width: 340, background: '#1a1a1a', border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{ background: 'var(--black)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 13, color: 'white' }}>waiting room 💙</div>
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                {onlineCount} people in here · anonymous
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>

          {/* You are */}
          <div style={{ padding: '6px 16px', background: 'rgba(254,228,29,0.08)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "'Courier Prime', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
            you are: <span style={{ color: 'var(--yellow)' }}>{username}</span>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 16, minHeight: 260, maxHeight: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading && (
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 40 }}>
                loading...
              </div>
            )}
            {!loading && messages.length === 0 && (
              <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 40 }}>
                be the first to say something.
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.username === username
              return (
                <div key={msg.id}>
                  <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 10, color: isMe ? 'var(--yellow)' : 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                    {msg.username} · {timeStr(msg.created_at)}
                  </div>
                  <div style={{ fontSize: 13, color: isMe ? 'white' : 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{msg.text}</div>
                </div>
              )
            })}
          </div>

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="say something..."
              maxLength={300}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 12px', color: 'white', fontSize: 13, fontFamily: "'Work Sans', sans-serif", outline: 'none' }}
            />
            <button onClick={send} style={{ background: 'var(--yellow)', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 700, fontSize: 12, color: 'var(--black)', cursor: 'pointer' }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
