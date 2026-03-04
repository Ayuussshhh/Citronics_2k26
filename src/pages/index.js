import Box from '@mui/material/Box'
import PublicNavbar from 'src/views/home/PublicNavbar'
import HeroSection from 'src/views/home/HeroSection'
import AboutSection from 'src/views/home/AboutSection'
import UpcomingEventsScroller from 'src/views/home/UpcomingEventsScroller'
import StatsSection from 'src/views/home/StatsSection'
import FeaturedEvents from 'src/views/home/FeaturedEvents'
import TestimonialsSection from 'src/views/home/TestimonialsSection'
import SponsorsSection from 'src/views/home/SponsorsSection'
import PublicFooter from 'src/views/home/PublicFooter'
import eventService from 'src/services/event-service'

/**
 * Public Home Page — Citronics 2026
 * Visible to all visitors. No authentication required.
 * Featured & upcoming events are fetched server-side via getServerSideProps.
 */
const Home = ({ featuredEvents, upcomingEvents }) => {
  return (
    <Box sx={{ overflowX: 'hidden', pb: { xs: 'calc(64px + env(safe-area-inset-bottom, 0px))', md: 0 } }}>
      <PublicNavbar />
      <HeroSection />
      <UpcomingEventsScroller events={upcomingEvents} />
      <AboutSection />
      <StatsSection />
      <FeaturedEvents events={featuredEvents} />
      <TestimonialsSection />
      <SponsorsSection />
      <PublicFooter />
    </Box>
  )
}

// ── Page-level config ─────────────────────────────────────────────────────────
// Public page — no auth guard, no guest guard, no layout wrapper
Home.authGuard = false
Home.guestGuard = false
Home.getLayout = page => page

export default Home

// ── Server-side data fetching ─────────────────────────────────────────────────
export async function getServerSideProps() {
  try {
    const [featuredEvents, upcomingEvents] = await Promise.all([
      eventService.getFeaturedEvents(3),
      eventService.getPublishedEvents({ limit: 10, sort: 'newest' })
    ])

    return {
      props: {
        featuredEvents: JSON.parse(JSON.stringify(featuredEvents || [])),
        upcomingEvents: JSON.parse(JSON.stringify(upcomingEvents || []))
      }
    }
  } catch (error) {
    console.error('[Home SSR]', error)

    return {
      props: {
        featuredEvents: [],
        upcomingEvents: []
      }
    }
  }
}
