# Copy Audit — بحث‌کلاب

Audit only. Nothing changed. Canon locked 2026-10-03.
Scope: writing/copy refactor, not code refactor.

How to read: each row = surface + drift + canonical replacement.
`SWEEP` = mechanical find/replace. `REWRITE` = hand rewrite. Line numbers are current.

---

## 1. Canon (locked)

**Brand:** `بحث‌کلاب` — the site name everywhere.
**Practice space:** `باشگاه` (the club / arena, `/club`). Never write `باشگاه اندیشه`.

| Keep | Note |
|---|---|
| `بحث‌کلاب` | site brand; restore wherever the sweep had replaced it |
| `باشگاه` | the `/club` arena; do not attach a second name to it |
| `BahsClub` (docs) | leave as-is (repo/docs label) |

**Spine — triangle: فروتنی · آزادی · دعوت**

1. **فروتنی** — primary. All dirty tactics (ad-hominem, poisoning-the-well, superiority, "همه‌چیز را همگان دانند") root in not being humble enough to understand. Copy admits limits, never condescends.
2. **آزادی** — no coercion. Come/go/watch/talk freely; never push anyone out of their will; no forced consensus; changing one's mind is optional.
3. **دعوت** — invite, not push. Invite to talk, to explain your position, to listen and see from our lens. Doors open, exit doors left open.

**Two spaces kept (dojo separation):**
- `تالار آموزش` (theory) — نردبان قدرت کلام، مسیرهای آموزشی، مقالات، تمرین‌ها. Free/public.
- `باشگاه` (the club / arena) — چالش‌ها و مباحثه‌ها: ideas examined together.

**Arena conduct — we don't fight; we seek truth together.** No winning, no losing, no opponent to defeat. You listen, you correct, you point out the fallacy, and you get closer to the truth together. The person across the table is a co-investigator of the claim, not an enemy. Combat/victory framing (`فایت‌کلاب`, `رینگ`, `سلاح`, `برنده`, `شکست دادن`) is out. Humility is not a style here — it is the method.

> Canon history: 2026-10-03 — first draft allowed competitive "chess masters" debate; owner rejected it. BahsClub does not fight. Keep this doc's no-combat rule authoritative.

**Cut:** the fictional live, facilitated, 8-stage, 60–90 minute session. Product is async.

---

## 2. Voice rules from the triangle

**Keep:** دعوتت می‌کنیم، می‌توانی، اختیاری است، نمی‌دانم، محک، گفت‌وگو، مباحثه، شفاف‌سازی، استدلال — plus inquiry language: `گوش دادن`, `اصلاح`, `بررسی`, `مغالطه`, `حقیقت`, `هم‌فهمی`.

**Ban — combat & victory framing** (contradicts فروتنی and the truth-seeking goal):
`فایت‌کلاب`, `رینگ`, `مشت`, `ضربه`, `سلاح`, `بدل زدن`, `آتش نقد`, `نبرد`, `حمله`, `برنده`, `باخت`, `شکست دادن`, `غلبه`, `حریف`, `پیروزی`.
Counts today: `فایت‌کلاب` 2/2 · `رینگ` 17/9 · `مشت` 27/19 · `سلاح` 17/10 · `بدل` 8/7 · `آتش` 7/4 · `نبرد` in rung name + copy.
Replace with: `بررسی`, `گفت‌وگو`, `نزدیک شدن به حقیقت`, `دیدن ضعف استدلال`, `اصلاح`.

**Ban (superiority contradicts فروتنی):**
`بدیهی است`, `پرواضح است`, `ساده‌اش این است که`, `بیدار شو`, `کاملاً اشتباه می‌کنی`.
`بدیهی` 5/3. Already banned in `docs/EDITORIAL_VOICE.md` §4; enforce.

**Ban (coercion contradicts آزادی):**
`تحمیل`, `وادار`, `باید بپذیری`, `چاره‌ای نداری`, `تنها نتیجهٔ منطقی`.

**Already banned:** `گارد` (per doctrine §2). Only live source is `docs/EDITORIAL_VOICE.md` itself; `content/manifest.yaml:2061` is stale-generated — regenerate manifest, don't hand-edit.

**Rule:** attack the system, structure, claim, or measure — never identity, intellect, or motive.

---

## 3. Lexicon map

