#!/usr/bin/env node
/**
 * Interactive article rewriter.
 *
 *   pnpm rewrite
 *   pnpm rewrite --article <slug|file|number> --model <provider/model>
 *
 * Step 1 — pick an article from content/articles/*.mdx (live filter as you type)
 * Step 2 — pick a model (live filter over `opencode models`)
 * Step 3 — boom: `opencode run --agent article-editor -m <model> "<prompt>"`
 *           with inherited stdio so the terminal stays interactive.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync, spawnSync } from "node:child_process";
import readline from "node:readline";
import { stdin, stdout } from "node:process";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VOICE_PATH = "docs/EDITORIAL_VOICE.md";
const AGENT = "article-editor";
const AGENT_FILE = path.join(ROOT, ".opencode", "agent", `${AGENT}.md`);
const PAGE = 12;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--article" || a === "-a") out.article = argv[++i];
    else if (a === "--model" || a === "-m") out.model = argv[++i];
    else if (a === "--list-articles") out.listArticles = true;
    else if (a === "--list-models") out.listModels = true;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else if (!a.startsWith("-") && !out.article) out.article = a; // positional slug
  }
  return out;
}

function loadArticles() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx")).sort();
  return files.map((file, i) => {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    let title = file, slug = file.replace(/\.mdx$/, ""), status = "published";
    try {
      const { data } = matter(raw);
      title = data.title ?? title;
      slug = data.slug ?? slug;
      status = data.status ?? status;
    } catch { /* keep filename fallback */ }
    return { i: i + 1, file, slug, title: String(title).slice(0, 80), status };
  });
}

function defaultModel() {
  try {
    const raw = fs.readFileSync(AGENT_FILE, "utf8");
    const m = raw.match(/^model:\s*(.+)\s*$/m);
    if (m) return m[1].trim();
  } catch { /* ignore */ }
  return "9router/gemini/gemini-3.7-flash";
}

function loadModels() {
  const fallback = defaultModel();
  try {
    const out = execSync("opencode models", { encoding: "utf8", cwd: ROOT, timeout: 15000 });
    const ids = out.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("…") && l.includes("/"));
    if (ids.length) {
      // Default first, rest in listed order, deduped.
      return [...new Set([fallback, ...ids])];
    }
  } catch { /* fall through to fallback */ }
  return [fallback];
}

function resolveArticle(articles, query) {
  const q = String(query).trim();
  if (!q) return null;
  if (/^\d+$/.test(q)) {
    const byNum = articles.find((a) => a.i === Number(q));
    if (byNum) return byNum;
  }
  const exact = articles.find((a) => a.slug === q || a.file === q || a.file.replace(/\.mdx$/, "") === q);
  if (exact) return exact;
  const lower = q.toLowerCase();
  const hits = articles.filter(
    (a) => a.slug.toLowerCase().includes(lower) || a.title.toLowerCase().includes(lower)
  );
  if (hits.length === 1) return hits[0];
  return hits.length > 1 ? hits : null; // array = ambiguous, null = no match
}

function resolveModel(models, def, query) {
  const q = String(query ?? "").trim();
  if (!q) return def;
  if (/^\d+$/.test(q)) {
    const idx = Number(q) - 1;
    if (models[idx]) return models[idx];
    return null;
  }
  if (models.includes(q)) return q;
  const lower = q.toLowerCase();
  const hits = models.filter((m) => m.toLowerCase().includes(lower));
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) return hits;
  // Allow any custom provider/model the user types (e.g. brand-new model id).
  if (q.includes("/")) return q;
  return hits.length ? hits : null;
}

function buildPrompt(article) {
  const rel = `content/articles/${article.file}`;
  return (
    `Rewrite \`${rel}\` following \`${VOICE_PATH}\` (Talking Power / قدرت کلام). ` +
    `Read the voice file first, then the article, then rewrite the article file in place. ` +
    `Apply the Article Polish Gate checklist: real-situation hook, skill placement, ` +
    `one movement metaphor (no گارد), neutralize-don't-weaponize for attack tactics, ` +
    `debate-table link, P-U-I persuasion architecture, zero C-P-R-O traps, valid TL;DR + latch. ` +
    `Respect the تالار آموزش vs باشگاه naming law. Keep all agent structural rules.`
  );
}

