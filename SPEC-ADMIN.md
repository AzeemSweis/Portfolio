# Portfolio Admin Backend — SPEC

## Overview

A lightweight CMS backend for the portfolio site. Allows the site owner (single user) to edit bio content, manage projects, trips, skills, and social links from an admin UI instead of editing TypeScript data files by hand. Images upload to Cloudinary; content is stored in SQLite and served as JSON to the React frontend.

## Architecture Decision: Monorepo

The backend lives inside the existing Portfolio repo at `api/`. Reasons:

- Single deploy pipeline — easy to keep frontend and backend in sync
- Shared types are easy to reference (even if TS and Python, the SPEC is the contract)
- This is a personal project — separate repos add overhead with no benefit
- The frontend deploys to Vercel; the backend deploys independently (Railway or Fly.io)

The admin UI lives inside the existing React app as a `/admin` route (not a separate app). It reuses the terminal aesthetic and shares components. Auth is checked client-side (redirect to login if no token) and enforced server-side on all `/api/admin/*` endpoints.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React 18 + Vite (existing) | Already in place; admin is just more routes |
| Backend | Python 3.12 + FastAPI | Owner's preferred stack; async, fast, great OpenAPI docs |
| Database | SQLite via aiosqlite | Personal project, single user, no need for Postgres |
| Migrations | Alembic | Standard SQLAlchemy migration tool |
| ORM | SQLAlchemy 2.0 (async) | Type-safe models, Alembic integration |
| Auth | JWT (access + refresh tokens) | Stateless, simple, no session store needed |
| Password hashing | bcrypt via passlib | Industry standard |
| Image hosting | Cloudinary (free tier) | 25GB storage, 25GB bandwidth/month — more than enough |
| Backend deployment | Railway or Fly.io | Free/cheap tiers, Docker-based, no server management |
| Frontend deployment | Vercel (existing) | Already configured |

## Database Schema

Six tables. All have `id`, `created_at`, `updated_at`. Order fields use integers for explicit sorting.

### `admin_user`

Single row. Seeded on first deploy via CLI command.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Always 1 |
| username | TEXT NOT NULL UNIQUE | |
| password_hash | TEXT NOT NULL | bcrypt |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `site_config`

Key-value store for singleton content (bio, tagline, profile photo URL). Avoids a wide table that grows columns every time a new field is added.

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| key | TEXT NOT NULL UNIQUE | e.g. `bio_paragraph_1`, `bio_paragraph_2`, `tagline`, `profile_photo_url`, `hero_title`, `hero_subtitle` |
| value | TEXT NOT NULL | The content |
| created_at | DATETIME | |
| updated_at | DATETIME | |

**Seed keys** (from current hardcoded content):

- `hero_title` — "Hey, I'm Azeem"
- `hero_subtitle` — "DevOps Engineer"
- `hero_tagline` — "Architecting scalable infrastructure..."
- `bio_paragraph_1` — First paragraph from BioSection.tsx
- `bio_paragraph_2` — Second paragraph from BioSection.tsx
- `profile_photo_url` — "/images/pfp.png" (later a Cloudinary URL)
- `rotating_words` — JSON array: `["learn.", "explore.", "create."]`

