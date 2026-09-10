<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:architecture-roadmap -->

## Future Architecture Work

Items below are known gaps that need addressing as the app scales.

### Real-time / Notifications
- No WebSocket, SSE, or polling mechanism. Users must manually refresh to see new turns, challenges, closures, or moderation actions.
- Consider Cloudflare Durable Objects or WebSocket Hibernation API for per-debate rooms.
- Minimum viable: 5-15s polling for active debate detail pages.

### Search & Discovery
- No full-text search or filtering on debates beyond status/tag.
- D1 does not support FTS5 natively. Options: in-memory Fuse.js client-side (like articles), or migrate search to a KV/vector index.

### Debate Analytics & History
- No win/loss tracking, debate duration stats, or activity dashboards.
- `debates` table has no winner column. Add `winner_id` field and judge-assigned outcome.
- User profiles could show win rate, average turns, favorite tags.

### Unified Auth System
- Admin auth (cookie + env hash) and Club auth (Worker/D1 sessions) are separate systems.
- Judges, admins, and club users share no identity. Admin must create a separate club account to participate.
- Consolidate into single Worker-managed auth with role-based access.

### i18n Infrastructure
- All UI strings, error messages, and validation are hardcoded Persian.
- No `i18next` or similar framework. Every new language requires rewriting all strings.
- Add i18n library before adding second language.

### Content CMS Limitations
- Content lives in GitHub via commit-based CRUD. No draft/preview, scheduling, or collaborative editing.
- Admin down if GitHub API is unreachable. Content changes == git commits.
- Consider a database-backed CMS with publish workflow for content-heavy operations.

### Observability
- No structured logging, metrics, or tracing in the Worker or Next.js server.
- Debugging production issues requires reading D1 dashboard directly.
- Add structured JSON logging, request ID propagation, and error tracking (Cloudflare Analytics Engine or similar).

### Backup & Disaster Recovery
- D1 has Cloudflare's point-in-time recovery but no external backup.
- All user data (accounts, debates, votes, moderation history) at risk if account is compromised.
- Export D1 to cloud storage periodically via Worker scheduled cron.

### Email Verification & Password Recovery
- No email verification on registration, no password reset flow.
- Users can register with fake emails. No way to recover lost passwords.
- Requires email service integration (Resend, SendGrid, etc.).

<!-- END:architecture-roadmap -->

<!-- BEGIN:tldr-system -->

## TL;DR Animated Slide System

Each article has a 3-scene animated TL;DR intro embedded directly in the article page via `TldrSlide` React component.

### Implementation

```
src/components/TldrSlide.tsx   # Client component: GSAP timeline, 3 scenes, inline styles
src/lib/content.ts             # extracts keyIdea from MDX blockquote
src/app/articles/[slug]/page.tsx  # passes title, description, keyIdea, readingTime, category to TldrSlide
```

### How it works

`TldrSlide` renders 3 scenes on a fixed 1920×1080 artboard. `fit()` scales to container via JS. GSAP CDN loads via `<script>` tag inside component. Effects mount/unmount with React lifecycle.

### Scenes

| Scene | Content | Duration |
|-------|---------|----------|
| 1. Hook | article title, description, metadata | 0–4.5s |
| 2. Key Idea | `ایده کلیدی` extracted from MDX blockquote | 4.6–8.6s |
| 3. CTA | "ادعا را آزمایش کن" + article title | 9–25s |

The engine (`useEffect`) builds a single GSAP timeline with `repeat: -1`. Each scene enters with staggered fade/slide animations.

### Modifying

- To change entrance animations: edit the `tl.fromTo()` calls in `TldrSlide.tsx`
- To add scenes: add a new `.tldr-scene` div + corresponding GSAP tweens
- To change visual style: edit the `<style>` block in the component

### Regeneration (none needed)

TL;DRs are generated at render time — no build step. Adding a new article automatically gets a TL;DR if it has an `ایده کلیدی` blockquote.

<!-- END:tldr-system -->
