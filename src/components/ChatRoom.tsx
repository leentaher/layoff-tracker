'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Message = { id: string; username: string; text: string; created_at: string }

const ANON_NAMES = ['exhausted_pm', 'laid_off_lucia', 'jobless_in_sf', 'surviving_dev', 'day_12_still_weird', 'waiting_room_wren', 'severance_pending', 'updating_resume', 'ghosted_again', 'recruiter_replied']

const AUTO_STATUSES = [
  'recently laid off 🙃', 'refreshing email constantly 📧', 'day 12. still weird.',
  'staring at linkedin 😶', 'pretending to be fine 🙂', 'applying to everything rn',
  'in my situational depression era', 'just here. existing.', 'sent 40 apps this week',
  'waiting for recruiter to reply', 'my dog is my therapist now 🐶', 'crying but make it cute',
  'technically funemployed', 'open to opportunities 🥲', 'skill issue? no. economy issue.',
]

function randomName() {
  return ANON_NAMES[Math.floor(Math.random() * ANON_NAMES.length)] + '_' + Math.floor(Math.random() * 99)
}

function randomStatus() {
  return AUTO_STATUSES[Math.floor(Math.random() * AUTO_STATUSES.length)]
}

const XP_BLUE = 'linear-gradient(180deg, #0a246a 0%, #3a6ea5 100%)'
const XP_GREY = '#ece9d8'
const XP_BORDER = '2px solid #0a246a'