| Old | New | Note |
|---|---|---|
| `باشگاه اندیشه` | `بحث‌کلاب` (brand) or `باشگاه` (arena) | brand sweep reverted; classify per context |
| `باشگاه گفت‌وگو` / `باشگاه بحث` / `باشگاه مناظره` | `باشگاه` | arena label; identity only |
| `مناظره` (as activity/identity) | `گفت‌وگو` / `مباحثه` | implies winning; retire from positioning copy |
| `مسیر یادگیری` (theory hub) | `تالار آموزش` | hub = تالار آموزش |
| `مسیرهای یادگیری` (lesson collections) | `مسیرهای آموزشی` | sub-label |
| `سالن تمرین` | `تالار آموزش` | doctrine §2 |
| `رینگ` / `رینگ مناظره` | `میز گفت‌وگو` / `میز بررسی` | no combat |
| `فایت‌کلاب` | — | delete, rewrite |
| `شطرنج` / `حرکت` / `مهره` | not recommended | adversarial/winning frame |
| `برنده` / `باخت` / `غلبه` / `شکست دادن` | `نزدیک شدن به حقیقت` / `روشن شدن مسئله` | no victory |
| `نبرد` (rung ۲) | TBD — see §8 | combat name under no-fight spine |
| `تسهیل‌گر` | `داور` | role exists: `/club/judge`, `club-rules` |
| `جلسهٔ بحث` / `جلسه` | `مباحثه` / `چالش` | matches real product |
| `رأی‌گیری` (as winner-decider) | `داوری` / `سنجش` | keep `رأی` only as approval signal |
| `مأموریت ما` | `مأموریت` or `دربارهٔ ما` | optional, site.yaml nav says مأموریت |

---

## 4. Unbuilt content → cut to reality

| File | Drift | Action |
|---|---|---|
| `content/pages/session-format.md` | 136 lines: 8-stage live session, 60–90 min, facilitator, "هیچ رأی‌گیری" | REWRITE to async flow: چالش → نقد/پذیرش → مباحثه → پایان توافقی/عدمی‌فعالیت → داوری. Or delete + drop inbound links. |
| `content/pages/about.md:41–54, 67` | same 8-stage + facilitator | REWRITE to actual challenge/debate loop |
| `content/pages/club-rules.md:92–94` | §10 facilitator stops discussion | REWRITE §10 → داور protects standards (judge role is real) |
| `content/pages/faq.md:33` | "جلسه‌ها در آیندهٔ نزدیک راه می‌افتند" | align: sessions are async today |
| `about.md:54`, `session-format.md:118–122` | "هیچ رأی‌گیری‌ای نداریم" vs real `VoteButton` upvotes on every surface | reconcile: رأی = تأیید/جلب‌توجه, not تعیین برنده |
| `src/app/club/debates/page.tsx:37,47` | "در انتظار هم‌آورد" list under debates | verify copy matches real statuses |

---

## 5. Surface action table

> **Brand note (revision 2026-10-03):** the brand is `بحث‌کلاب` (site) and the arena is
> `باشگاه` (`/club`). Rows below that say "brand → باشگاه اندیشه" are superseded; read
> them as "brand → `بحث‌کلاب`". Content/UI was already corrected to this.

### Brand-level / config
| File | Drift | Action |
|---|---|---|
| `content/site.yaml:1` | `title: بحث‌کلاب` | `باشگاه اندیشه` |
| `content/site.yaml:3,41` | `باشگاه مناظره` in description/livePractice | align to spine + real async flow |
| `content/site.yaml:24–38` | `principles` (7 rules) | rewrite as public face of فروتنی/آزادی/دعوت; dedupe vs `club-rules.md` |
| `src/components/SiteFooter.tsx:42` | `aria-label="بحث‌کلاب"` | `باشگاه اندیشه` |
| `src/components/SiteFooter.tsx:6–17` | START_LINKS labels | `مسیر سواد قضاوت`, `کتابخانه`, `تمرین‌ها` fine; nav heading fix |
| `src/components/SiteHeaderClient.tsx` | brand from config (inherits) | ok once site.yaml fixed |

### Homepage
| File | Drift | Action |
|---|---|---|
| `src/components/HeroSection.tsx:17–50` | 4 random variants, each a different value prop; combat/victory metaphor | REPLACE with one canonical hero on the triangle; if rotation kept, all variants on-spine |
| `src/app/page.tsx:79–84` WHY | `مناظره`/combat | rewrite via triangle: listen, correct, approach truth |
| `src/app/page.tsx:25–44` LADDER_META | `تسلط` vs ladder.ts `قدرت کلام`; combat lines | unify level-3 = `قدرت کلام`; soften lines |
| `src/app/page.tsx:106–159` | `سه‌گانهٔ مهارت`, `از تالار آموزش تا باشگاه مناظره` | align to تالار آموزش + باشگاه اندیشه |
| `src/app/page.tsx:215–264` | `فلسفهٔ بحث‌کلاب`, `باشگاه مناظره`, `میز مناظره` | rewrite, remove brand/combat |

