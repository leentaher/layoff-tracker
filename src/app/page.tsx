import Ticker from '@/components/Ticker'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ToolsSection from '@/components/ToolsSection'
import Community from '@/components/Community'
import WaitingRoom from '@/components/WaitingRoom'
import StatsSection from '@/components/StatsSection'
import NCMission from '@/components/NCMission'
import TeamBios from '@/components/TeamBios'
import AboutJuicebokx from '@/components/AboutJuicebokx'
import TwitterFeed from '@/components/TwitterFeed'
import FooterCTA from '@/components/FooterCTA'
import ChatRoom from '@/components/ChatRoom'

export const revalidate = 3600

export default function LayoffTrackerPage() {
  return (
    <>
      <Ticker />
      <Nav />

      <Hero />
      <ToolsSection />
      <Community />
      <WaitingRoom />
      <StatsSection />
      <NCMission />
      <TeamBios />
      <AboutJuicebokx />
      <TwitterFeed />
      <FooterCTA />
      <ChatRoom />
    </>
  )
}
