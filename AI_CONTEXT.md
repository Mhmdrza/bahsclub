# BahsClub — AI Context Cache

> This file documents the project for AI assistant sessions so they don't need to re-explore the filesystem.  
> Keep it up to date when adding or renaming files.

## Project Overview

Persian-language educational site about debate, logical fallacies, and argumentation.  
Built with **Next.js 16** (`proxy.ts` not `middleware.ts`), **React 19**, **Tailwind CSS 4**.

## Content Model (file-based, in repo)

| Type | Directory | Extension | Frontmatter | Count |
|---|---|---|---|---|
| Articles | `content/articles/` | `.mdx` | `title, slug, description, status, category, level, readingTime, order, tags[], topics[], type, publishedAt, updatedAt, related[], featuredOnHome, exercise?, family` | 55 |
| Lessons | `content/lessons/` | `.md` | `title, slug, description, status, level, audience, featured, sequential, milestone, order, steps[]` | 3 |
| Topics | `content/topics/` | `.md` | `title, slug, description, status, order` | 5 |
| Pages | `content/pages/` | `.md` | `title, slug, description, status, order` + body | 3 |
| Site Config | `content/` | `site.yaml` | Full YAML: nav, homeSlots, principles, livePractice | 1 |

Content is read at build time via `src/lib/content.ts` using `fs.readFileSync` and `gray-matter`.

## Project Content (current state)

### Articles (55)
Courses on fallacies, argumentation, and judgment literacy — with categories like
`fallacy`, `method`, `technique`, `foundation`, `tactic`, `literacy`.

Full Schopenhauer mapping (8 articles): `absurd-extension`, `appeal-to-consequences`,
`begging-the-question`, `hair-splitting`, `poisoning-the-well`, `provocation`,
`theory-vs-practice`, `schopenhauer-art-of-being-right`.

Classic fallacy additions: `slippery-slope`, `hasty-generalization`, `nirvana-fallacy`,
`shifting-burden-of-proof`, `false-analogy`, `appeal-to-tradition`, `appeal-to-novelty`,
`all-or-nothing`, `composition-division`, `appeal-to-ignorance`.

Removed (folded into other articles or replaced): `burden-shifting`,
`claim-vs-opinion`, `tu-quoque`, `what-is-debate`.

### Lessons (3)
| Slug | Title | Articles |
|---|---|---|
| `judgment-literacy` | مسیر اصلی: سواد قضاوت | 10 articles (featured track) |
| `spotting-tactics` | تشخیص و پاسخ به تاکتیک‌های انحرافی | 8 articles |
| `deeper-curriculum` | مسیر پیشرفته: عمیق‌تر شدن | 10 articles |

### Topics (5)
`fallacies`, `foundations`, `judgment-literacy`, `practice`, `tactics`

### Pages (3)
`about`, `club-rules` (new), `session-format` (new)

## Admin Panel (added Aug 2025)

Password-protected admin at `/admin/` that manages content via GitHub REST API.  
Changes are committed directly to the repo; Vercel's Git integration auto-deploys.

### Auth

| File | Role |
|---|---|
| `src/proxy.ts` | Next.js 16 Proxy — guards `/admin/*` routes, redirects to login if `admin_session` cookie missing |
| `src/lib/auth.ts` | `verifyPassword`, `createSession`, `isAuthenticated`, `requireAuth`, `logout` |
| `src/app/admin/login/page.tsx` | Login form (client component, POSTs to `/api/admin/login`) |
| `src/app/api/admin/login/route.ts` | Verifies password against `ADMIN_PASSWORD_HASH` env var (SHA-256), sets session cookie |

### GitHub Integration

| File | What it does |
|---|---|
| `src/lib/github.ts` | `getFile`, `createOrUpdateFile`, `deleteFile`, `listContentFiles`, `getRecentCommits`, `buildCommitMessage` — all talk to GitHub REST API |
| `src/lib/admin-actions.ts` | Server actions wrapping GitHub calls: CRUD for articles, lessons, topics, pages, site config |

### Layout