### Static pages
| File | Drift | Action |
|---|---|---|
| `content/pages/mission.md` | `مسیر یادگیری`; brand `بحث‌کلاب` not present but name implicit | align lexicon; keep structure |
| `content/pages/about.md` | `بحث‌کلاب`, "نه یک باشگاه مناظرهٔ معمولی" vs club identity, 8-stage, facilitator | REWRITE: brand, reconcile debate framing, cut unbuilt |
| `content/pages/faq.md` | `بحث‌کلاب`, `مسیر یادگیری`, unbuilt sessions | REWRITE |
| `content/pages/club-rules.md` | title `قوانین ... بحث‌کلاب`, facilitator | rename brand, §10 → داور |
| `content/pages/session-format.md` | whole page unbuilt | REWRITE (see §4) |
| `content/pages/glossary.md` | mostly fine; `بحث منصفانه و مؤثر` | minor |

### Learn / Ladder / Practice / Articles
| File | Drift | Action |
|---|---|---|
| `src/app/ladder/page.tsx:13–15` | `بحث‌کلاب` desc, `مسیر یادگیری` | brand + lexicon |
| `src/app/ladder/page.tsx:37–46` | `صفحهٔ شطرنج`, `میدان معنا` | align, keep level names |
| `src/app/learn/page.tsx` | `مرکز آموزش جامع بحث‌کلاب`, `مسیرهای یادگیری` | brand + `تالار آموزش` framing |
| `src/app/learn/[lessonSlug]/page.tsx:39` | breadcrumb `مسیر یادگیری` | `تالار آموزش` or `مسیرهای آموزشی` |
| `src/app/practice/page.tsx:28–29` | fine | minor |
| `src/app/articles/page.tsx:17` | `بحث‌کلاب` | brand |
| `src/app/articles/category/[category]/page.tsx:22,35` | `بحث‌کلاب` | brand |
| `src/app/articles/tag/[tag]/page.tsx:22,35` | `بحث‌کلاب` | brand |
| `src/app/topics/page.tsx:10` | `موضوعات آموزشی بحث‌کلاب` | brand |
| `src/lib/ladder.ts` | level-3 line 144 ok; lines 79–152 combat (`نبرد`, `سلاح`, `دفاع`) | rename rung 2, soften flavor lines (see §8-5) |

### Club (real product copy)
| File | Drift | Action |
|---|---|---|
| `src/app/club/page.tsx:25,28` | badge `باشگاه گفت‌وگو`, `رینگ مناظره` | `باشگاه اندیشه`, drop رینگ |
| `src/app/club/layout.tsx:28` | `باشگاه اندیشه — ...` | keep name; align tagline |
| `src/app/club/rules/page.tsx:9` | `قوانینٔ باشگاه` (wrong ezafe) | `قوانین باشگاه` |
| `src/app/club/debates/page.tsx:27–29` | `آرشیو گفتگوها`, `مباحثه‌ها` | align |
| `src/app/club/challenges/new/page.tsx:23–26` | fine; `چالش` vocab | align to invitation voice |
| `src/app/club/challenges/[id]/page.tsx:179–182` | `موضع خود را بنویس` | invitation voice |
| `src/app/club/judges/page.tsx:7–8,24` | `باشگاه بحث` | `باشگاه اندیشه` |
| `src/app/club/invites/page.tsx:57–61` | invitation copy | reinforce دعوت as product principle |
| `src/app/club/(auth)/login/page.tsx:27` | `ورود به باشگاه اندیشه` | already correct — this is canon source |
| `src/app/club/(auth)/register/RegisterForm.tsx:107,164` | headings say `ورود به باشگاه اندیشه` on register/waitlist states | fix to register/waitlist labels |

### Components (club/debate)
| File | Drift | Action |
|---|---|---|
| `src/components/club/ClubHeaderClient.tsx:34` | `باشگاه اندیشه` | canon, keep |
| `src/components/debate/FlagButton.tsx:7–12` | rule refs `(اصل ۱/۳/۹/۱۰)` | renumber after rules edit |
| `src/components/debate/VoteButton.tsx:47` | `تأیید و رأی` | reconcile رأی semantics |
| `src/components/debate/StatusBadge.tsx` | status labels | align vocab (مباحثه) |

### Metadata / SEO / docs
| File | Drift | Action |
|---|---|---|
| `src/app/layout.tsx` | inherited brand | verify after site.yaml |
| `src/app/articles/category|tag` | `بحث‌کلاب` in descriptions | brand |
| `docs/EDITORIAL_VOICE.md` §1 | fight-club metaphor now superseded by triangle | add `docs/BRAND_SPINE.md`; mark §1 superseded, keep P-U-I + C-P-R-O + tone |

---

## 6. Mechanical sweep (run after canon doc updated)

```bash
rg -l 'بحث‌کلاب' content src docs
rg -l 'باشگاه گفت‌وگو|باشگاه بحث|باشگاه مناظره' content src
rg -l 'مسیر یادگیری|سالن تمرین|تسهیل‌گر' content src
rg -n 'فایت‌کلاب|رینگ|مشت|ضربه|سلاح|بدل زدن|آتش نقد|نبرد|برنده|باخت|غلبه|شکست دادن' src content
rg -n 'بدیهی|پرواضح|تحمیل|وادار|گارد' src content
```