// ── Live type-to-filter picker (TTY only) ────────────────────────────
// items: [{ key, search, value }]. Returns the picked item, { custom } when
// allowCustom accepts free text, or null on Esc / Ctrl-C.
function livePick({ title, items, format, initialSel = 0, allowCustom = false }) {
  return new Promise((resolve) => {
    let query = "", cursor = 0, sel = initialSel, rendered = 0, done = false;
    const W = stdout.columns || 80;

    const filtered = () => {
      const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!tokens.length) return items;
      const scored = [];
      for (let pos = 0; pos < items.length; pos++) {
        const item = items[pos];
        if (!tokens.every((t) => item.search.toLowerCase().includes(t))) continue;
        const key = item.key.toLowerCase();
        let rank = 2;
        if (key === tokens.join(" ")) rank = 0;
        else if (key.startsWith(tokens[0])) rank = 1;
        scored.push({ item, rank, pos });
      }
      scored.sort((a, b) => a.rank - b.rank || a.pos - b.pos);
      return scored.map((r) => r.item);
    };

    const cut = (s) => (s.length > W - 6 ? s.slice(0, W - 9) + "…" : s);

    const draw = () => {
      const list = filtered();
      if (sel >= list.length) sel = Math.max(0, list.length - 1);
      const lines = [];
      lines.push(`\x1B[1m${title}\x1B[0m`);
      const caret = query.slice(0, cursor) + "\x1B[7m" + (query[cursor] ?? " ") + "\x1B[0m" + query.slice(cursor + 1);
      lines.push(`> ${caret}`);
      const count = list.length === items.length ? `${items.length} items` : `${list.length}/${items.length} matches`;
      lines.push(`\x1B[2m${count} · type to filter · ↑↓ move · Enter select · Esc cancel\x1B[0m`);
      list.slice(0, PAGE).forEach((it, i) => {
        const line = cut(format(it));
        lines.push(i === sel ? `\x1B[36m❯ ${line}\x1B[0m` : `  ${line}`);
      });
      if (list.length === 0) {
        lines.push(allowCustom
          ? `  \x1B[2mno matches — Enter uses "${query.trim()}" as a custom model id\x1B[0m`
          : `  \x1B[2mno matches — keep typing or Esc to cancel\x1B[0m`);
      } else if (list.length > PAGE) {
        lines.push(`  \x1B[2m… ${list.length - PAGE} more\x1B[0m`);
      }
      let out = "";
      if (rendered > 0) out += `\x1B[${rendered}A`;
      out += "\x1B[0J" + lines.join("\n") + "\n";
      stdout.write(out);
      rendered = lines.length;
    };

    const finish = (value) => {
      if (done) return;
      done = true;
      stdin.removeListener("keypress", onKey);
      try { stdin.setRawMode(false); } catch { /* not a TTY */ }
      try { stdin.pause(); } catch { /* ignore */ }
      stdout.write("\x1B[?25h");
      resolve(value);
    };

    const onKey = (str, key = {}) => {
      if (key.ctrl && (key.name === "c" || key.name === "d")) { stdout.write("\n"); finish(null); return; }
      if (key.name === "escape") { stdout.write("\n"); finish(null); return; }
      if (key.name === "return" || key.name === "enter") {
        const list = filtered();
        if (list.length) { finish(list[Math.min(sel, list.length - 1)]); return; }
        if (allowCustom && query.trim().includes("/")) { finish({ custom: query.trim() }); return; }
        return; // nothing to confirm — keep typing
      }
      if (key.name === "up" || (key.name === "tab" && key.shift)) {
        const n = filtered().length;
        if (n) sel = (sel - 1 + n) % n;
        draw();
        return;
      }
      if (key.name === "down" || key.name === "tab") {
        const n = filtered().length;
        if (n) sel = (sel + 1) % n;
        draw();
        return;
      }
      if (key.name === "left") { cursor = Math.max(0, cursor - 1); draw(); return; }
      if (key.name === "right") { cursor = Math.min(query.length, cursor + 1); draw(); return; }
      if (key.name === "backspace") {
        if (cursor > 0) { query = query.slice(0, cursor - 1) + query.slice(cursor); cursor--; sel = 0; }
        draw();
        return;
      }
      if (key.name === "delete") {
        if (cursor < query.length) { query = query.slice(0, cursor) + query.slice(cursor + 1); sel = 0; }
        draw();
        return;
      }
      if (key.ctrl && key.name === "u") { query = ""; cursor = 0; sel = 0; draw(); return; }
      if (!key.ctrl && !key.meta && typeof str === "string" && [...str].length === 1 && str >= " ") {
        query = query.slice(0, cursor) + str + query.slice(cursor);
        cursor += str.length;
        sel = 0;
        draw();
      }
      // All other keys (arrows already handled, F-keys, etc.) are ignored.
    };

    readline.emitKeypressEvents(stdin);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("keypress", onKey);
    stdout.write("\x1B[?25l");
    draw();
  });
}

