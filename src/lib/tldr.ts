import type { Tldr } from "./types";

export type { Tldr };

const TLDR_HEADING_RE = /^##\s*(?:خلاصهٔ?\s*فوری|چکیده|TL;DR)\s*$/i;
const LINE_RE = /^\*\*\s*در\s*یک\s*خط\s*:\s*\*\*\s*(.+)$/;
const TAKEAWAY_RE = /^\*\*\s*(?:ته[\s\u200c]*خط|نتیجه|حرف[\s\u200c]*آخر)\s*:\s*\*\*\s*(.+)$/;
const BULLET_RE = /^[-*]\s+(.+)$/;

function sectionLines(content: string): { lines: string[]; start: number; end: number } | null {
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

export function parseTldr(content: string): Tldr | null {
  const found = sectionLines(content);
  if (!found) return null;
  const { lines, start, end } = found;

  let line: string | null = null;
  let takeaway: string | null = null;
  const points: string[] = [];

  for (let i = start + 1; i < end; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    const l = LINE_RE.exec(raw);
    if (l) {
      line = l[1].trim();
      continue;
    }
    const t = TAKEAWAY_RE.exec(raw);
    if (t) {
      takeaway = t[1].trim();
      continue;
    }
    const b = BULLET_RE.exec(raw);
    if (b) {
      points.push(b[1].replace(/\*\*/g, "").trim());
    }
  }

  return { line, points, takeaway };
}

export function stripTldr(content: string): string {
  const found = sectionLines(content);
  if (!found) return content;
  const { lines, start, end } = found;
  return [...lines.slice(0, start), ...lines.slice(end)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
