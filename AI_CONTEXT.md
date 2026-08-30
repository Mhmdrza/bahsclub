# BahsClub — AI Context Cache

> This file documents the project for AI assistant sessions so they don't need to re-explore the filesystem.  
> Keep it up to date when adding or renaming files.

## Project Overview

Persian-language educational site about debate, logical fallacies, and argumentation.  
Built with **Next.js 16** (`proxy.ts` not `middleware.ts`), **React 19**, **Tailwind CSS 4**.

## Content Model (file-based, in repo)

| Type | Directory | Extension | Frontmatter |
|---|---|---|---|
| Articles | `content/articles/` | `.mdx` | `title, slug, description, status, category, level, readingTime, order, tags[], topics[], type, publishedAt, updatedAt, related[], featuredOnHome, exercise?` |
| Lessons | `content/lessons/` | `.md` | `title, slug, description, status, level, audience, featured, sequential, milestone, order, steps[]` |
| Topics | `content/topics/` | `.md` | `title, slug, description, status, order` |
| Pages | `content/pages/` | `.md` | `title, slug, description, status, order` + body |
| Site Config | `content/` | `site.yaml` | Full YAML: nav, homeSlots, principles, livePractice |

Content is read at build time via `src/lib/content.ts` using `fs.readFileSync` and `gray-matter`.

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

### Shared Admin UI Components

`src/components/admin/ui.tsx` — `PageHeader`, `FormField`, `SectionHeading`, `EmptyState`, `SubmitButton`

## Frontend (public site)

### App Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page with hero, featured links, principles |
| `/articles` | `src/app/articles/page.tsx` | Articles index with search/filter |
| `/articles/[slug]` | `src/app/articles/[slug]/page.tsx` | Single article with TOC, breadcrumbs, exercises |
| `/learn` | `src/app/learn/page.tsx` | Lessons index |
| `/learn/[lessonSlug]` | `src/app/learn/[lessonSlug]/page.tsx` | Lesson detail with steps |
| `/topics` | `src/app/topics/page.tsx` | Topics index |
| `/topics/[slug]` | `src/app/topics/[slug]/page.tsx` | Articles grouped by topic |
| `/practice` | `src/app/practice/page.tsx` | Practice articles list |
| `/[slug]` | `src/app/[slug]/page.tsx` | Catch-all for static pages (e.g., `/about`) |

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
| `package.json` | Scripts: `dev`, `build`, `start`, `lint` |
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