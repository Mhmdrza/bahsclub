import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { ROOT } from "./lib/video-content.mjs";

const VIDEO_DIR = path.join(ROOT, "video");
const HTML_DIR = path.join(VIDEO_DIR, "html");
const FRAMES_DIR = path.join(VIDEO_DIR, "frames");
const OUT_DIR = path.join(VIDEO_DIR, "out");
const VO_DIR = path.join(VIDEO_DIR, "vo");
const SRT_DIR = path.join(VIDEO_DIR, "srt");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const slugs = args.filter((a) => !a.startsWith("--"));
const fps = Number(getFlag("--fps") ?? 30);
const burnCaptions = flags.has("--captions");
const skipCapture = flags.has("--skip-capture");

function getFlag(name) {
  const hit = args.find((a) => a.startsWith(name + "="));
  return hit ? hit.split("=")[1] : null;
}

function findVo(slug) {
  for (const ext of ["m4a", "wav", "mp3", "aac"]) {
    const p = path.join(VO_DIR, `${slug}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function launchChromium(chromium) {
  const opts = { args: ["--force-color-profile=srgb", "--font-render-hinting=none"] };
  const attempts = process.env.CHROME_PATH
    ? [{ ...opts, executablePath: process.env.CHROME_PATH }, { ...opts, channel: "chrome" }, opts]
    : [{ ...opts, channel: "chrome" }, opts];
  let lastErr;
  for (const a of attempts) {
    try {
      return await chromium.launch(a);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function capture(slug) {  const htmlPath = path.join(HTML_DIR, `${slug}.html`);
  if (!fs.existsSync(htmlPath)) throw new Error(`missing ${htmlPath} — run video:html first`);

  const outFrames = path.join(FRAMES_DIR, slug);
  fs.rmSync(outFrames, { recursive: true, force: true });
  fs.mkdirSync(outFrames, { recursive: true });

  const { chromium } = await import("playwright");
  const browser = await launchChromium(chromium);
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__TLDR && window.__TLDR.duration > 0);
  await page.evaluate(async () => {
    const faces = [
      "400 38px Vazirmatn",
      "500 24px Vazirmatn",
      "700 28px Vazirmatn",
      "900 84px Vazirmatn",
    ];
    await Promise.all(faces.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
  });
  await page.evaluate(() => window.__TLDR.seek(0));

  const duration = await page.evaluate(() => window.__TLDR.duration);
  const totalFrames = Math.ceil(duration * fps);
  const stage = await page.$("#stage");
  process.stdout.write(`  ${slug}: ${duration.toFixed(1)}s → ${totalFrames} frames `);

  for (let f = 0; f < totalFrames; f++) {
    await page.evaluate((t) => window.__TLDR.seek(t), f / fps);
    await stage.screenshot({ path: path.join(outFrames, `${String(f).padStart(5, "0")}.png`) });
    if (f % 30 === 0) process.stdout.write(".");
  }
  await browser.close();
  process.stdout.write(" done\n");
}

function encode(slug) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const frameGlob = path.join(FRAMES_DIR, slug, "%05d.png");
  const out = path.join(OUT_DIR, `${slug}.mp4`);
  const vo = findVo(slug);
  const srt = path.join(SRT_DIR, `${slug}.srt`);

  const cmd = ["-y", "-framerate", String(fps), "-i", frameGlob];
  if (vo) cmd.push("-i", vo);
  cmd.push("-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium");
  if (vo) {
    cmd.push("-c:a", "aac", "-b:a", "192k", "-map", "0:v", "-map", "1:a", "-shortest");
  } else {
    cmd.push("-an");
  }
  if (burnCaptions && fs.existsSync(srt)) {
    const style = "FontName=Vazirmatn,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H80000000,BorderStyle=3,Outline=2,Shadow=0,Alignment=2,MarginV=48";
    cmd.push("-vf", `subtitles=${srt.replace(/:/g, "\\:")}:force_style='${style}'`);
  }
  cmd.push("-movflags", "+faststart", out);
  execFileSync("ffmpeg", cmd, { stdio: ["ignore", "ignore", "inherit"] });
  const size = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
  console.log(`  ✓ video/out/${slug}.mp4 (${size} MB)${vo ? " + VO" : " (silent)"}${burnCaptions && fs.existsSync(srt) ? " + captions" : ""}`);
}

async function main() {
  const plan = JSON.parse(fs.readFileSync(path.join(VIDEO_DIR, "plan.json"), "utf8"));
  const list = slugs.length ? slugs : Object.keys(plan.videos);
  for (const slug of list) {
    if (!plan.videos[slug]) {
      console.warn(`⚠ unknown slug: ${slug}`);
      continue;
    }
    if (!skipCapture) await capture(slug);
    encode(slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
