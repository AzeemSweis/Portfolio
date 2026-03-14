# Project: Portfolio

## Overview

Personal portfolio website for Azeem Sweis, a DevOps/Infrastructure Engineer at Houzz. This is a full modernization of an existing ~2020 static HTML/CSS/jQuery site, rebuilt as a React SPA with modern design, animations, and updated content reflecting his current career. The site serves as a professional presence and personal expression (travel stories, photography).

## Project Type

webapp (static SPA -- no backend)

## Tech Stack

- **Frontend**: React 18 + Vite -- workspace default, fast builds, great DX for a static SPA
- **Styling**: Tailwind CSS v4 -- utility-first, easy dark theme, responsive design without writing custom CSS
- **Animations**: Framer Motion -- declarative scroll-based and page-transition animations for React
- **Routing**: React Router v7 -- client-side routing for SPA with clean URLs
- **Icons**: Lucide React -- replace PNG social icons with crisp SVG icons, tree-shakeable
- **Fonts**: Inter (body) + JetBrains Mono (monospace accents) via Google Fonts
- **Deployment**: Vercel -- zero-config for Vite SPAs, preview deploys on PRs, custom domain support

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `brand` | `#14ffec` | Accent color, links, highlights (carried from existing site) |
| `bg-primary` | `#0a0a0a` | Page background |
| `bg-secondary` | `#141414` | Card/section backgrounds |
| `bg-tertiary` | `#1e1e1e` | Navbar, elevated surfaces |
| `text-primary` | `#f5f5f5` | Headings |
| `text-secondary` | `#a3a3a3` | Body text |
| `text-muted` | `#525252` | Subtle text, timestamps |

### Typography

- **Headings**: Inter, 700 weight
- **Body**: Inter, 400 weight
- **Code/monospace accents**: JetBrains Mono (used for the rotating text on home, section labels, tech tags)
- Base size: 16px, scale: 1.25 (major third)

### Spacing & Layout

- Max content width: 1200px, centered
- Section padding: 96px vertical (desktop), 64px (mobile)
- Component gap: 24px standard, 48px between major sections
- Border radius: 8px for cards, 12px for images, full-round for avatar

## Pages & Components

### Shared Layout

```
<App>
  <Navbar />           -- sticky top, transparent bg with blur, brand name left, nav links right
  <AnimatePresence>     -- page transition wrapper
    <Outlet />          -- React Router renders active page here
  </AnimatePresence>
  <Footer />            -- social links, copyright, minimal
</App>
```

**Navbar**: Sticky, backdrop-blur, transparent background. Logo/name on left ("AS" monogram or "azeem sweis" in monospace). Nav links on right: Home, About, Work, Travel. Mobile: hamburger menu with slide-in drawer. Active link gets `brand` color underline.

**Footer**: Centered row of social icon links (GitHub, LinkedIn, Instagram, X/Twitter). Copyright line below. Appears on all pages.

### Page: Home (`/`)

The landing page. Full viewport height hero section.

**Layout**:
- Full-screen centered content, vertically and horizontally
- Animated typing text: "I live to" + rotating words ["learn.", "explore.", "create."] -- reimplement the existing TxtRotate effect using a React hook or Framer Motion
- Subtitle: "My name is **Azeem Sweis**, and I'm a DevOps Engineer." (name in brand color)
- Below: three navigation cards/links to Work, About, Travel -- styled as minimal bordered cards with hover glow effect
- Social icons row at bottom of hero

**Animations**:
- Text typing effect on the rotating words (preserve existing behavior)
- Fade-in-up on subtitle and nav cards (staggered, on mount)
- Nav card hover: subtle border-glow in brand color

**Components**:
- `HeroSection` -- full viewport container
- `TypeWriter` -- rotating text animation (rewrite as React component using `useEffect`/`useState`)
- `NavCards` -- three links to other pages
- `SocialLinks` -- row of Lucide icon links (reused in Footer)

### Page: About (`/about`)

