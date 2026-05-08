import Ticker from '@/components/Ticker'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import AmINext from '@/components/AmINext'
import Confessions from '@/components/Confessions'
import Checklist from '@/components/Checklist'
import SeveranceCalc from '@/components/SeveranceCalc'
import HealthcareCalc from '@/components/HealthcareCalc'
import WhatNow from '@/components/WhatNow'
import Timeline from '@/components/Timeline'
import TwitterFeed from '@/components/TwitterFeed'
import WaitingRoom from '@/components/WaitingRoom'
import Community from '@/components/Community'
import AboutJuicebokx from '@/components/AboutJuicebokx'
import FooterCTA from '@/components/FooterCTA'
import ChatRoom from '@/components/ChatRoom'
import GatePopup from '@/components/GatePopup'

export const revalidate = 3600 // revalidate page every hour

export default async function LayoffTrackerPage() {
  return (
    <>
      <GatePopup />
      <Ticker />
      <Nav />

      <Hero />
      <AmINext />
      <WhatNow />
      <SeveranceCalc />
      <HealthcareCalc />
      <Checklist />
      <WaitingRoom />
      <Community />
      <TwitterFeed />
      <AboutJuicebokx />
      <FooterCTA />
      <ChatRoom />
    </>
  )
}
