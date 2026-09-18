import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { parseLatch } from "./lib/latch.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");

function valid(l) {
  return Boolean(l && l.points.length >= 2);
}

function main() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const missing = [];
  let published = 0;
  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
    const { data, content } = matter(raw);
    if ((data.status ?? "published") !== "published") continue;
    published++;
    const l = parseLatch(content);
    if (!valid(l)) {
      const issues = !l ? "no section" : `${l.points.length} bullets`;
      missing.push({ slug: data.slug ?? f.replace(".mdx", ""), issues });
    }
  }
  console.log(`Latch coverage: ${published - missing.length}/${published} published articles`);
  if (missing.length) {
    console.log("\nMissing / malformed:");
    for (const m of missing) console.log(` • ${m.slug} — ${m.issues}`);
    process.exit(1);
  }
}

main();
