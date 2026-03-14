# Azeem Sweis — Portfolio

Personal portfolio website built with React, Vite, Tailwind CSS, and Framer Motion.

## Quick Start

```bash
git clone https://github.com/AzeemSweis/Portfolio.git
cd Portfolio
npm install
make dev
```

The site will be available at `http://localhost:5173`.

## What It Does

A modern, animated single-page portfolio showcasing my work, background, and travel photography. The site includes a home page with a rotating typewriter effect, an about section highlighting my DevOps engineering experience and technical skills, a work page with project portfolio and resume download, and a travel section with storytelling and photo galleries from trips.

## Tech Stack

- **React 18** — Component library for the UI
- **Vite** — Build tool and dev server
- **TypeScript** — Static typing for components and data structures
- **Tailwind CSS v4** — Utility-first styling with dark theme
- **Framer Motion** — Scroll-triggered and page-transition animations
- **React Router v7** — Client-side routing for the SPA
- **Lucide React** — SVG icon library for social links and UI elements

## Development

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm (ships with Node)

### Setup

```bash
git clone https://github.com/AzeemSweis/Portfolio.git
cd Portfolio
npm install
```

### Running

```bash
make dev
```

The dev server runs on `http://localhost:5173` with hot module replacement.

### Available Make Targets

```bash
make help     # Show all available targets
make dev      # Start Vite dev server
make build    # Production build to dist/
make preview  # Preview production build locally
make lint     # Run ESLint
make clean    # Remove dist/ and node_modules/
```

Or use npm scripts directly:

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview build
```

## Project Structure

```
src/
  components/
    layout/          # Navbar, Footer, PageTransition
    shared/          # PageTitle, SocialLinks, TypeWriter
    home/            # HeroSection, NavCards
    about/           # BioSection, SkillsGrid
    work/            # ResumeSection, ProjectCard, ProjectsGrid
    travel/          # MapEmbed, TripSection, PhotoGallery
  pages/             # HomePage, AboutPage, WorkPage, TravelPage
  data/              # projects.ts, skills.ts, trips.ts, socials.ts
  hooks/             # useTypewriter.ts (rotating text animation)
  App.tsx            # Root with React Router
  index.css          # Tailwind + custom fonts
  main.tsx           # Entry point

public/
  images/            # Profile photo, travel photos, project screenshots
  pdf/               # Resume PDF
```

## Configuration

### Environment Variables

No environment variables required for development. The site is static with no backend API calls.

### Design Tokens

The design system is defined in `tailwind.config.ts` with a dark theme:

- **Brand accent**: `#14ffec` (cyan)
- **Background**: `#0a0a0a` to `#1e1e1e` (grayscale progression)
- **Text**: `#f5f5f5` (primary), `#a3a3a3` (secondary), `#525252` (muted)

Fonts are loaded from Google Fonts: **Inter** (body) and **JetBrains Mono** (code/accents).

## Deployment

The site is deployed on **Vercel** with automatic deployments from the `main` branch.

To deploy:

```bash
# Just push to main branch
git push origin main
```

Vercel will automatically detect the Vite build, run `npm run build`, and deploy the `dist/` directory.

Preview deployments are created automatically for pull requests.

**Custom domain**: Configured in the Vercel dashboard (vercel.com).

## Pages

- **Home** (`/`) — Hero section with rotating typewriter effect and navigation cards
- **About** (`/about`) — Bio, profile photo, and skills grid
- **Work** (`/work`) — Resume download and project portfolio
- **Travel** (`/travel`) — Google Maps embed and trip narratives with photo galleries
