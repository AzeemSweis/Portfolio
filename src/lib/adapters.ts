/**
 * Adapter functions that transform API response shapes into the frontend
 * TypeScript interfaces. The API uses snake_case; the existing interfaces
 * use camelCase. Adapters live here so the rendering components stay unchanged.
 */

import type { Project } from '../data/projects'
import type { SkillCategory } from '../data/skills'
import type { SocialLink } from '../data/socials'
import type { Trip } from '../data/trips'

// ---------------------------------------------------------------------------
// Raw API response types (snake_case from the backend)
// ---------------------------------------------------------------------------

export interface ApiProject {
  id: number
  slug: string
  title: string
  description: string
  image_url: string | null
  tags: string[]
  live_url: string | null
  repo_url: string | null
  sort_order: number
}

export interface ApiSkill {
  id: number
  name: string
  sort_order: number
}

export interface ApiSkillCategory {
  id: number
  name: string
  skills: ApiSkill[]
  sort_order: number
}

export interface ApiSocialLink {
  id: number
  name: string
  url: string
  icon: 'Github' | 'Linkedin' | 'Instagram' | 'Twitter'
  sort_order: number
}

export interface ApiExperience {
  id: number
  role: string
  company: string
  period: string
  is_current: boolean
  bullets: string[]
  sort_order: number
}

export interface ApiTripStop {
  id: number
  name: string
  paragraphs: string[]
  images: string[]
  sort_order: number
}

export interface ApiTrip {
  id: number
  slug: string
  location: string
  name: string
  subtitle: string
  stops: ApiTripStop[]
  sort_order: number
}

// ---------------------------------------------------------------------------
// Adapters — API shape → frontend interface shape
// ---------------------------------------------------------------------------

export function adaptProject(p: ApiProject): Project {
  return {
    id: p.slug,
    title: p.title,
    description: p.description,
    image: p.image_url ?? undefined,
    tags: p.tags,
    liveUrl: p.live_url ?? undefined,
    repoUrl: p.repo_url ?? undefined,
  }
}

export function adaptProjects(projects: ApiProject[]): Project[] {
  return projects.map(adaptProject)
}

export function adaptSkillCategory(c: ApiSkillCategory): SkillCategory {
  return {
    name: c.name,
    skills: c.skills.map(s => s.name),
  }
}

export function adaptSkillCategories(categories: ApiSkillCategory[]): SkillCategory[] {
  return categories.map(adaptSkillCategory)
}

/** SocialLink shapes are close enough — just strip the extra fields. */
export function adaptSocials(socials: ApiSocialLink[]): SocialLink[] {
  return socials.map(s => ({
    name: s.name,
    url: s.url,
    icon: s.icon,
  }))
}

export function adaptTrip(t: ApiTrip): Trip {
  return {
    id: t.slug,
    location: t.location,
    name: t.name,
    subtitle: t.subtitle,
    stops: t.stops.map(stop => ({
      name: stop.name,
      paragraphs: stop.paragraphs,
      images: stop.images,
    })),
  }
}

export function adaptTrips(trips: ApiTrip[]): Trip[] {
  return trips.map(adaptTrip)
}

/** Experience entries map closely — only `is_current` → `current` differs. */
export interface ExperienceEntry {
  role: string
  company: string
  period: string
  current: boolean
  bullets: string[]
}

export function adaptExperience(entries: ApiExperience[]): ExperienceEntry[] {
  return entries.map(e => ({
    role: e.role,
    company: e.company,
    period: e.period,
    current: e.is_current,
    bullets: e.bullets,
  }))
}
