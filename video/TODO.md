# YouTube production — حرف‌کلاب

Turn the 4 learning paths into 4 YouTube playlists. Each video is one article,
~34s silent (grows with voiceover), ends on a **«قسمت بعدی»** card that
points to the next video in its path.

4 series · 33 unique videos (evidence-quality appears in two paths).

## Map: site path → playlist

| Playlist | Site path | Articles |
|---|---|---|
| مسیر اصلی: سواد قضاوت | `/learn/judgment-literacy` | 9 |
| تشخیص و پاسخ به تاکتیک‌های انحرافی | `/learn/spotting-tactics` | 8 |
| مسیر پیشرفته: عمیق‌تر شدن | `/learn/deeper-curriculum` | 10 |
| اصول پایهٔ گفت‌وگو | `/learn/dialogue-basics` | 7 |

## Pipeline (in repo)

```
content/articles/*.mdx ─┐
                        ├─ video:plan  → video/plan.json, video/scripts/*.md, video/srt/*.srt
content/lessons/*.md  ──┘
video/plan.json ───────── video:html  → video/html/<slug>.html   (deterministic seek, 4 scenes)
video/html/*.html ─────── video:render→ video/frames/… → video/out/<slug>.mp4
video/vo/<slug>.m4a ─────┘   (optional VO, auto-detected and muxed)
```

Commands:

```bash
pnpm video:plan                 # regenerate series plan, narration scripts, SRT
pnpm video:html                 # regenerate all standalone scene pages
pnpm video:render ad-hominem    # capture + encode one video
pnpm video:render               # capture + encode all 33
pnpm video:render -- --fps=25 --captions   # burn video/srt/<slug>.srt
```

Generated (gitignored): `video/frames/`, `video/html/`, `video/out/`, `video/vo/`,
`video/plan.json`, `video/scripts/`, `video/srt/` — run `pnpm video:plan` to regenerate.
Tracked: `video/TODO.md`.

## Status

- [x] 4 series derived from learning paths (`scripts/video-plan.mjs`)
- [x] Per-video narration script + scene SRT
- [x] Per-video YouTube title / description / tags with next-video links
- [x] Real TL;DR source: authored `## خلاصهٔ فوری` section in every article (61/61), parsed by `src/lib/tldr.ts` — renderers never derive from headings
- [x] Deterministic 5-scene page (Hook → در یک خط → نکته‌های کلیدی → ته‌خط → Next video)
- [x] Playwright frame capture + ffmpeg encode
- [x] Pilot rendered: `video/out/ad-hominem.mp4` (1920×1080, 30fps, 34s)

## Phase 1 — Pipeline gaps (dev)

- [ ] **VO sync**: after a recording, set each scene's duration from measured VO
      audio; regenerates the timeline and SRT to match. Add
      `scripts/video-sync.mjs --slug=<slug> --vo=video/vo/<slug>.m4a`.
- [ ] **Word-level captions**: replace scene-level SRT with Whisper word
      timestamps (Persian) for readable burned captions. Keep scene SRT as fallback.
- [ ] **Local assets**: vendor Vazirmatn `.woff2` + `gsap.min.js` into
      `video/assets/` so renders are offline and deterministic.
- [ ] **Real IDs**: fill `<PLAYLIST_*>` / `<VIDEO_*>` placeholders in
      `video/plan.json` after first upload, so end cards and descriptions link.
- [ ] **Resume-safe batch**: skip videos with an existing `video/out/<slug>.mp4`;
      add `--force`.
- [ ] **QC contact sheet**: `ffmpeg tile` per video to spot-check frames before upload.

## Phase 2 — Record (you)

- [ ] Read `video/scripts/<slug>.md` (one section per scene = one take).
- [ ] Record named `video/vo/<slug>.m4a` (m4a/wav/mp3 all detected).
- [ ] Run `pnpm video:render <slug>` — VO is muxed automatically.
- [ ] Optional: `--captions` to burn subtitles.

