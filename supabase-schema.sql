-- ============================================
-- LAYOFF TRACKER — SUPABASE SCHEMA
-- Paste this entire file into Supabase SQL Editor
-- and hit Run. Do it once on a fresh project.
-- ============================================

-- 1. CONFESSIONS
-- Anonymous submissions shown on the page
create table if not exists confessions (
  id          uuid primary key default gen_random_uuid(),
  text        text not null check (char_length(text) between 10 and 280),
  created_at  timestamptz default now()
);

-- Anyone can read confessions
alter table confessions enable row level security;
create policy "public read confessions"
  on confessions for select using (true);
create policy "public insert confessions"
  on confessions for insert with check (char_length(text) between 10 and 280);

-- 2. CHAT MESSAGES
-- Live waiting room chat
create table if not exists chat_messages (
  id          uuid primary key default gen_random_uuid(),
  username    text not null check (char_length(username) between 1 and 30),
  text        text not null check (char_length(text) between 1 and 300),
  created_at  timestamptz default now()
);

-- Keep only last 200 messages (auto-cleanup via trigger)
alter table chat_messages enable row level security;
create policy "public read chat"
  on chat_messages for select using (true);
create policy "public insert chat"
  on chat_messages for insert with check (
    char_length(text) between 1 and 300
    and char_length(username) between 1 and 30
  );

-- Auto-delete old messages keeping latest 200
create or replace function trim_chat_messages()
returns trigger language plpgsql as $$
begin
  delete from chat_messages
  where id in (
    select id from chat_messages
    order by created_at desc
    offset 200
  );
  return null;
end;
$$;

create trigger trim_chat_after_insert
  after insert on chat_messages
  for each statement execute function trim_chat_messages();

-- 3. LAYOFF EVENTS
-- Populated daily by the Vercel cron scraper
create table if not exists layoff_events (
  id          uuid primary key default gen_random_uuid(),
  company     text not null,
  num_laid_off integer,
  date        date not null,
  industry    text,
  stage       text,
  country     text default 'United States',
  source_url  text,
  notes       text,
  created_at  timestamptz default now(),
  -- Prevent duplicates from re-scraping
  unique(company, date)
);

alter table layoff_events enable row level security;
create policy "public read layoffs"
  on layoff_events for select using (true);

-- 4. REALTIME
-- Enable realtime on chat_messages so clients get live updates
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table confessions;

-- 5. INDEXES for common queries
create index on layoff_events (date desc);
create index on confessions (created_at desc);
create index on chat_messages (created_at desc);

-- ============================================
-- SEED: a few starter confessions so page 
-- doesn't look empty on launch
-- ============================================
insert into confessions (text) values
  ('got laid off on a tuesday. they scheduled a 9am "check in" with no agenda. i knew.'),
  ('applied to 47 jobs in 3 weeks. heard back from 2. one ghosted after the third round.'),
  ('my manager cried on the call. that somehow made it worse.'),
  ('first thing i did after the call was close my laptop and go for a walk. best decision i made.'),
  ('the worst part isn''t the job. it''s explaining it to people who don''t work in tech.');