### `social_link`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | TEXT NOT NULL | Display name |
| url | TEXT NOT NULL | |
| icon | TEXT NOT NULL | Lucide icon name: Github, Linkedin, Instagram, Twitter |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `skill_category`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | TEXT NOT NULL | Category name |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `skill`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| category_id | INTEGER FK → skill_category.id ON DELETE CASCADE | |
| name | TEXT NOT NULL | |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `project`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| slug | TEXT NOT NULL UNIQUE | URL-safe identifier (was `id` in the TS file) |
| title | TEXT NOT NULL | |
| description | TEXT NOT NULL | |
| image_url | TEXT | Cloudinary URL or null |
| tags | TEXT NOT NULL DEFAULT '[]' | JSON array of strings |
| live_url | TEXT | |
| repo_url | TEXT | |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `experience`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| role | TEXT NOT NULL | |
| company | TEXT NOT NULL | |
| period | TEXT NOT NULL | e.g. "2021 - PRESENT" |
| is_current | BOOLEAN NOT NULL DEFAULT FALSE | |
| bullets | TEXT NOT NULL DEFAULT '[]' | JSON array of strings |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `trip`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| slug | TEXT NOT NULL UNIQUE | URL-safe identifier |
| location | TEXT NOT NULL | State/country |
| name | TEXT NOT NULL | |
| subtitle | TEXT NOT NULL | |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### `trip_stop`

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| trip_id | INTEGER FK → trip.id ON DELETE CASCADE | |
| name | TEXT NOT NULL | |
| paragraphs | TEXT NOT NULL DEFAULT '[]' | JSON array of strings |
| images | TEXT NOT NULL DEFAULT '[]' | JSON array of Cloudinary URLs |
| sort_order | INTEGER NOT NULL DEFAULT 0 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

## API Contract

Base URL: `https://<backend-host>/api`

### Public Endpoints (no auth, called by the React frontend)

These serve the same shape the frontend currently gets from static imports, so the migration is a drop-in replacement.

```
GET /api/content/site-config
  Response: { [key: string]: string }
  Example: { "hero_title": "Hey, I'm Azeem", "bio_paragraph_1": "...", ... }

GET /api/content/socials
  Response: SocialLink[]

GET /api/content/skills
  Response: SkillCategory[]  (each with nested skills[], ordered by sort_order)

GET /api/content/projects
  Response: Project[]

GET /api/content/experience
  Response: Experience[]

GET /api/content/trips
  Response: Trip[]  (each with nested stops[], ordered by sort_order)
```

Response shapes match the existing TypeScript interfaces exactly, so the frontend can swap `import { projects } from './data/projects'` for a fetch call with zero refactoring of the rendering code.

### Auth Endpoints

```
POST /api/auth/login
  Body: { "username": "azeem", "password": "..." }
  Response: { "access_token": "...", "refresh_token": "...", "token_type": "bearer" }
  Access token: 30min expiry. Refresh token: 7 days.

POST /api/auth/refresh
  Body: { "refresh_token": "..." }
  Response: { "access_token": "...", "token_type": "bearer" }
```

### Admin Endpoints (require Bearer token)

All admin endpoints require `Authorization: Bearer <access_token>` header. Return 401 if missing/expired.

```
# Site Config
GET    /api/admin/site-config              → { [key: string]: string }
PUT    /api/admin/site-config              → Body: { [key: string]: string }
                                              Updates multiple keys at once

# Socials
GET    /api/admin/socials                  → SocialLink[]
POST   /api/admin/socials                  → Body: { name, url, icon, sort_order }
PUT    /api/admin/socials/:id              → Body: { name?, url?, icon?, sort_order? }
DELETE /api/admin/socials/:id              → 204

# Skills
GET    /api/admin/skills                   → SkillCategory[] (with nested skills)
POST   /api/admin/skill-categories         → Body: { name, sort_order }
PUT    /api/admin/skill-categories/:id     → Body: { name?, sort_order? }
DELETE /api/admin/skill-categories/:id     → 204 (cascades to skills)
POST   /api/admin/skills                   → Body: { category_id, name, sort_order }
PUT    /api/admin/skills/:id               → Body: { category_id?, name?, sort_order? }
DELETE /api/admin/skills/:id               → 204

# Projects
GET    /api/admin/projects                 → Project[]
POST   /api/admin/projects                 → Body: { slug, title, description, tags, image_url?, live_url?, repo_url?, sort_order }
PUT    /api/admin/projects/:id             → Body: { partial fields }
DELETE /api/admin/projects/:id             → 204

# Experience
GET    /api/admin/experience               → Experience[]
POST   /api/admin/experience               → Body: { role, company, period, is_current, bullets, sort_order }
PUT    /api/admin/experience/:id           → Body: { partial fields }
DELETE /api/admin/experience/:id           → 204

# Trips
GET    /api/admin/trips                    → Trip[] (with nested stops)
POST   /api/admin/trips                    → Body: { slug, location, name, subtitle, sort_order }
PUT    /api/admin/trips/:id               → Body: { partial fields }
DELETE /api/admin/trips/:id               → 204 (cascades to stops)

# Trip Stops
POST   /api/admin/trips/:trip_id/stops     → Body: { name, paragraphs, images, sort_order }
PUT    /api/admin/trip-stops/:id           → Body: { partial fields }
DELETE /api/admin/trip-stops/:id           → 204

# Image Upload
POST   /api/admin/upload                   → multipart/form-data with "file" field
                                              Query param: ?folder=trips|projects|profile
                                              Response: { "url": "https://res.cloudinary.com/...", "public_id": "..." }
DELETE /api/admin/upload/:public_id        → Deletes from Cloudinary, returns 204
```