// ── Line-based fallback (pipes / non-TTY) ────────────────────────────
// `take(prompt)` answers one question. Two flavours: readline (live stdin
// that stays open) and canned lines slurped from a closed pipe — sequential
// readline questions race stdin EOF, so pipes must be read upfront.
function ask(rl, q) {
  return new Promise((res) => {
    if (rl.closed) return res(null);
    rl.question(q, (a) => res(a ?? null));
  });
}

function cannedTaker() {
  let lines;
  try {
    lines = fs.readFileSync(0, "utf8").split(/\r?\n/);
  } catch {
    lines = [];
  }
  let i = 0;
  return async (prompt) => {
    stdout.write(prompt);
    if (i >= lines.length) return null; // out of piped answers
    const a = lines[i++];
    stdout.write(a + "\n"); // echo so logs show what was picked
    return a;
  };
}

async function promptArticle(articles, take) {
  console.log(`\nStep 1/2 — Choose article (${articles.length} found):\n`);
  for (const a of articles) {
    const mark = a.status !== "published" ? ` [${a.status}]` : "";
    console.log(`  ${String(a.i).padStart(3)}. ${a.slug}${mark}\n       ${a.title}`);
  }
  for (;;) {
    const ans = await take("\nArticle (number, slug, or search text): ");
    if (ans == null) return null; // EOF (Ctrl-D) / no more piped lines
    const hit = resolveArticle(articles, ans);
    if (!hit) { console.log("  No match. Try again."); continue; }
    if (Array.isArray(hit)) {
      console.log(`  ${hit.length} matches:`);
      for (const h of hit.slice(0, 15)) console.log(`    ${h.i}. ${h.slug} — ${h.title}`);
      continue;
    }
    return hit;
  }
}

