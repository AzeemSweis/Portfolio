import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, FileText, Terminal, Github, Linkedin, Mail } from 'lucide-react'
import { TypeWriter } from '../shared/TypeWriter'
import { Breadcrumb } from '../terminal/Breadcrumb'
import { TerminalModule } from '../terminal/TerminalModule'
import { StatusBar } from '../terminal/StatusBar'
import { trips as staticTrips } from '../../data/trips'
import { socials as staticSocials } from '../../data/socials'
import { useContent } from '../../hooks/useContent'
import { adaptTrips, adaptSocials } from '../../lib/adapters'
import type { ApiTrip, ApiSocialLink } from '../../lib/adapters'
import type { Trip } from '../../data/trips'
import type { SocialLink } from '../../data/socials'

const RESUME_PATH = '/pdf/azeemsweis_resume.pdf'

const DEFAULT_CONFIG: Record<string, string> = {
  hero_title: "Hey, I'm Azeem",
  hero_subtitle: 'DevOps Engineer',
  hero_tagline:
    'Architecting scalable infrastructure and automating the future. I specialize in cloud-native ecosystems, Kubernetes orchestration, and seamless CI/CD pipelines at Houzz.',
  rotating_words: JSON.stringify(['learn.', 'explore.', 'create.']),
}

const socialIconMap: Record<string, React.ElementType> = {
  Github: Github,
  Linkedin: Linkedin,
  Instagram: Mail,
  Twitter: Terminal,
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function getTripFirstImage(trip: Trip): string | undefined {
  for (const stop of trip.stops) {
    if (stop.images.length > 0) return stop.images[0]
  }
  return undefined
}

export function HeroSection() {
  const { data: config } = useContent<Record<string, string>>(
    'site-config',
    DEFAULT_CONFIG,
  )

  const { data: trips } = useContent<Trip[], ApiTrip[]>(
    'trips',
    staticTrips,
    adaptTrips,
  )

  const { data: socials } = useContent<SocialLink[], ApiSocialLink[]>(
    'socials',
    staticSocials,
    adaptSocials,
  )

  const heroTitle = config.hero_title ?? DEFAULT_CONFIG.hero_title
  const heroTagline = config.hero_tagline ?? DEFAULT_CONFIG.hero_tagline
  const rotatingWords: string[] = (() => {
    try {
      return JSON.parse(config.rotating_words ?? DEFAULT_CONFIG.rotating_words)
    } catch {
      return ['learn.', 'explore.', 'create.']
    }
  })()

  const featuredTrips = trips
    .filter(t => t.id !== 'trip-template' && t.stops.some(s => s.images.length > 0))
    .slice(0, 3)

  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Breadcrumb + terminal header */}
        <motion.div variants={itemVariants} className="font-mono space-y-3">
          <Breadcrumb page="azeem" />
          <div className="text-xl md:text-2xl">
            <span className="text-[#14ffec] font-bold">root@azeem:~$</span>{' '}
            <span className="terminal-cursor text-white"># banner --large</span>
          </div>
        </motion.div>

        {/* Hero heading */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            {heroTitle}
          </h1>
          <div className="font-mono text-[#14ffec] text-lg md:text-xl flex flex-wrap items-center gap-2">
            <span>azeem@portfolio:~$ whoami</span>
            <span className="text-[#a3a3a3]">
              {'-> DevOps Engineer | '}
              <TypeWriter
                words={rotatingWords}
                className="text-[#14ffec]"
                typingSpeed={110}
                deletingSpeed={55}
                pauseDuration={2200}
              />
            </span>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-lg text-[#a3a3a3] leading-relaxed"
        >
          {heroTagline}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 font-mono">
          <div className="w-full text-[#525252] text-sm mb-1">
            azeem@portfolio:~$ ls --actions
          </div>
          <Link
            to="/work"
            className="flex items-center gap-2 bg-[#14ffec] text-[#0a0a0a] px-6 py-3 font-bold rounded hover:brightness-110 transition-all"
          >
            <Play size={16} strokeWidth={2} />
            ./view_projects.sh
          </Link>
          <a
            href={RESUME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#14ffec]/50 text-[#14ffec] px-6 py-3 font-bold rounded hover:bg-[#14ffec]/10 transition-all"
          >
            <FileText size={16} strokeWidth={2} />
            cat resume.pdf
          </a>
        </motion.div>

        {/* Status bar */}
        <motion.div variants={itemVariants}>
          <StatusBar />
        </motion.div>

        {/* 2-column modules */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Work services */}
          <TerminalModule label="WORK_SERVICES" headerRight="Uptime: 99.99%">
            <div className="p-6 space-y-5 font-mono text-sm">
              <div className="border-l-2 border-[#14ffec]/40 pl-4 py-1">
                <div className="text-[#14ffec] font-bold">DevOps Engineer @ Houzz</div>
                <div className="text-[#525252] text-xs mt-0.5">2024 - PRESENT</div>
                <p className="text-[#a3a3a3] mt-2 leading-relaxed">
                  Managing EKS + kops Kubernetes clusters, Jenkins/ArgoCD pipelines, and
                  AWS infrastructure with Terraform and Helm.
                </p>
              </div>
              <div className="border-l-2 border-white/10 pl-4 py-1">
                <div className="text-white font-bold opacity-80">SWE &amp; DevOps — Earlier Roles</div>
                <div className="text-[#525252] text-xs mt-0.5">2021 - 2024</div>
                <p className="text-[#a3a3a3] mt-2 leading-relaxed">
                  Graduated UNR CS, worked on infrastructure, automation, and cloud migrations.
                </p>
              </div>
              <Link
                to="/work"
                className="inline-block text-[#14ffec] font-bold hover:underline"
              >
                VIEW FULL RESUME →
              </Link>
            </div>
          </TerminalModule>

          {/* Biography */}
          <TerminalModule label="BIOGRAPHY.LOG">
            <div className="p-6 font-mono text-sm leading-relaxed text-[#a3a3a3] flex flex-col gap-4 h-full">
              <p>
                <span className="text-[#14ffec] font-bold">&gt; START LOG:</span> Born in Los
                Angeles, raised in Las Vegas. CS grad from UNR, now building cloud-native
                automation at Houzz.
              </p>
              <p>
                Outside the terminal — avid hiker, traveler, and photographer (Nikon). Currently
                experimenting with Go and edge computing paradigms.
              </p>
              <Link
                to="/about"
                className="inline-block text-[#14ffec] font-bold hover:underline mt-2"
              >
                READ MORE →
              </Link>
            </div>
          </TerminalModule>
        </motion.div>

        {/* Travel module — full width */}
        <motion.div variants={itemVariants}>
          <TerminalModule label="JOURNEYS.MD">
            <div className="p-6">
              {featuredTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredTrips.map(trip => {
                    const img = getTripFirstImage(trip)
                    return (
                      <div key={trip.id} className="space-y-3">
                        {img ? (
                          <img
                            src={img}
                            alt={trip.name}
                            className="w-full h-32 object-cover rounded border border-white/10 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-32 rounded border border-white/10 bg-[#1a1a1a] flex items-center justify-center">
                            <span className="text-[#525252] font-mono text-xs">NO IMG</span>
                          </div>
                        )}
                        <div className="font-mono text-xs">
                          <div className="text-white font-bold">{trip.name}</div>
                          <div className="text-[#525252]">Status: Completed | {trip.location}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="font-mono text-sm text-[#525252]">No trip logs found.</div>
              )}
              <div className="mt-6 text-right">
                <Link
                  to="/travel"
                  className="inline-block text-[#14ffec] font-mono text-sm font-bold hover:underline"
                >
                  VIEW ALL TRIPS →
                </Link>
              </div>
            </div>
          </TerminalModule>
        </motion.div>

        {/* Social badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
          {socials.map(social => {
            const Icon = socialIconMap[social.icon] ?? Terminal
            const displayUrl = social.url.replace(/^https?:\/\//, '')
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex items-center gap-2 font-mono text-xs border border-white/10 px-4 py-2 rounded hover:bg-white/5 hover:border-[#14ffec]/40 transition-all text-[#a3a3a3] hover:text-[#14ffec]"
              >
                <Icon size={14} strokeWidth={1.5} />
                {displayUrl}
              </a>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}