## Auth Flow

1. Admin navigates to `/admin` in the React app
2. React checks for a valid JWT in `localStorage`
3. If missing/expired, redirect to `/admin/login`
4. Login form POSTs to `/api/auth/login`, stores tokens in `localStorage`
5. All admin API calls include `Authorization: Bearer <token>` header
6. On 401 response, try refresh; if that fails, redirect to login
7. **No registration endpoint** — the admin user is seeded via CLI: `python -m api.cli create-admin`

Password requirements: Minimum 12 characters. That's it. No silly uppercase/special rules.

JWT secret is an env var (`JWT_SECRET`). Generate with `python -c "import secrets; print(secrets.token_hex(32))"`.

## Image Upload Flow

1. Admin selects an image in the admin UI
2. Frontend sends `POST /api/admin/upload` with `multipart/form-data`
3. Backend validates: max 10MB, must be image (JPEG, PNG, WebP)
4. Backend uploads to Cloudinary using the `cloudinary` Python SDK
5. Cloudinary returns a URL and public_id
6. Backend returns `{ "url": "...", "public_id": "..." }` to the frontend
7. Frontend stores the URL in the relevant form field (project image, trip stop image, profile photo)
8. On form save, the URL is persisted to SQLite

Cloudinary config via env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Cloudinary folder structure: `portfolio/trips/`, `portfolio/projects/`, `portfolio/profile/`.

## File Structure

```
Portfolio/
├── api/                          # Backend (new)
│   ├── __init__.py
│   ├── main.py                   # FastAPI app, CORS, lifespan
│   ├── config.py                 # Settings via pydantic-settings (env vars)
│   ├── database.py               # SQLAlchemy async engine + session
│   ├── models.py                 # SQLAlchemy ORM models
│   ├── schemas.py                # Pydantic request/response schemas
│   ├── auth.py                   # JWT creation, verification, password hashing
│   ├── deps.py                   # FastAPI dependencies (get_db, get_current_user)
│   ├── cli.py                    # CLI commands: create-admin, seed-from-static
│   ├── seed.py                   # Parse existing TS data files → SQLite rows
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── content.py            # Public GET endpoints
│   │   ├── auth.py               # Login, refresh
│   │   └── admin.py              # All admin CRUD endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   └── cloudinary.py         # Upload, delete wrappers
│   ├── alembic/                  # Alembic migrations directory
│   │   ├── env.py
│   │   ├── versions/
│   │   └── script.py.mako
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── src/                          # Frontend (existing, with additions)
│   ├── admin/                    # Admin UI (new)
│   │   ├── AdminLayout.tsx       # Terminal-styled admin shell
│   │   ├── AdminLogin.tsx        # Login page
│   │   ├── DashboardPage.tsx     # Overview / quick links
│   │   ├── BioEditor.tsx         # Edit site-config values
│   │   ├── ProjectsManager.tsx   # CRUD for projects
│   │   ├── TripsManager.tsx      # CRUD for trips + stops
│   │   ├── SkillsManager.tsx     # CRUD for skill categories + skills
│   │   ├── SocialsManager.tsx    # CRUD for social links
│   │   ├── ExperienceManager.tsx # CRUD for experience entries
│   │   ├── ImageUploader.tsx     # Reusable Cloudinary upload component
│   │   └── api.ts                # Admin API client (fetch wrapper with auth)
│   ├── hooks/
│   │   └── useContent.ts         # New: fetch content from API with static fallback
│   ├── data/                     # Existing static files (kept as fallback)
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── socials.ts
│   │   └── trips.ts
│   └── ...existing files
├── Makefile                      # Updated with backend targets
├── docker-compose.yml            # Local dev: backend + frontend
├── SPEC.md                       # Existing
├── SPEC-ADMIN.md                 # This file
└── ...existing files
```