**Layout**:
- Page title: "Who I am." with typewriter-cursor animation (CSS only, like current site)
- Two-column layout below (stacks on mobile):
  - Left: profile picture (circular crop, existing `pfp.png`) with subtle border or shadow
  - Right: bio text, updated to reflect current role

**Updated bio content** (to be finalized during implementation):
> Born in Los Angeles and raised in Las Vegas, I studied Computer Science and Engineering at the University of Nevada, Reno. Today I work as a DevOps Engineer at Houzz, where I manage Kubernetes clusters, CI/CD pipelines, and cloud infrastructure on AWS. I'm passionate about building reliable systems and automating everything I can. When I'm not working, I'm usually exploring the outdoors -- whether it's camping in southern Utah or road-tripping up the California coast.

**Below bio -- Skills/Technologies grid**:
- Grid of technology badges/pills organized by category
- Categories: **Cloud & Infrastructure** (AWS, Terraform, Kubernetes, Docker, Helm), **CI/CD** (Jenkins, GitHub Actions, CircleCI, ArgoCD), **Observability** (Prometheus, VictoriaMetrics, Grafana, Istio), **Languages & Tools** (Python, Bash, Go, Git)
- Each pill: dark bg, brand-color border on hover, subtle

**Animations**:
- Profile image fades in from left, text fades in from right
- Skill pills stagger-animate in on scroll (Framer Motion `whileInView`)

**Components**:
- `PageTitle` -- reusable, takes string, renders with typewriter-cursor CSS animation
- `BioSection` -- image + text two-column
- `SkillsGrid` -- category labels + pill badges

### Page: Work (`/work`)

**Layout**:
- Page title: "What I do." with typewriter-cursor animation
- **Resume section**: "Download Resume" button (links to `/pdf/azeemsweis_resume.pdf`, opens in new tab). On desktop, optionally show an embedded PDF viewer or a styled resume summary. On mobile, just the download button.
- Divider
- **Projects section**: Card grid (2 columns desktop, 1 mobile). Each card has:
  - Screenshot/image (or icon for DevOps projects without screenshots)
  - Project title
  - Short description
  - Tech tags (pills)
  - Link to live site or GitHub repo

**Project cards to include** (content to be finalized):
1. **This Portfolio** -- React, Vite, Tailwind, Framer Motion. Link: self.
2. **Petra Commercial Building** -- freelance site for Oakland commercial building. Link: existing GitHub Pages URL.
3. **Sweis Bookkeeping** -- freelance site for family business. Link: existing GitHub Pages URL.
4. Additional DevOps/infra projects can be added later as placeholders with a "coming soon" or linking to GitHub repos.

**Animations**:
- Cards fade-in-up on scroll, staggered
- Download button hover effect

**Components**:
- `PageTitle` (reused)
- `ResumeSection` -- download button + optional embed
- `ProjectCard` -- image, title, description, tags, link
- `ProjectsGrid` -- maps over project data array, renders `ProjectCard`s

### Page: Travel (`/travel`)

**Layout**:
- Page title: "Where I've Been." with typewriter-cursor animation
- Intro paragraph
- **Google Maps embed** -- keep existing embedded map (iframe with custom Google My Maps URL)
- Divider
- **Trip story: Grand Staircase Escalante**
  - Section header with location label ("Utah") and trip name
  - Sub-sections for each stop: Calf Creek Falls, Spooky Canyon Loop, Hell's Backbone Rd
  - Each sub-section: narrative text + photo gallery
  - Photos displayed in a masonry-style or alternating layout (image left/text right, then swap)
  - All 13 GSE photos used

**Future-proofing**: Structure trip data as an array of objects so new trips (Santa Cruz, San Francisco) can be added easily by just adding to the data file.

**Animations**:
- Photos fade/slide in on scroll
- Section headers animate in
- Parallax-lite effect on hero images within sections (optional, subtle)

**Components**:
- `PageTitle` (reused)
- `MapEmbed` -- responsive iframe wrapper for Google Maps
- `TripSection` -- renders a full trip story from data
- `TripStop` -- sub-section with title banner + photo/text content
- `PhotoGallery` -- responsive image grid within a trip stop

