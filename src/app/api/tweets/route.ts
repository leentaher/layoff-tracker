import { NextResponse } from 'next/server'

// Cache tweets in memory for 5 minutes to avoid rate limits
let cache: { data: Tweet[]; fetchedAt: number } | null = null
const CACHE_MS = 5 * 60 * 1000

type Tweet = { id: string; text: string; username: string; name: string; created_at: string }

const FALLBACK: Tweet[] = [
  { id: 'f1',  text: "just got laid off from my PM role at a series C. 6 years in tech. didn't see it coming. if anyone knows of openings, i'm open to it.",  username: 'pmlife_sarah', name: 'sarah k.', created_at: new Date(Date.now() - 8  * 60000).toISOString() },
  { id: 'f2',  text: "the \"it's not personal, it's business\" line hits different when it's you. 3rd layoff in 4 years in tech.",  username: 'devs_perspective', name: 'marcus', created_at: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 'f3',  text: "tech layoffs update: 332,000+ workers laid off in 2026 so far. that's 3,400+ per day. these aren't just numbers.",  username: 'layofftracker_io', name: 'layoff tracker', created_at: new Date(Date.now() - 41 * 60000).toISOString() },
  { id: 'f4',  text: 'anyone else notice that "streamlining operations" has become corporate speak for "we hired too many people in 2021"',  username: 'techworker_real', name: 'alex t.', created_at: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: 'f5',  text: 'day 1 of being laid off: panic. day 7: realizing i was burned out anyway. day 30: applying intentionally. the reset is real.',  username: 'eng_journey', name: 'priya m.', created_at: new Date(Date.now() - 72 * 60000).toISOString() },
  { id: 'f6',  text: 'got laid off. updated resume. reached out to 10 people. had 3 coffee chats. got a referral. 3 weeks later, offer. your network > job boards.',  username: 'hired_again_2026', name: 'james o.', created_at: new Date(Date.now() - 90 * 60000).toISOString() },
  { id: 'f7',  text: 'reminder: being laid off is not a reflection of your performance. companies make bad bets and workers pay the price.',  username: 'workeradvocate', name: 'dr. chen', created_at: new Date(Date.now() - 110 * 60000).toISOString() },
  { id: 'f8',  text: 'the part nobody talks about: health insurance. COBRA costs are absolutely wild. advocate for longer coverage in your severance.',  username: 'hr_insider_real', name: 'hr truth', created_at: new Date(Date.now() - 130 * 60000).toISOString() },
  { id: 'f9',  text: 'got the calendar invite for a "quick sync" with HR and my skip-level. knew instantly. had my desk cleared before the call ended.',  username: 'silicon_valley_life', name: 'anon eng', created_at: new Date(Date.now() - 155 * 60000).toISOString() },
  { id: 'f10', text: 'to every recruiter who ghosted me after 4 rounds of interviews right before layoffs hit: i see you.',  username: 'ghosted_candidate', name: 'frustrated.dev', created_at: new Date(Date.now() - 180 * 60000).toISOString() },
]

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.fetchedAt < CACHE_MS) {
    return NextResponse.json(cache.data)
  }

  const token = process.env.TWITTER_BEARER_TOKEN
  if (!token) {
    return NextResponse.json(FALLBACK)
  }

  try {
    const query = encodeURIComponent('tech layoff -is:retweet lang:en -spam -hiring')
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=20&tweet.fields=created_at,author_id&expansions=author_id&user.fields=username,name`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      console.error('Twitter API error:', res.status, await res.text())
      return NextResponse.json(FALLBACK)
    }

    const json = await res.json()
    const users: Record<string, { username: string; name: string }> = {}
    for (const u of json.includes?.users ?? []) {
      users[u.id] = { username: u.username, name: u.name }
    }

    const tweets: Tweet[] = (json.data ?? []).map((t: { id: string; text: string; author_id: string; created_at: string }) => ({
      id: t.id,
      text: t.text,
      username: users[t.author_id]?.username ?? 'anonymous',
      name: users[t.author_id]?.name ?? 'anonymous',
      created_at: t.created_at,
    }))

    cache = { data: tweets.length > 0 ? tweets : FALLBACK, fetchedAt: Date.now() }
    return NextResponse.json(cache.data)
  } catch (err) {
    console.error('tweets fetch error:', err)
    return NextResponse.json(FALLBACK)
  }
}
