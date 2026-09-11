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

## TL;DR System (source of truth + renderers)

Every published article owns a real TL;DR in its **body**, immediately after the
`> **ایدهٔ کلیدی:**` blockquote. Renderers never derive summaries from headings.

### The canonical section (edit this in the article)

```md
> **ایدهٔ کلیدی:** <one-line hook>          ← the «در یک خط»

## خلاصهٔ فوری

- <takeaway 1>
- <takeaway 2>
- <takeaway 3>

**ته‌خط:** <actionable bottom line>
```

Parser contract (tolerant; heading may also be `## خلاصه فوری`, `## چکیده`, `## TL;DR`):

| Field | Source | Rules |
|---|---|---|
| `line` | optional `**در یک خط:** …` inside the section | falls back to the `ایدهٔ کلیدی` blockquote |
| `points` | `-` bullets | 2–5; validation errors below 2, warns above 5 |
| `takeaway` | `**ته‌خط:**` (or `نتیجه` / `حرف آخر`) | required |

The section is stripped from the prose before `MarkdownContent` and its heading is
excluded from `headings`/TOC, so it is never rendered twice.

### Implementation

```
src/lib/types.ts                 # Tldr interface + Article.tldr
src/lib/tldr.ts                  # parseTldr / stripTldr (site)
scripts/lib/tldr.mjs             # mirror for scripts + applyTldr / buildTldrSection
scripts/tldr-apply.mjs           # writes sections from a {slug:{points,takeaway}} JSON batch
scripts/tldr-report.mjs          # `pnpm content:tldr` — lists missing/malformed sections
src/lib/content.ts               # parses tldr, strips section, excludes heading from TOC
src/components/TldrSlide.tsx     # site renderer (GSAP artboard + sr-only static fallback)
scripts/video-plan.mjs           # video scene plan (5 scenes from the same tldr)
scripts/video-html.mjs           # deterministic 1920×1080 scene page for rendering
```

### Rendering

- **Site** (`TldrSlide`): 4 animated scenes — Hook → در یک خط → نکته‌های کلیدی → ته‌خط.
  A real semantic summary (`sr-only`) is always in the DOM for a11y/SEO, and
  becomes visible (animation hidden) under `prefers-reduced-motion: reduce`.
- **Video** (`pnpm video:*`): 5 scenes — Hook → در یک خط → نکته‌های کلیدی → ته‌خط →
  قسمت بعدی. See `video/TODO.md`.

### Editing / adding TL;DRs (incl. future LLM passes)

1. Fill a JSON batch `{ "<slug>": { "points": ["…","…"], "takeaway": "…" } }`.
2. `node scripts/tldr-apply.mjs <batch.json|dir>` — idempotent; replaces an existing section.
3. `pnpm content:tldr` to check coverage, `pnpm content:validate` for strict structure.
4. Published articles **must** have a valid section; `content:validate` (and the build) fails otherwise.

`scripts/generate-tldr.mjs` was retired; `video-html.mjs` supersedes it.

<!-- END:tldr-system -->