## Data Layer

No database. All content is static, defined in JS/TS data files.

### `src/data/projects.ts`

```ts
interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;        // path to screenshot in public/images/
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}
```

### `src/data/skills.ts`

```ts
interface SkillCategory {
  name: string;
  skills: string[];
}
```

### `src/data/trips.ts`

```ts
interface TripStop {
  name: string;
  paragraphs: string[];   // text blocks, alternated with images
  images: string[];        // paths to photos in public/images/
}

interface Trip {
  id: string;
  location: string;        // "Utah"
  name: string;            // "Grand Staircase Escalante"
  subtitle: string;
  stops: TripStop[];
}
```

### `src/data/socials.ts`

```ts
interface SocialLink {
  name: string;
  url: string;
  icon: string;   // Lucide icon name
}
```

Social links to include:
- GitHub: https://github.com/AzeemSweis
- LinkedIn: https://www.linkedin.com/in/azeem-sweis/
- Instagram: https://www.instagram.com/a_sweis/
- X (Twitter): https://twitter.com/azeem_sweis

## File Structure

```
Portfolio/
  SPEC.md
  README.md
  Makefile
  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  vercel.json
  index.html
  public/
    images/
      pfp.png
      GrandStairs/         -- 13 GSE photos (GSE1-13.jpg)
      SantaCruz/           -- 4 photos (kept for future use)
      WorkSnips/           -- 3 project screenshots
    pdf/
      azeemsweis_resume.pdf
    favicon.ico            -- generate from brand color or initials
  src/
    main.tsx
    App.tsx
    index.css              -- Tailwind directives, custom font imports, CSS vars
    components/
      layout/
        Navbar.tsx
        Footer.tsx
        PageTransition.tsx  -- Framer Motion AnimatePresence wrapper
      shared/
        PageTitle.tsx
        SocialLinks.tsx
        TypeWriter.tsx
      home/
        HeroSection.tsx
        NavCards.tsx
      about/
        BioSection.tsx
        SkillsGrid.tsx
      work/
        ResumeSection.tsx
        ProjectCard.tsx
        ProjectsGrid.tsx
      travel/
        MapEmbed.tsx
        TripSection.tsx
        TripStop.tsx
        PhotoGallery.tsx
    pages/
      HomePage.tsx
      AboutPage.tsx
      WorkPage.tsx
      TravelPage.tsx
    data/
      projects.ts
      skills.ts
      trips.ts
      socials.ts
    hooks/
      useTypewriter.ts     -- custom hook for rotating text effect
```

## Vercel / Deployment Config

### `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures React Router handles all routes (SPA fallback).

### Build settings (auto-detected by Vercel for Vite)

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Makefile Targets

```makefile
help      -- show available targets
dev       -- start Vite dev server (port 5173)
build     -- production build to dist/
preview   -- preview production build locally
test      -- run tests (vitest)
lint      -- run eslint
format    -- run prettier
clean     -- remove dist/ and node_modules/
```

## Key Decisions

1. **TypeScript over JavaScript** -- type safety for component props and data structures, catches errors early with zero runtime cost.

2. **Static data files instead of CMS** -- the content changes rarely and there's a single author. Data files in the repo keep it simple with zero external dependencies.

3. **Framer Motion over CSS-only animations** -- the scroll-triggered animations and page transitions are significantly easier to build and maintain with Framer Motion than with Intersection Observer + CSS classes.

4. **Lucide React over PNG icons** -- SVG icons scale perfectly, can be styled with Tailwind classes (color, size), and don't require managing image assets. Tree-shakeable so bundle only includes used icons.

5. **SPA with client-side routing over multi-page** -- keeps the site feeling fast with instant page transitions. Vercel rewrite rule handles direct URL access / refreshes.

6. **Keep existing image assets in `public/`** -- these are static assets that don't need processing by Vite. They're referenced by path in the data files.

