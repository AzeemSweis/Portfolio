import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderOpen,
  Briefcase,
  Map,
  Cpu,
  Share2,
  User,
  ArrowRight,
} from 'lucide-react'
import { adminFetch } from './api'
import { TerminalModule } from '../components/terminal/TerminalModule'
import { TerminalPrompt } from '../components/terminal/TerminalPrompt'

interface Stats {
  projects: number
  experience: number
  trips: number
  skills: number
  socials: number
}

const sections = [
  {
    label: 'Bio',
    key: null,
    to: '/admin/bio',
    icon: User,
    description: 'Edit hero, tagline, and bio paragraphs',
  },
  {
    label: 'Projects',
    key: 'projects' as keyof Stats,
    to: '/admin/projects',
    icon: FolderOpen,
    description: 'Add, edit, or reorder projects',
  },
  {
    label: 'Experience',
    key: 'experience' as keyof Stats,
    to: '/admin/experience',
    icon: Briefcase,
    description: 'Manage work history entries',
  },
  {
    label: 'Trips',
    key: 'trips' as keyof Stats,
    to: '/admin/trips',
    icon: Map,
    description: 'Manage travel entries and stops',
  },
  {
    label: 'Skills',
    key: 'skills' as keyof Stats,
    to: '/admin/skills',
    icon: Cpu,
    description: 'Edit skill categories and items',
  },
  {
    label: 'Socials',
    key: 'socials' as keyof Stats,
    to: '/admin/socials',
    icon: Share2,
    description: 'Manage social media links',
  },
]

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, experience, trips, skills, socials] =
          await Promise.all([
            adminFetch('/api/admin/projects').then(r => r.json()),
            adminFetch('/api/admin/experience').then(r => r.json()),
            adminFetch('/api/admin/trips').then(r => r.json()),
            adminFetch('/api/admin/skills').then(r => r.json()),
            adminFetch('/api/admin/socials').then(r => r.json()),
          ])

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          experience: Array.isArray(experience) ? experience.length : 0,
          trips: Array.isArray(trips) ? trips.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          socials: Array.isArray(socials) ? socials.length : 0,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <TerminalPrompt
          user="root"
          command="status --all"
          className="mb-3"
        />
        <p className="font-sans text-[#a3a3a3] text-sm">
          Portfolio admin overview. Select a section to edit content.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="font-mono text-xs text-red-400">
            <span className="font-bold">WARN:</span> Could not fetch live stats
            — API may not be running. Editing will still work once the backend
            is up.
          </p>
        </div>
      )}

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(
            [
              { label: 'Projects', value: stats.projects },
              { label: 'Experience', value: stats.experience },
              { label: 'Trips', value: stats.trips },
              { label: 'Skill Categories', value: stats.skills },
              { label: 'Socials', value: stats.socials },
            ] as const
          ).map(stat => (
            <div
              key={stat.label}
              className="bg-[#141414] border border-white/10 rounded-lg px-4 py-3"
            >
              <p className="font-mono text-2xl font-bold text-[#14ffec]">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] text-[#a3a3a3] uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Section cards */}
      <TerminalModule label="QUICK ACTIONS">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(section => (
            <Link
              key={section.to}
              to={section.to}
              className="group flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 hover:border-[#14ffec]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <section.icon
                  size={16}
                  className="text-[#14ffec] shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {section.label}
                  </p>
                  <p className="font-sans text-[11px] text-[#525252] mt-0.5">
                    {section.description}
                  </p>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-[#525252] group-hover:text-[#14ffec] transition-colors shrink-0"
              />
            </Link>
          ))}
        </div>
      </TerminalModule>

      {/* Status line */}
      <div className="font-mono text-xs text-[#525252] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
        admin session active
      </div>
    </div>
  )
}
