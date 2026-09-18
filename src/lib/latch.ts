import type { Latch } from "./types";

export type { Latch };

const LATCH_HEADING_RE = /^##\s*این\s*مطلب\s*به\s*چه\s*کارتان\s*می[\s\u200c]*آید\s*[؟?]?\s*$/;
const BULLET_RE = /^[-*]\s+(.+)$/;

function sectionLines(content: string): { lines: string[]; start: number; end: number } | null {
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

export function parseLatch(content: string): Latch | null {
  const found = sectionLines(content);
  if (!found) return null;
  const { lines, start, end } = found;

  const points: string[] = [];
  for (let i = start + 1; i < end; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    const b = BULLET_RE.exec(raw);
    if (b) points.push(b[1].replace(/\*\*/g, "").trim());
  }

  return { points };
}

export function stripLatch(content: string): string {
  const found = sectionLines(content);
  if (!found) return content;
  const { lines, start, end } = found;
  return [...lines.slice(0, start), ...lines.slice(end)]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
