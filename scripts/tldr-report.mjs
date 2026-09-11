import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { parseTldr } from "./lib/tldr.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");

function valid(t) {
  return Boolean(t && t.points.length >= 2 && t.takeaway);
}

function main() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const missing = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
    const { data, content } = matter(raw);
    if ((data.status ?? "published") !== "published") continue;
    const t = parseTldr(content);
    if (!valid(t)) {
      const issues = [];
      if (!t) issues.push("no section");
      else {
        if (t.points.length < 2) issues.push(`${t.points.length} bullets`);
        if (!t.takeaway) issues.push("no ته‌خط");
      }
      missing.push({ slug: data.slug ?? f.replace(".mdx", ""), issues: issues.join(", ") });
    }
  }
  console.log(`TL;DR coverage: ${files.length - missing.length}/${files.length} published articles`);
  if (missing.length) {
    console.log("\nMissing / malformed:");
    for (const m of missing) console.log(`  • ${m.slug} — ${m.issues}`);
    process.exit(1);
  }
}

main();
