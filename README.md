# layoff tracker — juicebokx

> `layofftracker.juicebokx.com`

## stack
- **Next.js 14** (App Router)
- **Supabase** — Postgres DB + Realtime websockets
- **Vercel** — hosting + daily cron scraper

---

## setup in 4 steps

### 1. supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → hit Run
3. Copy your keys from **Settings > API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. local dev
```bash
cp .env.example .env.local
# fill in your Supabase keys + a random CRON_SECRET string

npm install
npm run dev
# → http://localhost:3000/layofftracker
```

### 3. vercel deploy
```bash
npm i -g vercel
vercel
# follow prompts — it detects Next.js automatically
```

Then in Vercel dashboard → **Settings > Environment Variables** add all 4 vars from `.env.example`

### 4. godaddy dns
In GoDaddy DNS settings for juicebokx.com, add:

| Type  | Name              | Value               | TTL  |
|-------|-------------------|---------------------|------|
| CNAME | layofftracker     | cname.vercel-dns.com | 600  |

Then in Vercel → **Settings > Domains** → add `layofftracker.juicebokx.com`

Done. The cron scraper runs daily at 6am UTC automatically.

---

## project structure
```
src/
  app/
    layofftracker/page.tsx     ← main page (server component)
    api/
      confessions/route.ts     ← POST/GET confessions
      chat/route.ts            ← POST/GET chat messages
      cron/scrape/route.ts     ← daily layoffs.fyi scraper
  components/
    Ticker.tsx
    Nav.tsx
    Hero.tsx
    CounterStrip.tsx
    AmINext.tsx
    Confessions.tsx            ← realtime via Supabase
    Checklist.tsx
    SeveranceCalc.tsx
    WhatNow.tsx
    Timeline.tsx               ← reads from DB
    FooterCTA.tsx
    ChatRoom.tsx               ← realtime via Supabase
  lib/
    supabase.ts                ← client + admin instances
supabase-schema.sql            ← run once in Supabase SQL editor
vercel.json                    ← cron schedule (6am UTC daily)
```

---

## manually trigger the scraper
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://layofftracker.juicebokx.com/api/cron/scrape
```
