import test from "node:test";
import assert from "node:assert/strict";
import {
  parseLatch,
  stripLatch,
  applyLatch,
  buildLatchSection,
} from "./latch.mjs";

const HEADING = "## این مطلب به چه کارتان می‌آید؟";

const ARTICLE = `# عنوان

> **ایده کلیدی:** خط اصلی.

## خلاصهٔ فوری

- نکتهٔ اول خلاصه.
- نکتهٔ دوم خلاصه.

**ته‌خط:** جمع‌بندی.

## این تاکتیک چیست؟

بدنه.

## تمرین

تمرین.
`;

test("S1 parseLatch reads points and ignores TL;DR bullets", () => {
  const withLatch = `${ARTICLE.replace(
    "## این تاکتیک چیست؟",
    `${HEADING}\n\n- از این به بعد می‌توانی هزینه را ببینی.\n- تا وقتی این را نشناسی، هر بار فریب می‌خوری.\n\n## این تاکتیک چیست؟`
  )}`;
  const latch = parseLatch(withLatch);
  assert.ok(latch, "latch section should be found");
  assert.equal(latch.points.length, 2, `expected 2 points, got ${JSON.stringify(latch.points)}`);
  assert.match(latch.points[0], /هزینه را ببینی/, "first latch point mismatch");
  assert.ok(
    !latch.points.some((p) => p.includes("خلاصه")),
    `latch must not swallow TL;DR bullets: ${JSON.stringify(latch.points)}`
  );
});

test("S2 parseLatch returns null when section absent", () => {
  assert.equal(parseLatch(ARTICLE), null);
});

test("S3 buildLatchSection emits heading + bullets", () => {
  const section = buildLatchSection({ points: [" الف ", "ب"] });
  assert.ok(section.startsWith(HEADING), `heading mismatch: ${JSON.stringify(section)}`);
  assert.match(section, /^- الف$/m, "first bullet should be trimmed and emitted");
  assert.match(section, /^- ب$/m, "second bullet emitted");
});

test("S4 applyLatch places section after خلاصهٔ فوری and is idempotent", () => {
  const once = applyLatch(ARTICLE, { points: ["دستاورد یک", "هزینهٔ دو"] });
  const twice = applyLatch(once, { points: ["دستاورد یک", "هزینهٔ دو"] });

  assert.equal(once, twice, "applyLatch must be idempotent");

  const onceLines = once.split("\n");
  const tldrIdx = onceLines.findIndex((l) => l.startsWith("## خلاصهٔ فوری"));
  const latchIdx = onceLines.findIndex((l) => l === HEADING);
  const bodyIdx = onceLines.findIndex((l) => l === "## این تاکتیک چیست؟");
  assert.ok(tldrIdx !== -1 && latchIdx !== -1 && bodyIdx !== -1, "all sections present");
  assert.ok(
    tldrIdx < latchIdx && latchIdx < bodyIdx,
    `order wrong: tldr=${tldrIdx} latch=${latchIdx} body=${bodyIdx}`
  );

  const latch = parseLatch(once);
  assert.equal(latch.points.length, 2, "points survive round-trip");
  assert.equal(parseLatch(stripLatch(once)), null, "stripLatch removes the section");
});

test("S4b applyLatch appends after LAST section when خلاصهٔ فوری is final", () => {
  const noTrailing = `# ت\n\n> **ایده کلیدی:** x\n\n## خلاصهٔ فوری\n\n- a\n- b\n\n**ته‌خط:** c\n`;
  const out = applyLatch(noTrailing, { points: ["y"] });
  const lines = out.split("\n");
  assert.ok(lines.includes(HEADING), "latch inserted");
  assert.ok(
    lines.findIndex((l) => l === HEADING) > lines.findIndex((l) => l.startsWith("**ته‌خط:**")),
    "latch must come after takeaway"
  );
});
