# AGENTS.md — Portfolio & Personal Ops (joychandrauday.vercel.app)

## Stack

- **Framework**: Next.js 14 (App Router, React 18 Server Components)
- **Styling**: Tailwind CSS (dark theme `bg-[#050505]`, accent `#FFB44B`, borders `rgba(255,255,255,0.05)`)
- **Typography**: Inter (sans), JetBrains Mono (mono), Hind Siliguri (Bengali / বাংলা)
- **Database**: PostgreSQL (Neon serverless) with Prisma ORM
- **Auth**: JWT session via `jose` stored in HTTP-only `ops_session` cookie
- **AI Automation**: Groq (`groq-sdk`, Llama 3.3) & Google Gemini (`@google/generative-ai`, 1.5 Flash) free tiers
- **Media storage**: Cloudinary signed uploads (public learning materials — PDF, images, video, zip)
- **Deployment**: Vercel + Neon PostgreSQL

## Commands

```bash
# Dev server
npm run dev

# Build (must pass before deploy)
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Prisma: regenerate client / push schema / seed
npm run db:generate
npm run db:push
npm run db:seed

# PWA: regenerate app icons (pure Node, no sharp)
npm run pwa:icons
```

## Project Architecture

```
app/
  layout.tsx            # Root layout: Inter, JetBrains Mono & Hind Siliguri fonts + LanguageProvider
  page.tsx              # Public homepage (Hero, About, Skills, Projects, Writing, Learnings, Contact)
  blog/[slug]/page.tsx  # Dynamic bilingual blog reading route
  manifest.ts           # PWA manifest → /manifest.webmanifest
  offline/page.tsx      # Offline fallback (precached by the service worker)
  learn/
    page.tsx            # Public roadmap index (5 roadmaps, search + difficulty filter)
    [slug]/page.tsx     # Roadmap hub — phase tree, step inspector, progress
    [slug]/[phase]/page.tsx            # Phase page — outcomes, materials, step list
    [slug]/[phase]/[step]/page.tsx     # Step page — commands, notes, files, status
    [slug]/[phase]/[step]/[material]/page.tsx # Long-form note / asset page
  ops/
    layout.tsx          # Ops navigation sidebar & auth verification
    login/page.tsx      # Terminal gateway security login
    page.tsx            # Executive telemetry dashboard & AI prompt terminal
    posts/page.tsx      # Bilingual Content Studio with AI translation (EN ➔ BN)
    jobs/page.tsx       # Career Intelligence Engine — JD import, kanban, company KB, apply email
    projects/page.tsx   # Project showcase manager
    learnings/page.tsx  # Second Brain & TIL (Today I Learned) research tracker
    learnings/
      LearningFlow.tsx  # Tracks → modules → sessions: streaks, progress, next-up
      NotesPanel.tsx    # Long-form research notes + AI ingestion (separate tab)
      MaterialsPanel.tsx # Phase/step public materials: Cloudinary upload + publish
      _components/       # Track / Module / Session modals + shared types
    inbox/page.tsx      # Inquiries inbox with AI response drafting & email dispatch
    settings/page.tsx   # Free tier AI API keys & system credentials
  api/
    contact/route.ts    # Public inquiry receiver + Resend email dispatcher
    ops/
      auth/route.ts     # Ops login, verification, and logout
      ai/route.ts       # Unified Groq / Gemini AI action dispatcher
      posts/route.ts    # Posts CRUD
      projects/route.ts # Projects CRUD
      jobs/route.ts           # Job CRM CRUD + search/filter/sort + company upsert
      jobs/apply/route.ts     # Send application email (Resend → Gmail) + advance pipeline
      jobs/fetch-url/route.ts # Fetch a JD URL server-side and strip HTML → text
      companies/route.ts      # Company knowledge base with salary aggregates
      learnings/route.ts# Second brain CRUD
      learn/route.ts        # Learning Flow dispatcher (tracks, modules, sessions, roadmap sync)
      learn/upload/route.ts # Cloudinary upload signature (ops only)
      learn/resources/route.ts # Public learning materials CRUD (phase/step wise)
      inbox/route.ts    # Contact messages manager
components/
  Navbar.tsx            # Bilingual switcher (EN / বাংলা) + /ops shortcut
  Hero.tsx              # Minimal craft hero with real-time status pill
  About.tsx             # Bilingual bio, career dossier, and philosophy
  Skills.tsx            # Categorized tech badges
  Projects.tsx          # Dynamic filterable project showcase
  Writing.tsx           # Bilingual engineering notes & articles
  Learnings.tsx         # Second Brain public research preview
  Contact.tsx           # Interactive contact form linked directly to /ops
  Footer.tsx            # Footer & /ops link
  LanguageProvider.tsx  # Client-side EN / BN state provider
  ServiceWorkerRegister.tsx # Registers /sw.js after page load
  InstallPWA.tsx        # Install pill: native prompt (Chrome/Edge) + iOS Safari guide
public/
  sw.js                 # Service worker: network-first pages, SWR assets, never caches /ops or /api
  icons/                # Generated PWA icons (192/512 + maskable variants + apple-touch)
scripts/
  generate-pwa-icons.js # Pure-Node PNG encoder behind `npm run pwa:icons`
lib/
  db/
    index.ts            # Prisma client singleton (PostgreSQL / Neon)
  auth.ts               # Session verification & master password
  ai.ts                 # Unified Groq & Google Gemini client
  i18n.ts               # Full bilingual dictionary (EN / BN)
prisma/
  schema.prisma         # Prisma schema — Post, Project, Experience, Company, JobApplication, Learning, Email, Inquiry, AppSetting
  seed.mjs              # Seed script (`npm run db:seed`)
```

