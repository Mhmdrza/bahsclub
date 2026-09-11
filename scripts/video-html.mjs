import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/video-content.mjs";
import { escapeHtml } from "./lib/video-content.mjs";

const VIDEO_DIR = path.join(ROOT, "video");
const PLAN_PATH = path.join(VIDEO_DIR, "plan.json");
const OUT_DIR = path.join(VIDEO_DIR, "html");
export const FPS = 30;

const CSS = `
  html, body { margin: 0; padding: 0; background: #000; }
  .frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .stage {
    position: relative; width: 1920px; height: 1080px; flex: none; overflow: hidden;
    background:
      radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.18) 0%, transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.12) 0%, transparent 45%),
      linear-gradient(145deg, #070d1e 0%, #030712 100%);
    font-family: Vazirmatn, system-ui, sans-serif; color: #f4f4f5;
  }
  .scrim {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .glow { position: absolute; border-radius: 50%; z-index: 1; filter: blur(100px); pointer-events: none; }
  .scene { position: absolute; inset: 0; display: none; flex-direction: column; justify-content: center; padding: 0 100px; z-index: 2; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700;
    color: #60a5fa; margin-bottom: 28px; width: fit-content;
    background: rgba(37,99,235,0.12); border: 1px solid rgba(96,165,250,0.25);
    padding: 6px 16px; border-radius: 9999px;
  }
  .dash { width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 12px #38bdf8; }
  .title-lg { font-size: 84px; font-weight: 900; line-height: 1.25; color: #fff; max-width: 1500px; margin: 0; text-shadow: 0 4px 24px rgba(0,0,0,0.4); }
  .accent { background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .body-lg { font-size: 38px; font-weight: 400; line-height: 1.6; color: #cbd5e1; max-width: 1400px; margin: 24px 0 0; }
  .quote-card {
    margin-top: 28px; padding: 32px 40px; background: rgba(15,23,42,0.65); backdrop-filter: blur(12px);
    border-right: 6px solid #38bdf8; border-radius: 0 20px 20px 0;
    border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08);
    border-left: 1px solid rgba(255,255,255,0.08); box-shadow: 0 12px 36px rgba(0,0,0,0.35); max-width: 1400px;
  }
  .quote-card .body-lg { margin-top: 0; color: #e2e8f0; }
  .meta { display: inline-flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 500; color: #94a3b8; margin-top: 40px; }
  .meta-tag { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 4px 14px; border-radius: 8px; color: #cbd5e1; }
  .list { list-style: none; margin: 32px 0 0; padding: 0; max-width: 1400px; }
  .list li {
    display: flex; align-items: center; gap: 20px; font-size: 40px; font-weight: 600; color: #e2e8f0;
    padding: 18px 28px; margin-bottom: 18px; border-radius: 16px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  }
  .list li .num { flex: none; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center;
    font-size: 26px; font-weight: 800; color: #0c1220; background: linear-gradient(135deg, #60a5fa, #38bdf8); }
  .cta-box {
    display: flex; align-items: center; justify-content: space-between; margin-top: 40px; max-width: 1400px;
    background: linear-gradient(135deg, rgba(30,58,138,0.4) 0%, rgba(15,23,42,0.6) 100%);
    border: 1px solid rgba(96,165,250,0.3); padding: 28px 36px; border-radius: 20px;
  }
  .cta-badge { font-size: 28px; font-weight: 700; background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(37,99,235,0.4); }
  .brand { position: absolute; bottom: 44px; left: 100px; z-index: 3; font-size: 24px; font-weight: 700; color: #64748b; letter-spacing: 1px; }
  .brand b { color: #38bdf8; }
  .progress { position: absolute; bottom: 48px; right: 100px; z-index: 3; font-size: 22px; font-weight: 600; color: #64748b; }
`;

function sceneHtml(sc, i) {
  const eye = `<span class="eyebrow" id="s${i}-eye"><span class="dash"></span>${escapeHtml(sc.eyebrow)}</span>`;
  const title = `<h1 class="title-lg" id="s${i}-title"${sc.kind === "hook" ? '><span class="accent">' + escapeHtml(sc.title) + "</span>" : ">" + escapeHtml(sc.title) + "</h1>"}`;

  if (sc.kind === "hook") {
    const meta = (sc.meta ?? [])
      .map((m) => `<span class="meta-tag">${escapeHtml(m)}</span>`)
      .join("");
    return `<div class="scene" id="s${i}">
      ${eye}
      ${title}
      <p class="body-lg" id="s${i}-body">${escapeHtml(sc.body)}</p>
      <div class="meta" id="s${i}-meta">${meta}</div>
    </div>`;
  }

  if (sc.kind === "idea") {
    const card = sc.body
      ? `<div class="quote-card" id="s${i}-body"><p class="body-lg">${escapeHtml(sc.body)}</p></div>`
      : "";
    return `<div class="scene" id="s${i}">
      ${eye}
      ${title}
      ${card}
    </div>`;
  }

  if (sc.kind === "points" || sc.kind === "agenda") {
    const items = (sc.bullets ?? [])
      .map((b, n) => `<li><span class="num">${n + 1}</span>${escapeHtml(b)}</li>`)
      .join("");
    return `<div class="scene" id="s${i}">
      ${eye}
      ${title}
      <ul class="list" id="s${i}-list">${items}</ul>
    </div>`;
  }

  if (sc.kind === "takeaway") {
    return `<div class="scene" id="s${i}">
      ${eye}
      ${title}
      <div class="cta-box" id="s${i}-cta"><span class="cta-badge">حرف‌کلاب · تمرین و مثال در مقالهٔ کامل</span></div>
    </div>`;
  }

  // next
  return `<div class="scene" id="s${i}">
    ${eye}
    ${title}
    <p class="body-lg" id="s${i}-body">${escapeHtml(sc.body)}</p>
    <div class="cta-box" id="s${i}-cta"><span class="cta-badge">${escapeHtml(sc.cta ?? "حرف‌کلاب")}</span></div>
  </div>`;
}

