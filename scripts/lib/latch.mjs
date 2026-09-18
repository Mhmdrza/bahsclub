// Reader "latch" section — the bridge between reading an article and using it.
// Mirrors scripts/lib/tldr.mjs so both sections are parsed/stripped the same way.

const LATCH_HEADING_RE = /^##\s*این\s*مطلب\s*به\s*چه\s*کارتان\s*می[\s\u200c]*آید\s*[؟?]?\s*$/;
const TLDR_HEADING_RE = /^##\s*(?:خلاصهٔ?\s*فوری|چکیده|TL;DR)\s*$/i;
const KEY_IDEA_RE = /^>\s*\*\*ایده[ٔ]?\s*کلیدی/;
const BULLET_RE = /^[-*]\s+(.+)$/;

export const LATCH_HEADING = "## این مطلب به چه کارتان می‌آید؟";

function sectionRange(content) {
  const lines = content.split("\n");
  const start = lines.findIndex((l) => LATCH_HEADING_RE.test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return { lines, start, end };
}

function clean(text) {
  return String(text).replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function parseLatch(content) {
  const found = sectionRange(content);
  if (!found) return null;
  const { lines, start, end } = found;
  const points = [];
  for (let i = start + 1; i < end; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    const b = BULLET_RE.exec(raw);
    if (b) points.push(b[1].replace(/\*\*/g, "").trim());
  }
  return { points };
}

export function stripLatch(content) {
  const found = sectionRange(content);
  if (!found) return content;
  const { lines, start, end } = found;
  return [...lines.slice(0, start), ...lines.slice(end)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildLatchSection(entry) {
  const points = (entry?.points ?? []).map(clean).filter(Boolean);
  const blocks = points.map((p) => `- ${p}`);
  return `${LATCH_HEADING}\n\n${blocks.join("\n")}\n`;
}

/** Insert (or replace) the latch right after `## خلاصهٔ فوری`, falling back to
 *  the key-idea blockquote, then to just after the H1. Idempotent. */
export function applyLatch(content, entry) {
  const cleaned = stripLatch(content);
  const lines = cleaned.split("\n");

  let anchor = -1;
  const tldrStart = lines.findIndex((l) => TLDR_HEADING_RE.test(l));
  if (tldrStart !== -1) {
    for (let i = tldrStart + 1; i < lines.length; i++) {
      if (/^##\s+/.test(lines[i])) {
        anchor = i - 1;
        break;
      }
    }
    if (anchor === -1) anchor = lines.length - 1;
  } else {
    const keyIdea = lines.findIndex((l) => KEY_IDEA_RE.test(l));
    if (keyIdea !== -1) {
      anchor = keyIdea;
    } else {
      const h1 = lines.findIndex((l) => /^#\s+/.test(l));
      anchor = h1 === -1 ? 0 : h1 + 1;
    }
  }

  if (anchor < 0) anchor = 0;

  const before = lines.slice(0, anchor + 1).join("\n").replace(/\s+$/, "");
  const after = lines.slice(anchor + 1).join("\n").replace(/^\s+/, "");
  const section = buildLatchSection(entry);
  const joined = after ? `${before}\n\n${section}\n${after}` : `${before}\n\n${section}`;
  return joined.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