async function promptModel(models, def, take) {
  console.log(`\nStep 2/2 — Choose model (default: ${def}):\n`);
  models.slice(0, 30).forEach((m, i) => {
    console.log(`  ${String(i + 1).padStart(3)}. ${m}${m === def ? "  (default)" : ""}`);
  });
  for (;;) {
    const ans = await take(`\nModel [Enter = ${def}]: `);
    if (ans == null) return null; // EOF (Ctrl-D) / no more piped lines
    const hit = resolveModel(models, def, ans);
    if (!hit) { console.log("  No match. Try again."); continue; }
    if (Array.isArray(hit)) {
      console.log(`  ${hit.length} matches:`);
      for (const h of hit.slice(0, 15)) console.log(`    - ${h}`);
      continue;
    }
    return hit;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`
Usage:
  pnpm rewrite                        interactive: pick article → pick model → rewrite
  pnpm rewrite --article <slug>       skip step 1 (number, slug, filename, or search text)
  pnpm rewrite --model <provider/model>  skip step 2
  pnpm rewrite --list-articles | --list-models
`);
    return;
  }

  const articles = loadArticles();
  if (args.listArticles) {
    for (const a of articles) console.log(`${a.slug}\t${a.title}`);
    return;
  }
  const models = loadModels();
  const def = defaultModel();
  if (args.listModels) {
    for (const m of models) console.log(m);
    return;
  }

  const useLive = Boolean(stdin.isTTY && stdout.isTTY);
  // Fallback answering: readline while stdin stays open (terminal with
  // stdout redirected), canned piped lines otherwise (sequential readline
  // questions race a closing pipe, so it must be slurped upfront).
  let rl = null;
  let take = null;
  const getTake = () => {
    if (take) return take;
    if (stdin.isTTY) {
      rl = readline.createInterface({ input: stdin, output: stdout });
      take = (p) => ask(rl, p);
    } else {
      take = cannedTaker();
    }
    return take;
  };

  // ── Step 1: article ──────────────────────────────────────────────
  let article = args.article ? resolveArticle(articles, args.article) : null;
  if (args.article && !article) {
    console.error(`\n❌ No article matches "${args.article}".`);
    console.error("   Try `pnpm rewrite --list-articles` or run interactively.");
    process.exitCode = 1;
    return;
  }
  if (Array.isArray(article)) {
    console.log(`\n"${args.article}" matches ${article.length} articles — pick one below.`);
    article = null;
    args.article = null;
  }
  if (!article) {
    if (useLive) {
      const picked = await livePick({
        title: `Step 1/2 — Choose article (${articles.length})`,
        items: articles.map((a) => ({
          key: a.slug,
          search: `${a.slug} ${a.title} ${a.file}`,
          value: a,
        })),
        format: (it) => {
          const a = it.value;
          return `${a.slug} — ${a.title}${a.status !== "published" ? ` [${a.status}]` : ""}`;
        },
      });
      if (!picked) { console.log("Aborted."); process.exitCode = 130; return; }
      article = picked.value;
    } else {
      article = await promptArticle(articles, getTake());
      if (!article) { console.log("\nAborted."); if (rl) { rl.close(); rl = null; } try { stdin.pause(); } catch { /* ignore */ } process.exitCode = 130; return; }
    }
  }

  // ── Step 2: model ────────────────────────────────────────────────
  let model = args.model ? resolveModel(models, def, args.model) : null;
  if (args.model && !model) {
    console.error(`\n❌ No model matches "${args.model}".`);
    console.error("   Try `pnpm rewrite --list-models` or run interactively.");
    process.exitCode = 1;
    return;
  }
  if (Array.isArray(model)) {
    console.log(`\n"${args.model}" matches ${model.length} models — pick one below.`);
    model = null;
    args.model = null;
  }
  if (!model) {
    if (useLive) {
      const picked = await livePick({
        title: "Step 2/2 — Choose model (or type any provider/model id)",
        items: models.map((m) => ({ key: m, search: m, value: m })),
        format: (it) => (it.value === def ? `${it.value}  (default)` : it.value),
        allowCustom: true,
      });
      if (!picked) { console.log("Aborted."); process.exitCode = 130; return; }
      model = picked.custom ?? picked.value;
    } else {
      model = await promptModel(models, def, getTake());
      if (!model) { console.log("\nAborted."); if (rl) { rl.close(); rl = null; } try { stdin.pause(); } catch { /* ignore */ } process.exitCode = 130; return; }
    }
  }
  if (rl) { rl.close(); rl = null; }

  // ── Step 3: boom ─────────────────────────────────────────────────
  const prompt = buildPrompt(article);
  console.log(`\n→ Rewriting content/articles/${article.file}`);
  console.log(`  model: ${model}`);
  console.log(`  agent: ${AGENT}  |  voice: ${VOICE_PATH}\n`);
  console.log(`  $ opencode run --agent ${AGENT} -m ${model} "<prompt>"\n`);

  if (args.dryRun) {
    console.log("(dry-run: not launching opencode)");
    console.log(`\nPROMPT: ${prompt}`);
    if (rl) { rl.close(); rl = null; }
    try { stdin.pause(); } catch { /* ignore */ }
    process.exit(0);
  }

  const res = spawnSync("opencode", ["run", "--agent", AGENT, "-m", model, prompt], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (res.error) {
    console.error(`\n❌ Failed to launch opencode: ${res.error.message}`);
    console.error("   Is `opencode` on PATH? (expected at ~/.local/bin/opencode)");
    process.exit(1);
  }
  if (res.status !== 0) {
    console.error(`\n❌ opencode exited with code ${res.status}. The article may be unchanged — check git status.`);
    process.exit(res.status ?? 1);
  }
  console.log(`\n✅ Done. Validate with: pnpm content:validate`);
  if (rl) { try { rl.close(); } catch { /* ignore */ } rl = null; }
  try { stdin.pause(); } catch { /* ignore */ }
  try { stdin.setRawMode(false); } catch { /* not a TTY */ }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
