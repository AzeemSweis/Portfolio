export interface Project {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  liveUrl?: string
  repoUrl?: string
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'This Portfolio',
    description:
      'A full rebuild of my personal portfolio site — migrated from a ~2020 static HTML/CSS/jQuery site to a modern React SPA with TypeScript, Tailwind CSS, Framer Motion animations, and client-side routing.',
    image: '/images/WorkSnips/mysite.png',
    tags: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion'],
    liveUrl: '/',
    repoUrl: 'https://github.com/AzeemSweis',
  },
  {
    id: 'petra',
    title: 'Petra Commercial Building',
    description:
      'Freelance contract to build a landing site for a commercial building in Oakland, CA. Incorporated Google Maps API and focused on multi-device responsiveness with Bootstrap grid.',
    image: '/images/WorkSnips/pbo.png',
    tags: ['HTML', 'CSS', 'Bootstrap', 'Google Maps API'],
    liveUrl: 'https://azeemsweis.github.io/PetraBuildingOakland/',
    repoUrl: 'https://github.com/AzeemSweis/PetraBuildingOakland',
  },
  {
    id: 'bookkeeping',
    title: 'Sweis Bookkeeping',
    description:
      "Freelance site built for my father's side bookkeeping business. My first post-graduation frontend project — practiced Bootstrap components, carousel, cards, and responsive layout.",
    image: '/images/WorkSnips/swsbook.png',
    tags: ['HTML', 'CSS', 'Bootstrap'],
    liveUrl: 'https://azeemsweis.github.io/Sweis-Bookkeeping/',
    repoUrl: 'https://github.com/AzeemSweis/Sweis-Bookkeeping',
  },
]