## Phase 3 — Publish

- [ ] Create the 4 playlists on YouTube.
- [ ] Upload each MP4 with the title/description/tags from `video/plan.json`.
- [ ] Record the returned video + playlist IDs back into `video/plan.json`
      (or a `video/ids.json`) and re-render so links resolve.
- [ ] Thumbnails: export frame 1.5s per video (`ffmpeg -ss 1.5 -frames:v 1`).
- [ ] Add YouTube links to the site (`/learn/[lesson]` step cards + article page).

## Phase 4 — Site integration (dev)

- [ ] Add optional `video: <youtube-id>` to article frontmatter.
- [ ] Extend `src/lib/types.ts`, `scripts/validate-content.mjs`, admin form.
- [ ] Embed the player on `src/app/articles/[slug]/page.tsx` next to `TldrSlide`.
- [ ] Add a “تماشا در یوتیوب” link on each lesson step card.
- [ ] Cross-link every video description back to its article URL.

## Phase 5 — Remaining articles (optional)

27 articles are not in any path (`content/manifest.yaml → gaps.orphans`).
Options: a 5th playlist «تاکتیک‌های بیشتر», or short-form clips. Reuse the same
pipeline by adding a synthetic series to `scripts/video-plan.mjs`.

## Tracker

### مسیر اصلی: سواد قضاوت  `judgment-literacy`  (9 قسمت)
| # | video | slug | VO | render | thumb | upload |
|---|-------|------|----|--------|-------|--------|
| 1 | ادعا در برابر تفسیر | `claim-vs-interpretation` | ☐ | ☐ | ☐ | ☐ |
| 2 | ادعای دقیق؛ شرط لازم برای بحث | `precise-claims` | ☐ | ☐ | ☐ | ☐ |
| 3 | استیلمن‌نینگ؛ ساختن قوی‌ترین روایت از دیدگاه مخالف | `steelman-opponent` | ☐ | ☐ | ☐ | ☐ |
| 4 | ساختار استدلال: نقشه‌ای برای بحث | `structure-of-argument` | ☐ | ☐ | ☐ | ☐ |
| 5 | چگونه سؤال‌های بهتر بپرسیم؟ روشن کنیم، نه حمله کنیم | `asking-better-questions` | ☐ | ☐ | ☐ | ☐ |
| 6 | کیفیت شواهد: همهٔ شواهد یکسان ساخته نشده‌اند | `evidence-quality` | ☐ | ☐ | ☐ | ☐ |
| 7 | اطمینان و عدم قطعیت | `confidence-and-uncertainty` | ☐ | ☐ | ☐ | ☐ |
| 8 | ابطال‌پذیری و بازنگری | `falsifiability-and-revision` | ☐ | ☐ | ☐ | ☐ |
| 9 | پنج اصل بحثِ سازنده: برای فهمیدن، نه برنده شدن | `fair-effective-debate` | ☐ | ☐ | ☐ | ☐ |

### تشخیص و پاسخ به تاکتیک‌های انحرافی  `spotting-tactics`  (8 قسمت)
| # | video | slug | VO | render | thumb | upload |
|---|-------|------|----|--------|-------|--------|
| 1 | مغالطه چیست؟ خطا در استدلال، نه برچسب برای برنده شدن | `what-is-fallacy` | ☐ | ☐ | ☐ | ☐ |
| 2 | حمله شخصی: وقتی ادعا را رها می‌کنی تا به شخص حمله کنی | `ad-hominem` | ☐ | ☐ | ☐ | ☐ |
| 3 | مرد پوشالی: چرا نباید از نسخهٔ ضعیف‌تر یک ادعا دفاع کرد | `straw-man` | ☐ | ☐ | ☐ | ☐ |
| 4 | دوگانه کاذب: وقتی بحث را به اجبار بین دو گزینه محدود می‌کنی | `false-dilemma` | ☐ | ☐ | ☐ | ☐ |
| 5 | انحراف موضوع: وقتی سؤالی جدید جای سؤال اصلی را می‌گیرد | `red-herring` | ☐ | ☐ | ☐ | ☐ |
| 6 | استناد به مرجع: چرا «فلانی گفته» کافی نیست | `appeal-to-authority` | ☐ | ☐ | ☐ | ☐ |
| 7 | چه‌درباره‌گرایی: وقتی «اما فلانی هم…» جای ادعای اصلی را می‌گیرد | `whataboutism` | ☐ | ☐ | ☐ | ☐ |
| 8 | پاسخ به تاکتیک‌های انحرافی: بازگشت به قضاوت، نه جنگ | `responding-to-tactics` | ☐ | ☐ | ☐ | ☐ |

