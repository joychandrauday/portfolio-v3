# Feed Feature Plan — Ops Scraper & Seed + Dynamic Mobile Feed

## Goal
1. Analyze the current feed surface and confirm whether it is dynamically wired to ops.
2. Add an Ops capability to scrape content from the internet and seed feed data, with daily automation.
3. Admin configures scraped/seeded content and backgrounds.
4. Public feed renders posts; on mobile, bottom nav with scroll snap showing one post at a time, each post using a pre-seeded background (image or animated), chosen randomly.

## Current State (context gathered before plan switch)
- Public `/learn` page was being converted from hardcoded roadmap data to dynamic fetching via `/api/ops/learn/roadmaps` (client-side fetch + loading state).
- Ops learning flow exists (`/ops/learnings`) with tracks/modules/sessions templates; `/ops` is JWT-protected.
- No dedicated Post/Feed model or mobile feed UI / bottom nav / scroll-snap implementation found yet in the active work context.

## Design Decisions (recommended defaults)
- D1 Feed entity: introduce a new `Post` Prisma model (content, source, author, status, background config, timestamps) rather than overloading `Learning`.
- D2 Scraper source: roadmap.sh–style structured sources (slug-based) plus admin-supplied URL/slug inputs; server-side fetch only (no client CORS issues).
- D3 Automation: admin manual trigger endpoint `POST /api/ops/feed/scrape` (ops-authenticated) + daily cron `POST /api/cron/seed-feed` (Vercel cron) reusing the same scrape+seed service.
- D4 Backgrounds: admin uploads image via existing Cloudinary flow or picks an animated CSS gradient preset; post stores `backgroundType: image|animation` + `backgroundRef`; feed resolves and randomly picks per post on render.

## Implementation Plan (for implementer)
1. Data layer: add Prisma `Post` model; scraper module in `lib/`; seed service writes posts.
2. Ops API: `/api/ops/feed/scrape` (auth), `/api/ops/feed/posts` (list/get), `/api/cron/seed-feed` (daily).
3. Ops UI: feed admin panel — run scrape now, daily schedule status, edit/seed posts, set background image/anim.
4. Public feed: `/feed` (or extension of `/learn`) list + post detail; feed container with mobile bottom nav + `scroll-snap-type: y mandatory`, each post `snap-start` full-height; per-post background image/animated with random selection.

## Risks / Open Questions
- Scraper legality/rendering constraints → prefer JSON APIs / server-side fetch.
- Free-tier quota usage for any AI summarization during scrape.
- Accessibility of animated backgrounds.
- Open Q (recommended): feed source for scraping — roadmap.sh-style structured sources (recommended) vs broad internet/RSS scraping.

## Validation
- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Manual: admin scrape → seed → posts appear in frontend feed; mobile viewport scroll snap + one-post-per-view verified.

## Next Step
User to confirm: proceed to implementation with roadmap.sh-style structured source scraping (recommended) as the first scraper target.