| File | What it renders |
|---|---|
| `src/app/admin/layout.tsx` | Admin nav bar with links to all sections + logout button |

### Pages

| Route | File(s) | Description |
|---|---|---|
| `/admin` | `page.tsx` | Dashboard: content counts, quick actions, recent commits |
| `/admin/articles` | `page.tsx` | Table of all articles with status/type badges, inline delete |
| `/admin/articles/new` | `page.tsx` | Create article form (all frontmatter fields + markdown body) |
| `/admin/articles/[slug]/edit` | `page.tsx` | Edit article form (loads via `/api/admin/articles/[slug]`) |
| `/admin/articles/delete-button.tsx` | Client delete component | |
| `/api/admin/articles/[slug]` | `route.ts` | GET (content+sha), DELETE |
| `/admin/lessons` | `page.tsx` | Card grid of lessons |
| `/admin/lessons/new` | `page.tsx` | Create lesson (steps as comma-separated slugs) |
| `/admin/lessons/[slug]/edit` | `page.tsx` | Edit lesson |
| `/admin/lessons/delete-button.tsx` | Client delete component | |
| `/api/admin/lessons/[slug]` | `route.ts` | GET, DELETE |
| `/admin/topics` | `page.tsx` | Table of topics |
| `/admin/topics/new` | `page.tsx` | Create topic (compact form) |
| `/admin/topics/[slug]/edit` | `page.tsx` | Edit topic |
| `/admin/topics/delete-button.tsx` | Client delete component | |
| `/api/admin/topics/[slug]` | `route.ts` | GET, DELETE |
| `/admin/pages` | `page.tsx` | Table of pages |
| `/admin/pages/new` | `page.tsx` | Create page (title + markdown body) |
| `/admin/pages/[slug]/edit` | `page.tsx` | Edit page |
| `/admin/pages/delete-button.tsx` | Client delete component | |
| `/api/admin/pages/[slug]` | `route.ts` | GET, DELETE |
| `/admin/site-config` | `page.tsx`+`form.tsx` | Site config editor (raw YAML + simple form mode) |
| `/admin/settings` | `page.tsx` | Shows env config, setup instructions |
| `/admin/content-map` | `page.tsx` + `client.tsx` | Content governance dashboard — table/family/gap views (see Content Governance section) |

### Shared Admin UI Components

`src/components/admin/ui.tsx` — `PageHeader`, `FormField`, `SectionHeading`, `EmptyState`, `SubmitButton`

## Content Governance System

The content library (55 articles, 3 lessons, 5 topics, 3 pages) is managed through a four-layer governance system:

### Layer 1 — Auto-generated Manifest

`npm run content:index` → `node scripts/build-manifest.mjs` → `content/manifest.yaml`

Reads ALL content files, extracts metadata, cross-references, lesson memberships, inbound links, families, and gap analysis. Produces a single YAML file that serves as the source of truth.

| File | Purpose |
|---|---|
| `scripts/build-manifest.mjs` | Generates `content/manifest.yaml` from all MDX/MD files |
| `content/manifest.yaml` | Single source of truth — articles, lessons, cross-refs, families, gaps |

### Layer 2 — Article Families

Every article has a `family` frontmatter field grouping related content. When editing one article in a family, the others should be checked for consistency.

| Family | Members | Description |
|---|---|---|
| `classic-fallacies` | 19 | Core logical fallacies (ad-hominem, straw-man, false-dilemma, etc.) |
| `judgment-literacy-core` | 10 | The featured learning path |
| `schopenhauer-tactics` | 8 | Tactics from Schopenhauer's "The Art of Being Right" |
| `appeal-fallacies` | 5 | Appeal-based fallacies (fear, majority, authority, novelty, tradition) |
| `hidden-distortions` | 4 | Framing, assumptions, emotional persuasion |
| `club-philosophy` | 4 | Club identity docs (belief stress test, responding to tactics, etc.) |
| `practice-exercises` | 3 | Hands-on exercises |
| `advanced-judgment` | 2 | Deeper analytical concepts |

### Layer 3 — Validation

`npm run content:validate` → `node scripts/validate-content.mjs`