### مسیر پیشرفته: عمیق‌تر شدن  `deeper-curriculum`  (10 قسمت)
| # | video | slug | VO | render | thumb | upload |
|---|-------|------|----|--------|-------|--------|
| 1 | کیفیت شواهد: همهٔ شواهد یکسان ساخته نشده‌اند | `evidence-quality` | ☐ | ☐ | ☐ | ☐ |
| 2 | چهارچوب‌بندی و حذف: آنچه گفته می‌شود، آنچه نمی‌شود | `framing-and-omission` | ☐ | ☐ | ☐ | ☐ |
| 3 | توضیحات جایگزین: همیشه بیش از یک توضیح وجود دارد | `alternative-explanations` | ☐ | ☐ | ☐ | ☐ |
| 4 | همبستگی و علیت: چرا A و B با هم اتفاق می‌افتند | `correlation-and-causation` | ☐ | ☐ | ☐ | ☐ |
| 5 | تخصص و انگیزه‌ها | `expertise-and-incentives` | ☐ | ☐ | ☐ | ☐ |
| 6 | اقناع عاطفی | `emotional-persuasion` | ☐ | ☐ | ☐ | ☐ |
| 7 | پیش‌فرض پنهان: باورهایی که نگفته می‌مانند | `hidden-assumption` | ☐ | ☐ | ☐ | ☐ |
| 8 | انتخاب گزینشی شواهد: دیدن فقط نیمی از تصویر | `cherry-picking` | ☐ | ☐ | ☐ | ☐ |
| 9 | آزمایش باور — محک اصلی حرف‌کلاب | `belief-stress-test` | ☐ | ☐ | ☐ | ☐ |
| 10 | کی باید بگوییم «نمی‌دانم»؟ — قدرت نه گفتن به قطعیت | `when-to-say-i-dont-know` | ☐ | ☐ | ☐ | ☐ |

### اصول پایهٔ گفت‌وگو  `dialogue-basics`  (7 قسمت)
| # | video | slug | VO | render | thumb | upload |
|---|-------|------|----|--------|-------|--------|
| 1 | احترام به استقلال طرف مقابل | `dialogue-autonomy` | ☐ | ☐ | ☐ | ☐ |
| 2 | گوش دادن فعال: شنیدن برای فهمیدن، نه برای پاسخ دادن | `active-listening` | ☐ | ☐ | ☐ | ☐ |
| 3 | سکوت تاکتیکی: قدرت مکث در گفت‌وگو | `strategic-silence` | ☐ | ☐ | ☐ | ☐ |
| 4 | تکرار سه کلمهٔ آخر: آینه کردن برای عمیق‌تر شدن | `echo-last-three-words` | ☐ | ☐ | ☐ | ☐ |
| 5 | آهنگ کلام: بالا و پایین بردن صدا | `intonation-up-down` | ☐ | ☐ | ☐ | ☐ |
| 6 | لحن صدا: چطور صدایت پیام را عوض می‌کند | `tone-of-voice` | ☐ | ☐ | ☐ | ☐ |
| 7 | پرسش دربارهٔ نیت: چه زمانی بپرسیم «منظورت چیست؟» | `intent-question` | ☐ | ☐ | ☐ | ☐ |