function timelineScript(scenes) {
  const lines = [];
  lines.push(`const tl = gsap.timeline({ paused: true, repeat: 0 });`);
  lines.push(`gsap.set('.scene', { display: 'none', opacity: 0 });`);
  lines.push(`gsap.fromTo('#glowA', { opacity: 0.22 }, { opacity: 0.35, duration: ${scenes.reduce((s, c) => s + c.duration, 0).toFixed(2)}, ease: 'sine.inOut' });`);
  lines.push(`gsap.fromTo('#glowB', { opacity: 0.15 }, { opacity: 0.25, duration: ${scenes.reduce((s, c) => s + c.duration, 0).toFixed(2)}, ease: 'sine.inOut' });`);

  let t = 0;
  scenes.forEach((sc, i) => {
    const start = t;
    const enter = start + 0.15;
    lines.push(`tl.set('#s${i}', { display: 'flex', opacity: 0 }, ${start.toFixed(2)});`);
    lines.push(`tl.to('#s${i}', { opacity: 1, duration: 0.25, ease: 'power2.out' }, ${(start + 0.05).toFixed(2)});`);
    lines.push(`tl.fromTo('#s${i}-eye', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, ${enter.toFixed(2)});`);
    lines.push(`tl.fromTo('#s${i}-title', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, ${(enter + 0.35).toFixed(2)});`);
    const bodySel = sc.kind === "points" || sc.kind === "agenda" ? `#s${i}-list li` : `#s${i}-body, #s${i}-meta, #s${i}-cta`;
    lines.push(`tl.fromTo(${JSON.stringify(bodySel)}, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, ${(enter + 0.9).toFixed(2)});`);
    const end = start + sc.duration;
    if (i < scenes.length - 1) {
      lines.push(`tl.to('#s${i}', { opacity: 0, duration: 0.3, ease: 'power2.in' }, ${(end - 0.3).toFixed(2)});`);
      lines.push(`tl.set('#s${i}', { display: 'none' }, ${end.toFixed(2)});`);
    }
    t = end;
  });
  lines.push(`tl.to({ d: 0 }, { d: 1, duration: 0.7, ease: 'none' }, ${(t - 0.7).toFixed(2)});`);
  lines.push(`window.__TLDR = { timeline: tl, duration: ${t.toFixed(3)}, fps: ${FPS}, seek: (x) => { tl.pause(); tl.seek(x); } };`);
  return lines.join("\n");
}

function renderHtml(video) {
  const scenes = video.scenes;
  const membership = video.memberships[0];
  const progress = membership ? `قسمت ${membership.index + 1} از ${membership.total}` : "";
  const body = scenes.map((sc, i) => sceneHtml(sc, i)).join("\n");

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(video.title)} — video</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>${CSS}</style>
</head>
<body>
  <div class="frame">
    <div class="stage" id="stage">
      <div class="scrim"></div>
      <div class="glow" id="glowA" style="width:700px;height:700px;top:-150px;right:-100px;background:#2563eb;opacity:.22"></div>
      <div class="glow" id="glowB" style="width:500px;height:500px;bottom:-100px;left:-100px;background:#06b6d4;opacity:.15"></div>
      ${body}
      <div class="brand">حرف<b>‌</b>کلاب</div>
      <div class="progress">${escapeHtml(progress)}</div>
    </div>
  </div>
  <script>${timelineScript(scenes)}</script>
</body>
</html>
`;
}

function main() {
  const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
  const targets = process.argv.slice(2);
  const slugs = targets.length ? targets : Object.keys(plan.videos);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const slug of slugs) {
    const video = plan.videos[slug];
    if (!video) {
      console.warn(`⚠ unknown slug: ${slug}`);
      continue;
    }
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), renderHtml(video), "utf8");
    console.log(`✓ video/html/${slug}.html (${video.totalDuration}s)`);
  }
}

main();