Checks every cross-reference, lesson step, topic slug, site-config reference, slug uniqueness, and order uniqueness. Returns 0 errors for a clean library.

Also runs during `npm run build` AND as a **pre-commit hook** (installed via `sh scripts/install-hooks.sh`):

| File | Purpose |
|---|---|
| `scripts/validate-content.mjs` | Validates all cross-references, slugs, orders, lesson/topic/site-config refs |
| `scripts/pre-commit` | Git pre-commit hook script — runs validation before every commit |
| `scripts/install-hooks.sh` | One-time installer for the pre-commit hook |

### Layer 4 — Admin Content Map

`/admin/content-map` — Interactive dashboard showing the entire content library.

Three views:
- **جدول (Table):** All 55 articles with filters (type, family, level, search). Columns: order, title, type badge, level, family, reading time, lesson count, inbound link count, edit link.
- **خانواده‌ها (Families):** Expandable family groups. Click any family to see all members with quick edit links.
- **شکاف‌ها (Gaps):** Four gap analyses — orphans (no lesson), unreferenced articles, sparse tags, sparse topics.

| File | Purpose |
|---|---|
| `src/app/admin/content-map/page.tsx` | Server component — reads manifest at build time |
| `src/app/admin/content-map/client.tsx` | Client component — filtering, view switching, families, gaps |

### Workflow

1. Edit an article → `npm run content:check` to verify integrity
2. Commit → pre-commit hook runs validation automatically
3. Push → build server runs validation before next build
4. Browse `/admin/content-map` any time for the full picture

## Frontend (public site)

### App Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page with hero ("بحثی که مجبور نیستی برنده‌اش شوی"), featured learning path, all paths grid, daily picks, club principles, session format preview, and live practice CTA |
| `/articles` | `src/app/articles/page.tsx` | Articles index with search/filter |
| `/articles/[slug]` | `src/app/articles/[slug]/page.tsx` | Single article with TOC, breadcrumbs, exercises |
| `/learn` | `src/app/learn/page.tsx` | Lessons index |
| `/learn/[lessonSlug]` | `src/app/learn/[lessonSlug]/page.tsx` | Lesson detail with steps |
| `/topics` | `src/app/topics/page.tsx` | Topics index |
| `/topics/[slug]` | `src/app/topics/[slug]/page.tsx` | Articles grouped by topic |
| `/practice` | `src/app/practice/page.tsx` | Practice articles list |
| `/[slug]` | `src/app/[slug]/page.tsx` | Catch-all for static pages (e.g., `/about`, `/club-rules`, `/session-format`) |

## Club (debate platform)

Backed by a Cloudflare Worker (`workers/api/`) on D1 SQLite. Frontend uses Next.js server components + server actions proxying the worker via `debate_session` cookie.

### Club Routes

| Route | File | Description |
|---|---|---|
| `/club` | `src/app/club/page.tsx` | Club home — statements feed, active debates, recent closed |
| `/club/statements` | `src/app/club/statements/page.tsx` | All statements |
| `/club/statements/new` | `src/app/club/statements/new/page.tsx` | Create statement form (client) |
| `/club/statements/[id]` | `src/app/club/statements/[id]/page.tsx` | Statement detail — counters, accept→debate, voting |
| `/club/debates` | `src/app/club/debates/page.tsx` | All debates |
| `/club/debates/[id]` | `src/app/club/debates/[id]/page.tsx` | Single debate with free-form messages, voting |
| `/club/tags` | `src/app/club/tags/page.tsx` | All tags with statement counts |
| `/club/tags/[slug]` | `src/app/club/tags/[slug]/page.tsx` | Statements filtered by tag |
| `/club/users/[username]` | `src/app/club/users/[username]/page.tsx` | User profile — bio, statements, debates, tags, reputation |
| `/club/judge` | `src/app/club/judge/page.tsx` | Judge dashboard for reviewing flagged content |
| `/club/login` | `src/app/club/(auth)/login/page.tsx` | Login form |
| `/club/register` | `src/app/club/(auth)/register/page.tsx` | Register form |