Order matters: rename brand first (safe), then lexicon, then hand-rewrite the pages in §4.

---

## 7. Typo / consistency

- `قوانینٔ` → `قوانین`: `src/app/club/rules/page.tsx:9`, `content/pages/mission.md:48`, `content/pages/faq.md:25`.
- `سه‌گانهٔ مهارت` vs `نردبان قدرت کلام` — pick one framing for the 3 rungs.
- `تسلط` vs `قدرت کلام` (level 3) — unify `قدرت کلام`.
- `رأی` spelling is consistent; keep.
- `content/manifest.yaml` stale — regenerate via `pnpm content:index`, never hand-edit.

---

## 8. Open decisions (need owner)

1. **`مناظره` inside 55 article bodies** (67 hits / 16 files): rename identity only, or sweep in bodies too? Recommend: identity + titles only; leave pedagogy (fallacy examples) alone.
2. **Vote semantics:** upvote = تأیید (بماند) or rename to `بیان موافقت` to kill "رأی/برنده" confusion?
3. **`session-format` page:** rewrite to async flow, or delete + redirect and drop links from about/faq?
4. **`principle` count:** `site.yaml` has 7 principles, `club-rules.md` has 10. One canonical list, or public-7 vs full-10?
5. **`نبرد` rung name:** combat name under the no-fight spine. Options: `تیزبینی` / `تشخیص` / `درگیری سازنده` — or keep `نبرد` as a metaphor for inner struggle. Owner decision required.
6. **`docs/BRAND_SPINE.md`:** create as new canon, or fold into a rewritten `EDITORIAL_VOICE.md`?

---

## 9. Proposed execution order

1. Write `docs/BRAND_SPINE.md` (canon §1–2). Freeze.
2. SWEEP brand rename (`بحث‌کلاب`, variants) across `content/ src/ docs/`.
3. SWEEP lexicon (مسیر یادگیری، رینگ، تسهیل‌گر، فایت‌کلاب) in reader-facing copy.
4. Rewrite §4 pages (session-format, about, club-rules §10, faq) to reality.
5. Rewrite homepage + HeroSection (single on-spine hero).
6. Reconcile club UI + VoteButton semantics.
7. Regenerate manifest; run `pnpm content:validate`.

---

## 10. Ladder rationale — proposal (why the ladder exists)

Problem it solves: 55 articles are a pile, not a path. A stranger asks "where do I start, am I improving?" The ladder answers both: **آزمون → سطح → مسیر → محک**. It is the spine of `تالار آموزش` and the on-ramp to the club, where ideas are examined together.

**Justification — one sentence:** the ladder teaches a transferable life skill (فکر و کلام روشن), not a debate hobby; the club is only where you put it under friendly pressure with others.

**Three payoffs, mapped to life outside the club** (use these on `/ladder` and the home ladder section):

| rung | failure mode it fixes | cost outside the club |
|---|---|---|
| پایه — مقدماتی | you cannot hear or state what the other actually claims; conflict turns into mutual misunderstanding | family fights that repeat for years, meetings that solve nothing |
| پلهٔ ۲ — تشخیص تاکتیک | you get derailed, pressured, or manipulated; you lose the thread under noise | ads, political spin, pressure selling, social-media pile-ons |
| قدرت کلام — ذهن و میدان معنا | someone else controls the frame/narrative; you argue inside their terms | reading the news, negotiation, deciding what to trust |

**Two emotional hooks** (per `EDITORIAL_VOICE.md` §4 energy lever):
- Escape negative: کمتر فریب می‌خوری، کمتر درگیر جدل بی‌ثمر می‌شوی، کمتر تحقیر می‌شوی.
- Gain positive: آرامش زیر فشار، وضوح، احترام، در دست داشتن ذهن خودت.

**Why it belongs under the triangle:** فروتنی = admit you can be wrong and can improve → a ladder, not a badge; آزادی = you choose your rung and pace; دعوت = the ladder invites you in, never shames your level.

**Copy rule:** the ladder is never "become a champion". It is "become harder to fool, harder to drag into a pointless fight, and better at getting closer to the truth — with others, not against them." The path is generic; the club is where you test it in company.

**Suggested one-liner for `/ladder` header:**
> مهارت گفت‌وگو مثل شناست: با تمرین درست یاد می‌گیری. نردبان سه پله دارد — پایه (بشنو و روشن بگو)، تشخیص (مغالطه و تاکتیک را ببین)، قدرت کلام (زمین بازی و چارچوب را ببین). هر پله یک هزینهٔ واقعی را از زندگی‌ات کم می‌کند؛ باشگاه جایی است که با هم محکش می‌زنید.

