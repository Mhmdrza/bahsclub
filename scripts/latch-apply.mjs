import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyLatch } from "./lib/latch.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");

function jsonFiles(args) {
  const out = [];
  for (const a of args) {
    const p = path.resolve(a);
    if (fs.statSync(p).isDirectory()) {
      out.push(...fs.readdirSync(p).filter((f) => f.endsWith(".json")).map((f) => path.join(p, f)));
    } else {
      out.push(p);
    }
  }
  return out;
}

function main() {
  const files = jsonFiles(process.argv.slice(2));
  if (!files.length) {
    console.error("Usage: node scripts/latch-apply.mjs <batch.json|dir> [...]");
    process.exit(1);
  }
  let applied = 0;
  let skipped = 0;
  let missing = 0;
  for (const file of files) {
    const batch = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const [slug, entry] of Object.entries(batch)) {
      const points = (entry?.points ?? []).map((p) => String(p).trim()).filter(Boolean);
      if (points.length < 2) {
        console.warn(`  ⚠ ${slug}: needs >=2 bullet points (got ${points.length}) — skipped`);
        skipped++;
        continue;
      }
      const target = path.join(ARTICLES_DIR, `${slug}.mdx`);
      if (!fs.existsSync(target)) {
        console.warn(`  ⚠ no article: ${slug}`);
        missing++;
        continue;
      }
      const raw = fs.readFileSync(target, "utf8");
      fs.writeFileSync(target, applyLatch(raw, { points }), "utf8");
      applied++;
    }
    console.log(`✓ ${path.basename(file)}`);
  }
  console.log(
    `\n✓ applied ${applied} latch section(s)` +
      (skipped ? `, ${skipped} skipped` : "") +
      (missing ? `, ${missing} missing article(s)` : "")
  );
  if (skipped || missing) process.exit(1);
}

main();