## Frontend Migration Strategy (Static Data to API)

This is the most important architectural decision. The approach: **fetch-first with static fallback**.

### Phase 1 — Build the data hook

Create `src/hooks/useContent.ts`:

```typescript
// Pseudocode — not the final implementation
function useContent<T>(endpoint: string, staticFallback: T): {
  data: T
  loading: boolean
  error: string | null
}
```

- On mount, fetch from `GET /api/content/{endpoint}`
- If the fetch succeeds, return the API data
- If the fetch fails (API down, network error, 5xx), return the static fallback
- Cache responses in memory for the session (no re-fetching on every page nav)

### Phase 2 — Swap data sources in components

Replace static imports one at a time:

```typescript
// Before
import { projects } from '../data/projects'

// After
import { useContent } from '../hooks/useContent'
import { projects as staticProjects } from '../data/projects'

const { data: projects } = useContent('projects', staticProjects)
```

This is safe because: if the API is down, the site renders with static data. The site never breaks — it just might show stale content until the API is reachable.

### Phase 3 — Remove static data files (optional, later)

Once the API is proven stable and the admin is the primary editing interface, the static data files can be removed. No rush on this — they serve as a safety net.

### Environment variable for API URL

Add `VITE_API_URL` to the Vite config. Default to empty string (which means "don't call the API, use static data"). This way the frontend works perfectly on Vercel even before the backend is deployed.

```
# .env (local dev)
VITE_API_URL=http://localhost:8000/api

# Vercel env var (production)
VITE_API_URL=https://portfolio-api.fly.dev/api
```

## CORS Configuration

The FastAPI backend must allow requests from the Vercel frontend domain:

```python
origins = [
    "https://azeemsw.com",
    "https://www.azeemsw.com",
    "http://localhost:5173",  # Vite dev server
]
```

## Deployment Plan

### Backend (Railway or Fly.io)

1. `api/Dockerfile` — Python 3.12-slim, non-root user, multi-stage build
2. Single `fly.toml` or `railway.json` in `api/`
3. Persistent volume for SQLite file (both Railway and Fly.io support this)
4. Env vars set in the platform dashboard: `JWT_SECRET`, `CLOUDINARY_*`, `ADMIN_PASSWORD` (for initial seed only)
5. On first deploy, run `python -m api.cli create-admin` and `python -m api.cli seed-from-static`

### Frontend (Vercel, existing)

1. Add `VITE_API_URL` env var in Vercel project settings pointing to the backend URL
2. No other changes needed — Vercel config stays the same

### Backup Strategy

SQLite file is tiny. A cron job (or Fly.io scheduled machine) that copies `portfolio.db` to Cloudinary or an S3 bucket daily is more than sufficient. But honestly, for a personal portfolio, the seed script *is* the backup — you can always re-seed from the static data files and re-add any new content.

## Seed Script — Migration from Static Data

