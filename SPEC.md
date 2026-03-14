# Project: Portfolio

## Background

Personal portfolio website for Azeem Sweis. Originally built in ~2020 as a static HTML/CSS/jQuery site using Bootstrap 4. It had four pages (Home, About, Work, Travel), was hosted on GitHub Pages from the `colors` branch, and showcased early freelance web development work (Petra Commercial Building, Sweis Bookkeeping) along with travel photography from Grand Staircase Escalante.

The site was also accessible at **azeemsw.com** via a custom DNS configuration (details TBD — needs investigation).

## What Changed (2026-03-14)

Full modernization from static HTML to a React SPA:

- **Stack**: React 18 + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + React Router v7
- **Design**: Dark theme preserved (`#14ffec` accent), new fonts (Inter + JetBrains Mono), modern spacing/layout, scroll-triggered animations, page transitions
- **Content**: Bio updated to reflect current DevOps Engineer role at Houzz. Skills grid added (AWS, K8s, Terraform, etc.). Resume PDF embedded inline on desktop with download fallback.
- **Structure**: All content driven from static data files (`src/data/*.ts`). Travel narrative text migrated from HTML into `trips.ts`. Santa Cruz trip data included but hidden for now.
- **Infra**: Added `vercel.json` for SPA routing, `Makefile`, `.gitignore`, updated `README.md`
- **Old files preserved**: The original `css/`, `scripts/`, `pages/`, `icons/` directories are still in the repo pending cleanup

Branch: `feat/modernize-portfolio` (not yet pushed/merged)

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Routing | React Router v7 |
| Icons | Lucide React |
| Fonts | Inter + JetBrains Mono |
| Deployment | Vercel (pending — currently still on GitHub Pages) |

## Pages

- **Home** (`/`): Hero with typewriter animation, nav cards, social links
- **About** (`/about`): Bio, profile photo, skills/tech grid
- **Work** (`/work`): Inline resume PDF viewer, project cards
- **Travel** (`/travel`): Google Maps embed, Grand Staircase Escalante trip story with photos

## TODO — Next Session

### Deployment & Cleanup

- [ ] Remove old static files from repo (`css/`, `scripts/`, `pages/`, `icons/`, old root `pdf/` directory)
- [ ] Push `feat/modernize-portfolio` branch and merge to `main`
- [ ] Deploy to Vercel from `main` branch
- [ ] Investigate **azeemsw.com** DNS — figure out where/how it's currently pointing (likely GitHub Pages or a registrar redirect) and update DNS to point to the new Vercel deployment
- [ ] Disable GitHub Pages deployment (currently serving from `colors` branch)

### Content Expansion

- [ ] Azeem is expanding his own bio, work descriptions, and travel narratives — review and integrate those updates
- [ ] **Work page — add bookkeeping experience**: Showcase bookkeeping alongside engineering work (details TBD on how to present this — separate section? part of bio?)
- [ ] **Work page — update project cards**: Pivot from the old freelance web projects toward newer personal projects built with Claude Code:
  - Recipe book website
  - AI-driven cryptocurrency trader
  - Others TBD
- [ ] Add screenshots/images for new project cards

### Image Asset Management

- [ ] Move images out of the git repo — binary assets bloat the repo and slow clones
- [ ] Evaluate options: Cloudinary, Vercel Blob, S3 + CloudFront, or Git LFS
- [ ] Update image references in data files (`projects.ts`, `trips.ts`) to pull from remote URLs
- [ ] Remove `public/images/` from the repo once remote hosting is confirmed working

### Future Enhancements (Low Priority)

- Enable Santa Cruz trip on Travel page (data already in `trips.ts`, just needs to be unfiltered)
- Consider adding more travel stories
- Responsive polish pass once real content is finalized
- Vercel Analytics or Plausible for traffic insights