### Club Components

| File | Purpose |
|---|---|
| `src/components/debate/StatementCard.tsx` | Statement list card with votes, counter count |
| `src/components/debate/CounterCard.tsx` | Counter statement with vote, flag, accept button for author |
| `src/components/debate/CounterForm.tsx` | Counter (answer) submission form |
| `src/components/debate/DebateCard.tsx` | Debate list card with vote + message count |
| `src/components/debate/DebateHeader.tsx` | Debate detail header with opening statement/counter, vote, flag, moderation cover |
| `src/components/debate/DebateMessages.tsx` | Messages list with moderation states |
| `src/components/debate/MessageBlock.tsx` | Single message with vote, flag, cover/removed states |
| `src/components/debate/MessageForm.tsx` | Message submission form (both participants anytime) |
| `src/components/debate/ClosureRequest.tsx` | Mutual closure flow |
| `src/components/debate/StatusBadge.tsx` | Status pill |
| `src/components/debate/TagBadge.tsx` | Tag pill linking to tags page |
| `src/components/debate/VoteButton.tsx` | Upvote button with optimistic UI |
| `src/components/debate/FlagButton.tsx` | Flag dialog (reasons tied to club rules) |
| `src/components/debate/LivePoll.tsx` | 10s polling for new messages in active debates |
| `src/components/club/WarningsBanner.tsx` | Warning/block banners for users |

### Club Lib

| File | Purpose |
|---|---|
| `src/lib/api-client.ts` | Fetches Worker API with auth header |
| `src/lib/session.ts` | Session cookie management (`debate_session`) |
| `src/lib/auth-actions.ts` | Register/login/logout server actions |
| `src/lib/debate-actions.ts` | Statement/debate CRUD server actions (createStatement, counter, acceptCounter, postMessage, closure) |
| `src/lib/queries.ts` | Data fetching: statement lists, statement detail, debate lists, debate detail, user profile |
| `src/lib/votes.ts` | Vote toggle server action |
| `src/lib/moderation.ts` | Flag, resolve, bio-edit, warn-ack server actions |
| `src/lib/validations.ts` | Zod schemas for all forms |

### Worker API

Worker runs at `WORKER_API_URL` via `workers/api/`. Uses Hono, D1, sessions.

| File | Purpose |
|---|---|
| `workers/api/src/index.ts` | App entry, mounts all routes, cron forfeit check |
| `workers/api/src/lib.ts` | Auth helpers, `getCurrentUser`, `needJudge`, `ensureNotBlocked` |
| `workers/api/src/routes/auth.ts` | `/api/auth/register`, `/login`, `/session` |
| `workers/api/src/routes/statements.ts` | `/api/statements/...` CRUD, counters, accept→debate |
| `workers/api/src/routes/debates.ts` | `/api/debates/...` list, detail, message, closure, poll |
| `workers/api/src/routes/tags.ts` | `/api/tags` list (counts via statements) and per-tag statements |
| `workers/api/src/routes/votes.ts` | `/api/votes/toggle` with rep-awarding logic, types: statement/counter_statement/debate/message |
| `workers/api/src/routes/users.ts` | `/api/users/:username` profile (+statements), `/me` bio edit, warnings ack |
| `workers/api/src/routes/flags.ts` | `/api/flags` create, list (judge), `/resolve`, types: statement/counter_statement/debate/message |
| `workers/api/src/schema.sql` | Full DDL (fresh installs) |
| `workers/api/src/seed.sql` | Seed data (users, statements, counters, debates, messages, votes, flags) |
| `workers/api/migrations/0001_profiles_moderation.sql` | Migration 1 (profiles + moderation) |
| `workers/api/migrations/0002_foreign_keys_index.sql` | Migration 2 (FK + indexes) |
| `workers/api/migrations/0003_statements.sql` | Migration 3 — statements refactor, drops old debate/challenger/turn tables |

### DB Tables