`api/seed.py` reads the existing TypeScript data files with a simple parser (regex extraction of the data objects, or just manually transcribe the current content into a Python dict since it's small). It:

1. Parses `src/data/socials.ts` and inserts into `social_link`
2. Parses `src/data/skills.ts` and inserts into `skill_category` + `skill`
3. Parses `src/data/projects.ts` and inserts into `project`
4. Parses `src/data/trips.ts` and inserts into `trip` + `trip_stop` (skipping the template)
5. Extracts hardcoded bio content from `BioSection.tsx` and `HeroSection.tsx` into `site_config`
6. Extracts experience data from `ExperienceLog.tsx` into `experience`

Since there are only ~4 socials, 4 skill categories, 3 projects, 2 experience entries, and 1 trip, the simplest approach is to just hardcode the seed data in Python rather than parsing TypeScript ASTs. The TS files are the source of truth for the *initial* migration only — after that, the database is the source of truth.

Run via: `python -m api.cli seed-from-static`

## Updated Makefile Targets

```makefile
# Backend
api-install:    pip install -r api/requirements.txt
api-dev:        uvicorn api.main:app --reload --port 8000
api-migrate:    alembic upgrade head
api-seed:       python -m api.cli seed-from-static
api-create-admin: python -m api.cli create-admin
api-test:       pytest api/tests/
api-lint:       ruff check api/

# Frontend (existing)
dev:            npm run dev
build:          npm run build

# Both
dev-all:        Run frontend and backend in parallel (docker-compose up or honcho/foreman)
```

## Implementation Order

1. **Backend skeleton** — FastAPI app, config, database setup, SQLAlchemy models, Alembic init
2. **Auth** — JWT auth, login endpoint, password hashing, `create-admin` CLI command
3. **Public content endpoints** — All `GET /api/content/*` routes
4. **Seed script** — Populate SQLite from current static content
5. **Admin CRUD endpoints** — All `POST/PUT/DELETE /api/admin/*` routes
6. **Cloudinary integration** — Upload/delete endpoints and service
7. **Frontend `useContent` hook** — Fetch-first with static fallback
8. **Frontend migration** — Swap components to use the hook (one page at a time)
9. **Admin UI** — Login page, dashboard, editors for each content type
10. **Dockerize backend** — Dockerfile, docker-compose for local dev
11. **Deploy backend** — Railway or Fly.io, env vars, initial seed
12. **Connect frontend** — Set `VITE_API_URL` in Vercel, verify end-to-end

## Out of Scope

- **Multi-user / roles** — Single admin user, no RBAC
- **Rich text editor** — Plain text and markdown are fine. No WYSIWYG.
- **Version history / audit log** — Not needed for a personal portfolio
- **Automated image optimization** — Cloudinary handles this with URL transformations (e.g. `w_800,q_auto`)
- **SSR / SSG** — The React app is a client-side SPA on Vercel; no server rendering
- **Resume PDF management** — The resume PDF stays as a static file in `public/pdf/`. Editing it requires uploading a new PDF manually (rare enough to not warrant UI).
- **CI/CD pipeline** — Out of scope for this spec. Can be added later as a GitHub Actions workflow.
- **Email / notifications** — No contact form, no email sending
- **Analytics** — Already noted as a separate TODO in the main SPEC

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo vs separate repo | Monorepo (`api/` directory) | Less overhead, easier to keep in sync |
| Admin UI location | `/admin` route in existing React app | Reuses components and terminal aesthetic |
| Data fetching strategy | Fetch-first with static fallback | Site never breaks, graceful degradation |
| Auth mechanism | JWT (access + refresh) | Stateless, no session store for SQLite |
| Image hosting | Cloudinary | Free tier is generous, SDK is simple, URL transformations are a bonus |
| Database | SQLite + async SQLAlchemy | Single user, tiny dataset, no Postgres overhead |
| Bio/config storage | Key-value `site_config` table | Flexible, no schema changes for new fields |
| Backend deployment | Railway or Fly.io | Docker-based, persistent volume for SQLite, cheap/free tier |
| Tags/bullets storage | JSON text columns | SQLite JSON functions are available but overkill; just serialize/deserialize in Python |