7. **Inter + JetBrains Mono over Anonymous Pro + Montserrat** -- modern, highly legible font pairing. Inter is the de facto standard for web UIs in 2026. JetBrains Mono preserves the "coder" aesthetic of the original Anonymous Pro but with better readability.

8. **No SSR/SSG** -- this is a personal portfolio with no SEO-critical dynamic content. A client-rendered SPA deployed on Vercel is fast enough and far simpler than Next.js. If SEO becomes a concern later, migrating to Astro or Next would be straightforward.

9. **Dark theme only** -- the existing site is dark-themed and it fits the aesthetic. No need for a light/dark toggle on a personal portfolio.

10. **Move assets from repo root to `public/`** -- during migration, copy `images/`, `pdf/`, and any needed icons into `public/` so Vite serves them correctly. The old `css/`, `scripts/`, `pages/`, and `icons/` directories are replaced entirely by the React app.

## Implementation Order

1. **Scaffold the Vite + React + TypeScript project** -- `npm create vite@latest`, install Tailwind v4, Framer Motion, React Router v7, Lucide React. Set up `tsconfig.json`, `tailwind.config.ts`, `index.css` with design tokens.

2. **Move existing assets** -- copy `images/` and `pdf/` into `public/`. Verify paths work in dev server.

3. **Build the layout shell** -- `App.tsx` with React Router, `Navbar`, `Footer`, `PageTransition`. Get routing working between four empty pages.

4. **Build the Home page** -- `HeroSection`, `TypeWriter` hook, `NavCards`, `SocialLinks`. This is the first page visitors see, so get the visual tone right here.

5. **Build the About page** -- `PageTitle`, `BioSection` with updated content, `SkillsGrid`. Wire up scroll animations.

6. **Build the Work page** -- `ResumeSection` with download link, `ProjectsGrid` with `ProjectCard`s. Populate `projects.ts` data.

7. **Build the Travel page** -- `MapEmbed`, `TripSection`, `TripStop`, `PhotoGallery`. Populate `trips.ts` with Grand Staircase Escalante content (text already exists in current HTML).

8. **Responsive polish** -- test all pages at mobile (375px), tablet (768px), desktop (1280px+). Fix any layout issues.

9. **Animation polish** -- tune Framer Motion timings, add page transitions, ensure scroll animations feel smooth and not excessive.

10. **Deployment** -- add `vercel.json`, connect GitHub repo to Vercel, deploy from `main` branch. Verify all routes, assets, and the resume PDF work in production.

11. **Cleanup** -- remove old `css/`, `scripts/`, `pages/`, `icons/` directories and root `index.html` once the new site is confirmed working. Update `README.md`.

## Migration Notes

- The old site is deployed on GitHub Pages from the `colors` branch. The new site will deploy from `main` on Vercel. Both can coexist during migration.
- The old `index.html`, `pages/*.html`, `css/*.css`, `scripts/*.js`, and `icons/*.png` files should be removed after the new site is live and verified.
- The Google Maps embed URL (`https://www.google.com/maps/d/u/0/embed?mid=1zG8XoQfSdIrTXKn2mloaqb-Q2HwCcosY`) should be preserved as-is.
- All travel narrative text from `travel.html` should be migrated into `src/data/trips.ts`.
- The Santa Cruz content (currently commented out in `travel.html`) should be included in the data file but can remain hidden/unlinked in the initial launch. Easy to enable later.

## Out of Scope

- **Blog/CMS** -- no writing platform. If wanted later, that's a separate project.
- **Contact form** -- no backend to receive submissions. LinkedIn link is sufficient.
- **Analytics** -- can be added later via Vercel Analytics or Plausible, but not in initial build.
- **Light theme toggle** -- dark only.
- **i18n / localization** -- English only.
- **Automated tests beyond linting** -- this is a static portfolio, not a SaaS app. Visual QA is sufficient.
- **Image optimization pipeline** -- images are already reasonably sized. Can add `vite-imagetools` later if needed.
- **Custom domain setup** -- handled in Vercel dashboard, not in code.