- `users` — id, username, email, password_*, is_trusted, bio, role (member|judge), reputation, rep_locked, blocked_until
- `sessions`, `tags`
- `statements` — id, user_id, username, title, content, moderation_state, created_at
- `counter_statements` — id, statement_id, user_id, content, status (pending|debating), moderation_state, created_at
- `statement_tags` — (statement_id, tag_id) junction
- `debates` — id, statement_id, counter_statement_id, creator_id, creator_username, opponent_id, title, status (in_progress|closed), closure_requested_by, closed_reason (mutual|forfeit), closed_at, moderation_state, timestamps
- `debate_tags`, `debate_messages` (+moderation_state)
- `votes` — polymorphic: statement, counter_statement, debate, message
- `flags` — flagger_id, flaggable_type, flaggable_id, reason, details, status, UNIQUE per user+target
- `mod_actions` — judge_id, target_user_id, user_action (dismiss|warn|temp_block|rep_adjust|rep_lock), content_action (none|cover|remove), note, duration_days, rep_delta, acknowledged

### Components

| File | Purpose |
|---|---|
| `src/components/ArticleCard.tsx` | Article card for listing pages |
| `src/components/Breadcrumbs.tsx` | Breadcrumb navigation |
| `src/components/ExerciseBlock.tsx` | Interactive exercise with answer reveal |
| `src/components/HomeStartSection.tsx` | Home page hero/start section |
| `src/components/LessonCard.tsx` | Lesson card |
| `src/components/LessonProgressDisplay.tsx` | Progress bar for a lesson |
| `src/components/LessonStepsList.tsx` | Ordered list of lesson steps with completion |
| `src/components/MarkCompleteButton.tsx` | "Mark as complete" toggle button |
| `src/components/MarkdownContent.tsx` | Renders MDX content to HTML |
| `src/components/PrevNextNav.tsx` | Previous/next article navigation within a lesson |
| `src/components/ProgressBar.tsx` | Visual progress bar |
| `src/components/SearchAndFilters.tsx` | Search + filter UI for articles (uses Fuse.js) |
| `src/components/SiteFooter.tsx` | Footer |
| `src/components/SiteHeader.tsx` | Header with nav |
| `src/components/SkipLink.tsx` | Accessibility skip link |
| `src/components/TableOfContents.tsx` | In-article TOC sidebar |

### Hooks

| File | Purpose |
|---|---|
| `src/hooks/useCompletedSlugs.ts` | Reads completed article slugs from localStorage |
| `src/hooks/useLessonProgress.ts` | Computes lesson progress (completed/total) from localStorage |

### Lib

| File | Purpose |
|---|---|
| `src/lib/content.ts` | Reads all content from filesystem at build time, getters for published content |
| `src/lib/progress.ts` | localStorage-based progress tracking (client only) |
| `src/lib/types.ts` | TypeScript types for all content models |
| `src/lib/utils.ts` | `formatPersianNumber`, `slugifyHeading`, `levelLabel`, `typeLabel`, `cn` |

## Key Config

| File | Purpose |
|---|---|
| `next.config.ts` | Minimal Next.js config |
| `package.json` | Scripts: `dev`, `build` (runs `content:validate` first), `start`, `lint`, `content:index`, `content:validate`, `content:check` |
| `tsconfig.json` | TypeScript config with `@/` path alias |

## Env Vars for Admin Panel

```
GITHUB_TOKEN=ghp_...            # PAT with repo contents:write
GITHUB_OWNER=your-username
GITHUB_REPO=bahsclub
GITHUB_BRANCH=main
ADMIN_PASSWORD_HASH=<sha256>    # echo -n "password" | shasum -a 256
SESSION_SECRET=<random>
```

## Common Pitfalls

- Next.js 16 uses `proxy.ts` (file + function name), NOT `middleware.ts`.
- Route groups use `(groupName)` folder syntax.
- Content is static by default — add `export const dynamic = "force-dynamic"` for dynamic pages.
- All admin list pages use `"force-dynamic"` and `await requireAuth()`.
- Server actions in `admin-actions.ts` call `revalidatePath` after mutations so the list refreshes.
- `buildCommitMessage` in `github.ts` is async (returns `Promise<string>`).