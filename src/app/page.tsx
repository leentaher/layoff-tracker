import { supabaseAdmin } from '@/lib/supabase'
import Ticker from '@/components/Ticker'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CounterStrip from '@/components/CounterStrip'
import AmINext from '@/components/AmINext'
import Confessions from '@/components/Confessions'
import Checklist from '@/components/Checklist'
import SeveranceCalc from '@/components/SeveranceCalc'
import HealthcareCalc from '@/components/HealthcareCalc'
import WhatNow from '@/components/WhatNow'
import Timeline from '@/components/Timeline'
import TwitterFeed from '@/components/TwitterFeed'
import Community from '@/components/Community'
import FooterCTA from '@/components/FooterCTA'
import ChatRoom from '@/components/ChatRoom'
import GatePopup from '@/components/GatePopup'

export const revalidate = 3600 // revalidate page every hour

async function getInitialData() {
  const db = supabaseAdmin()

  const [{ data: confessions }, { data: layoffs }] = await Promise.all([
    db
      .from('confessions')
      .select('id, text, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    db
      .from('layoff_events')
      .select('*')
      .order('date', { ascending: false })
      .limit(50),
  ])

  return {
    confessions: confessions ?? [],
    layoffs: layoffs ?? [],
  }
}

export default async function LayoffTrackerPage() {
  const { confessions, layoffs } = await getInitialData()

  const totalLaidOff = layoffs.reduce((sum, e) => sum + (e.num_laid_off ?? 0), 0)
  const companiesCount = new Set(layoffs.map((e) => e.company)).size

  return (
    <>
      <GatePopup />
      <Ticker />
      <Nav />
      <Hero />
      <CounterStrip total={totalLaidOff} companies={companiesCount} />
      <TwitterFeed />
      <WhatNow />
      <AmINext />
      <SeveranceCalc />
      <HealthcareCalc />
      <Confessions initialConfessions={confessions} />
      <Checklist />
      <Timeline layoffs={layoffs} />
      <Community />
      <FooterCTA />
      <ChatRoom />
    </>
  )
}
