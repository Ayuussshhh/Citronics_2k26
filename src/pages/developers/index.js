import Head from 'next/head'
import Box from '@mui/material/Box'
import PublicNavbar from 'src/views/home/PublicNavbar'
import PublicFooter from 'src/views/home/PublicFooter'
import DevelopersTeamSection from 'src/components/DevelopersTeamSection'

/**
 * Developers Team Page
 */
const DevelopersPage = () => {
  const teamMembers = [
   
    {
      name: 'Bhavik Joshi',
      designation: 'Developer',
      imageSrc: '#',
      socialLinks: [
        { icon: 'tabler:brand-github', href: 'https://github.com/Bhav-ikkk', label: 'GitHub' },
        { icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/bhavik-joshi-6811a9290/', label: 'LinkedIn' },
        { icon: 'tabler:briefcase', href: '#', label: 'Portfolio' }
      ]
    },
    {
      name: 'Ayush Agrawal',
      designation: 'Developer',
      imageSrc: '#',
      socialLinks: [
        { icon: 'tabler:brand-github', href: 'https://github.com/Ayuussshhh', label: 'GitHub' },
        { icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/ayush-agrawal-869940290/', label: 'LinkedIn' },
        { icon: 'tabler:briefcase', href: '#', label: 'Portfolio' }
      ]
    },
     {
      name: 'kanchan Sharma',
      designation: 'Developer',
      imageSrc: '#',
      socialLinks: [
        { icon: 'tabler:brand-github', href: 'https://github.com/kanchan0505', label: 'GitHub' },
        { icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/kanchan-sharma-ba980828b/', label: 'LinkedIn' },
        { icon: 'tabler:briefcase', href: 'https://starfall-portfolio.vercel.app', label: 'Portfolio' }
      ]
    },
  ]

  return (
    <>
      <Head>
        <title>Development Team | Citronics</title>
        <meta name='description' content='Meet our talented development team building innovative solutions for sustainable technology.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Box component='main' sx={{ overflowX: 'hidden', bgcolor: 'background.default', minHeight: '100vh', pb: { xs: 'calc(64px + env(safe-area-inset-bottom, 0px))', md: 0 } }}>
        <PublicNavbar />
        <Box sx={{ pt: { xs: 1, md: 4 }, pb: { xs: 4, md: 6 } }}>
          <DevelopersTeamSection
            title='DEVELOPMENT TEAM'
            description='We developed the website with passion and dedication to create an exceptional user experience.'
            members={teamMembers}
          />
        </Box>
        <PublicFooter />
      </Box>
    </>
  )
}

// ── Page-level config ─────────────────────────────────────────────────────────
DevelopersPage.authGuard = false
DevelopersPage.guestGuard = false
DevelopersPage.getLayout = page => page

export default DevelopersPage