## Job CRM Automation

Paste a job description (or fetch it by URL) into `/ops/jobs` → **Extract Everything**:

1. **Extraction** — `parseJobPosting()` in `lib/ai.ts` returns company, role, portal, source URL,
   career page, company website/industry/size, work mode, employment type, seniority, department,
   structured salary (min/max/currency/period, hour & month normalised to annual), tech stack,
   requirements, responsibilities, benefits, tags, contact info, posted/deadline dates,
   fit score, match reasons, gaps, summary and auto-priority.
2. **Persistence** — the API writes all fields to `JobApplication` and auto-upserts a `Company`
   row (name-keyed), so salary/industry/career-page data survives across applications.
3. **Search** — `GET /api/ops/jobs?q=&status=&portal=&workMode=&minSalary=&sort=salary|match|deadline|updated`
   and the **Company Intelligence** tab (`GET /api/ops/companies`) rank employers by top salary.
4. **Apply** — the drawer's **Generate & Send Application** opens an editable email modal
   (tone: professional / warm / concise, plus free-form instructions). Sending goes through
   `POST /api/ops/jobs/apply` → Resend first, then Gmail OAuth via `lib/mail.ts`, then ledger-only
   draft. A successful send logs an `Email` row, moves the job to *Applied*, stamps `appliedAt`,
   and schedules `nextActionAt` (follow-up) 5 days out.
5. **Automation** — follow-up alarms, deadline-within-7-days alerts, draft-ready badges,
   high-priority leads, and duplicate company+role detection on import.

## Public Learning Materials (`/learn`)

- **Routes**: `/learn` (index) → `/learn/[slug]` (hub) → `/learn/[slug]/[phase]` → `/learn/[slug]/[phase]/[step]` → optional `/[material]`. All four are **Server Components** with `generateStaticParams()` + `generateMetadata()`, so phase/step content is indexed; only status widgets are client islands. `/learning/*` permanently redirects to `/learn/*`.
- **Skeleton vs attachments**: phases/steps live in `lib/roadmaps-data.ts` (static, typed). Files/links/videos/notes live in the `LearnResource` table, keyed by `(roadmapSlug, phaseSlug, stepSlug)` — `phaseSlug = null` means roadmap-level, `stepSlug = null` means phase-level.
- **Reads**: `lib/learn-resources.ts` — `getRoadmapResources()` is wrapped in `unstable_cache` (tag `learn-resources`, 5 min) and degrades to empty buckets when the DB is unreachable.
- **Writes**: `/ops/learnings` → **Public Materials** tab (`app/ops/learnings/MaterialsPanel.tsx`) → `POST /api/ops/learn/resources` (`create_resource` / `update_resource` / `delete_resource` / `reorder_resource`). Every write calls `revalidateTag("learn-resources")`, so publishing is instant without a redeploy.
- **Uploads**: Cloudinary signed direct uploads. The browser asks `/api/ops/learn/upload` (cookie-gated) for a signature, then POSTs the file straight to `api.cloudinary.com` — no serverless body limit. Signed params: `folder`, `timestamp`, `allowed_formats`, `max_file_size` (25 MB). Env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. `raw` bucket for pdf/zip/md, `image`/`video` for media. SVG is intentionally not allowed.
- **Rendering**: markdown/HTML note bodies are sanitized **on the server** (`lib/markdown.ts` → `renderArticleHtml`, shared with the blog) and passed to the client as HTML, keeping `marked` + `sanitize-html` out of the public JS bundle. `lib/learn-notes.ts` builds that map.
- **SEO**: each roadmap/phase/step emits canonical URLs + JSON-LD (`LearningResource` / `Course`) and is listed in `app/sitemap.ts`.
- **Visibility**: `LearnResource.isPublic` must be true **and** `publishedAt` non-null to appear publicly; drafts stay ops-only.

## PWA & Mobile

- **Installable app**: `app/manifest.ts` serves `/manifest.webmanifest` (standalone display, maskable icons, shortcuts to Projects / Resume / Ops).
- **Service worker**: `public/sw.js` — network-first navigations with an `/offline` fallback, stale-while-revalidate for static assets, and it deliberately **never caches `/ops` or `/api`** (private, always live).
- **Registration & install UI**: `components/ServiceWorkerRegister.tsx` registers after load; `components/InstallPWA.tsx` renders a dismissible install pill (native Chrome/Edge prompt, “Add to Home Screen” guide on iOS Safari, `localStorage` opt-out).
- **Icons**: `npm run pwa:icons` (`scripts/generate-pwa-icons.js`, pure Node — no `sharp`) writes `public/icons/*` plus `app/icon.png` and `app/apple-icon.png`.
- **Ops on mobile**: slide-over sidebar with backdrop, Escape/route-change close and body scroll lock; horizontally scrollable CRM tables (`min-w-[720px]` inside `overflow-x-auto`); full-height modals (`max-h-[calc(100dvh-2rem)]`); 16px form fields on iOS to stop focus auto-zoom; safe-area padding for installed/standalone mode.

## Security & Master Access
- Default `/ops` password: `joyuday2025` (change via `OPS_ADMIN_PASSWORD` in `.env.local`).
- Public visitors see only the craft portfolio, writing, and public learnings.
- Access to `/ops` is protected by authenticated cookie sessions.
