const TLDR_HEADING_RE = /^##\s*(?:خلاصهٔ?\s*فوری|چکیده|TL;DR)\s*$/i;
const LINE_RE = /^\*\*\s*در\s*یک\s*خط\s*:\s*\*\*\s*(.+)$/;
const TAKEAWAY_RE = /^\*\*\s*(?:ته[\s\u200c]*خط|نتیجه|حرف[\s\u200c]*آخر)\s*:\s*\*\*\s*(.+)$/;
const BULLET_RE = /^[-*]\s+(.+)$/;

function sectionRange(content) {
  const lines = content.split("\n");
  const start = lines.findIndex((l) => TLDR_HEADING_RE.test(l));
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

export function parseTldr(content) {
  const found = sectionRange(content);
  if (!found) return null;
  const { lines, start, end } = found;
  let line = null;
  let takeaway = null;
  const points = [];
  for (let i = start + 1; i < end; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    const l = LINE_RE.exec(raw);
    if (l) { line = l[1].trim(); continue; }
    const t = TAKEAWAY_RE.exec(raw);
    if (t) { takeaway = t[1].trim(); continue; }
    const b = BULLET_RE.exec(raw);
    if (b) points.push(b[1].replace(/\*\*/g, "").trim());
  }
  return { line, points, takeaway };
}

export function stripTldr(content) {
  const found = sectionRange(content);
  if (!found) return content;
  const { lines, start, end } = found;
  return [...lines.slice(0, start), ...lines.slice(end)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildTldrSection(tldr) {
  const clean = (s) => String(s).replace(/\s+/g, " ").trim();
  const blocks = [];
  if (tldr.line) blocks.push(`**در یک خط:** ${clean(tldr.line)}`);
  if (tldr.points?.length) blocks.push(tldr.points.map((p) => `- ${clean(p)}`).join("\n"));
  if (tldr.takeaway) blocks.push(`**ته‌خط:** ${clean(tldr.takeaway)}`);
  return `## خلاصهٔ فوری\n\n${blocks.join("\n\n")}\n`;
}

export function applyTldr(content, tldr) {
  const cleaned = stripTldr(content).replace(/\s+$/, "") + "\n";
  const section = buildTldrSection(tldr);
  const lines = cleaned.split("\n");

  const ideaIdx = lines.findIndex((l) => /^>\s*\*\*ایده[ٔ]?\s*کلیدی/.test(l));
  const h2Idx = lines.findIndex((l) => /^##\s+/.test(l));
  const insertAt = ideaIdx !== -1 ? ideaIdx + 1 : h2Idx !== -1 ? h2Idx : 1;

  const before = lines.slice(0, insertAt).join("\n").replace(/\s+$/, "");
  const after = lines.slice(insertAt).join("\n").replace(/^\s+/, "");
  return `${before}\n\n${section}\n${after}`.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