export default function ChatRoom() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [username] = useState(randomName)
  const [onlineCount, setOnlineCount] = useState(10)
  const [status, setStatus] = useState(randomStatus)
  const [editingStatus, setEditingStatus] = useState(false)
  const [statusDraft, setStatusDraft] = useState('')
  const statusInputRef = useRef<HTMLInputElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const optimisticIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/chat')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMessages(data) })
      .finally(() => setLoading(false))
  }, [open])

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

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, open])

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 12) + 8)
    const t = setInterval(() => {
      setOnlineCount(n => Math.max(5, n + (Math.random() > 0.5 ? 1 : -1)))
    }, 15000)
    return () => clearInterval(t)
  }, [])

  function startEditStatus() {
    setStatusDraft(status)
    setEditingStatus(true)
    setTimeout(() => statusInputRef.current?.select(), 30)
  }

  function saveStatus() {
    const s = statusDraft.trim()
    if (s) setStatus(s)
    setEditingStatus(false)
  }

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
      {/* Taskbar button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: XP_BLUE, color: 'white',
          border: '1px solid #1b3f7a',
          borderRadius: 4, padding: '7px 14px',
          fontFamily: 'Tahoma, Arial, sans-serif',
          fontWeight: 700, fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '1px 1px 0 #6b8fc4 inset, -1px -1px 0 #03125a inset',
        }}
      >
        <span style={{ fontSize: 14 }}>💬</span>
        the waiting room · {onlineCount} online
      </button>

      {/* Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 72, right: 24, zIndex: 998,
          width: 360,
          fontFamily: 'Tahoma, Arial, sans-serif',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
          border: '3px solid #0a246a',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Title bar */}
          <div style={{
            background: XP_BLUE,
            padding: '4px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13 }}>💬</span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 12, letterSpacing: 0.2 }}>
                juicebokx messenger
              </span>
            </div>
            {/* Window controls */}
            <div style={{ display: 'flex', gap: 2 }}>
              {['_', '□', '×'].map((c, i) => (
                <button key={i} onClick={c === '×' ? () => setOpen(false) : undefined} style={{
                  width: 18, height: 18, background: i === 2 ? '#c0392b' : '#3a8fde',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 2, color: 'white', fontSize: 10,
                  fontWeight: 700, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  fontFamily: 'Tahoma, Arial, sans-serif',
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Menu bar */}
          <div style={{ background: XP_GREY, borderBottom: '1px solid #aca899', padding: '2px 8px', display: 'flex', gap: 16 }}>
            {['File', 'View', 'Actions', 'Help'].map(m => (
              <span key={m} style={{ fontSize: 11, color: '#000', cursor: 'default', padding: '1px 4px' }}>{m}</span>
            ))}
          </div>

          {/* User info bar */}
          <div style={{
            background: '#d9e8fb', borderBottom: '1px solid #b3cce8',
            padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8,
            position: 'relative',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#f0a500',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, border: '2px solid #0a246a', flexShrink: 0,
            }}>😶</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#0a246a' }}>{username}</div>
              {editingStatus ? (
                <input
                  ref={statusInputRef}
                  value={statusDraft}
                  onChange={e => setStatusDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveStatus(); if (e.key === 'Escape') setEditingStatus(false) }}
                  onBlur={saveStatus}
                  maxLength={50}
                  style={{
                    fontSize: 10, width: '100%', border: '1px solid #7f9db9',
                    borderRadius: 2, padding: '1px 4px', fontFamily: 'Tahoma, Arial, sans-serif',
                    outline: 'none', background: 'white',
                  }}
                />
              ) : (
                <div
                  onClick={startEditStatus}
                  title="click to edit your status"
                  style={{ fontSize: 10, color: '#555', cursor: 'text', display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <span>{status}</span>
                  <span style={{ fontSize: 8, color: '#999', opacity: 0.7 }}>✏️</span>
                </div>
              )}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50', display: 'inline-block', border: '1px solid #2e7d32' }} />
              <span style={{ fontSize: 10, color: '#333' }}>online</span>
            </div>
          </div>

          {/* Room label */}
          <div style={{ background: '#c5d9f1', borderBottom: '1px solid #b3cce8', padding: '3px 10px' }}>
            <span style={{ fontSize: 10, color: '#0a246a', fontWeight: 700 }}>▼ the waiting room ({onlineCount})</span>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{
            flex: 1, overflowY: 'auto', background: 'white',
            padding: '8px 10px', minHeight: 220, maxHeight: 280,
            display: 'flex', flexDirection: 'column', gap: 6,
            borderBottom: '1px solid #aca899',
          }}>
            {loading && (
              <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 40 }}>loading...</div>
            )}
            {!loading && messages.length === 0 && (
              <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 40 }}>
                be the first to say something.
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.username === username
              return (
                <div key={msg.id} style={{ fontSize: 12, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: isMe ? '#0a246a' : '#c0392b' }}>
                    {msg.username} says:
                  </span>
                  <span style={{ fontSize: 10, color: '#999', marginLeft: 6 }}>({timeStr(msg.created_at)})</span>
                  <div style={{ color: '#111', paddingLeft: 2 }}>{msg.text}</div>
                </div>
              )
            })}
          </div>

          {/* Toolbar */}
          <div style={{ background: XP_GREY, borderBottom: '1px solid #aca899', padding: '3px 8px', display: 'flex', gap: 8, alignItems: 'center' }}>
            {['😊', '😢', '👋', '☕'].map(e => (
              <button key={e} onClick={() => setInput(i => i + e)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 2,
              }}>{e}</button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#666', cursor: 'pointer', border: '1px solid #aca899', borderRadius: 2, padding: '1px 6px', background: 'white' }}>
              nudge
            </span>
          </div>

          {/* Input */}
          <div style={{ background: XP_GREY, padding: '6px 8px', display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="type a message..."
              maxLength={300}
              rows={2}
              style={{
                flex: 1, border: '1px solid #7f9db9', borderRadius: 2,
                padding: '4px 6px', fontSize: 12, fontFamily: 'Tahoma, Arial, sans-serif',
                resize: 'none', outline: 'none', background: 'white',
              }}
            />
            <button onClick={send} style={{
              background: XP_BLUE, color: 'white', border: '1px solid #1b3f7a',
              borderRadius: 3, padding: '6px 14px', fontWeight: 700, fontSize: 11,
              cursor: 'pointer', fontFamily: 'Tahoma, Arial, sans-serif',
              boxShadow: '1px 1px 0 #6b8fc4 inset',
              whiteSpace: 'nowrap',
            }}>
              Send
            </button>
          </div>

        </div>
      )}
    </>
  )
}
