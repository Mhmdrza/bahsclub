"use client";

import { useEffect, useRef, useState } from "react";
import type { Tldr } from "@/lib/types";

interface TldrSlideProps {
  title: string;
  description: string;
  keyIdea: string | null;
  tldr: Tldr | null;
  readingTime: number;
  category: string;
}

export function TldrSlide({ title, description, keyIdea, tldr, readingTime, category }: TldrSlideProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const line = tldr?.line ?? keyIdea ?? null;
  const points = tldr?.points ?? [];
  const takeaway = tldr?.takeaway ?? null;
  const hasContent = Boolean(line || points.length || takeaway);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !hasContent) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let resizeHandler: (() => void) | null = null;

    import("gsap").then(({ default: gsap }) => {
      if (!elRef.current) return;

      const stage = el.querySelector(".tldr-stage") as HTMLElement;
      function fit() {
        const w = el!.clientWidth;
        const h = el!.clientHeight;
        stage.style.transform = "scale(" + Math.min(w / 1920, h / 1080) + ")";
      }
      stage.style.opacity = "0";
      fit();
      resizeHandler = fit;
      window.addEventListener("resize", fit);
      stage.style.opacity = "1";

      const s = (id: string) => el.querySelector("#" + id) as HTMLElement | null;
      const ids = ["s1", "s2", "s3", "s4"].filter((id) => s(id));
      const scenes = ids.map((id) => "#" + id);

      tl = gsap.timeline({ paused: true, repeat: -1 });
      scenes.forEach((sel) => tl!.set(sel, { opacity: 0, visibility: "hidden", display: "none" }));
      tl.set(scenes[0], { opacity: 1, visibility: "visible", display: "flex" });

      tl.fromTo(s("glowA")!, { opacity: 0.22 }, { opacity: 0.35, duration: 3, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.fromTo(s("glowB")!, { opacity: 0.15 }, { opacity: 0.25, duration: 3.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.5);

      let t = 0;
      const durations: Record<string, number> = { s1: 4.2, s2: 3.8, s3: 6, s4: 5 };
      scenes.forEach((sel, i) => {
        const start = t;
        const enter = start + 0.15;
        if (i > 0) {
          tl!.set(sel, { display: "flex", visibility: "visible", opacity: 0 }, start);
          tl!.to(sel, { opacity: 1, duration: 0.25, ease: "power2.out" }, start + 0.05);
          tl!.to(scenes[i - 1], { opacity: 0, duration: 0.3, ease: "power2.in" }, start - 0.3);
          tl!.set(scenes[i - 1], { display: "none" }, start);
        }
        tl!.fromTo(`#${ids[i]}-eye`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, enter);
        tl!.fromTo(`#${ids[i]}-title`, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, enter + 0.35);
        const bodySel = `#${ids[i]}-list li, #${ids[i]}-body, #${ids[i]}-meta, #${ids[i]}-cta`;
        tl!.fromTo(bodySel, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power3.out" }, enter + 0.9);
        const end = start + (durations[ids[i]] ?? 5);
        if (i < scenes.length - 1) {
          tl!.to(sel, { opacity: 0, duration: 0.3, ease: "power2.in" }, end - 0.3);
          tl!.set(sel, { display: "none" }, end);
        }
        t = end;
      });
      tl.to({ dummy: 0 }, { dummy: 1, duration: 4, ease: "none" }, t);

      setAnimated(true);
      tl.play();
    });

    return () => {
      if (tl) tl.kill();
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
    };
  }, [hasContent, line, points.length, takeaway]);

  return (
    <section aria-label="خلاصهٔ فوری" className="mb-10 overflow-hidden rounded-2xl border border-border bg-background">
      <div className={animated ? "relative aspect-[16/9] w-full" : "relative w-full"} ref={elRef}>
        <style>{`
          .tldr-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
          .tldr-stage {
            position: relative; width: 1920px; height: 1080px; flex: none; overflow: hidden;
            background: radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.18) 0%, transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.12) 0%, transparent 45%),
                        linear-gradient(145deg, #070d1e 0%, #030712 100%);
            font-family: Vazirmatn, system-ui, sans-serif; color: #f4f4f5;
            border-radius: 24px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }
          .tldr-scrim {
            position: absolute; inset: 0; pointer-events: none; z-index: 0;
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 48px 48px;
          }
          .tldr-glow { position: absolute; border-radius: 50%; z-index: 1; filter: blur(100px); pointer-events: none; }
          .tldr-scene { position: absolute; inset: 0; display: none; flex-direction: column; justify-content: center; padding: 0 100px; z-index: 2; }
          .tldr-eyebrow {
            display: inline-flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700;
            color: #60a5fa; margin-bottom: 28px; width: fit-content;
            background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(96, 165, 250, 0.25);
            padding: 6px 16px; border-radius: 9999px;
          }
          .tldr-dash { width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 12px #38bdf8; }
          .tldr-h1 { font-size: 84px; font-weight: 900; line-height: 1.25; color: #ffffff; max-width: 1400px; margin: 0; text-shadow: 0 4px 24px rgba(0,0,0,0.4); }
          .tldr-h1 .accent { background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .tldr-body { font-size: 38px; font-weight: 400; line-height: 1.6; color: #cbd5e1; max-width: 1300px; margin-top: 24px; }
          .tldr-list { list-style: none; margin: 28px 0 0; padding: 0; max-width: 1400px; }
          .tldr-list li { display: flex; align-items: center; gap: 20px; font-size: 40px; font-weight: 600; color: #e2e8f0; padding: 18px 28px; margin-bottom: 18px; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
          .tldr-list li .num { flex: none; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; font-size: 26px; font-weight: 800; color: #0c1220; background: linear-gradient(135deg, #60a5fa, #38bdf8); }
          .tldr-quote-card { margin-top: 24px; padding: 32px 40px; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(12px); border-right: 6px solid #38bdf8; border-radius: 0 20px 20px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); border-left: 1px solid rgba(255,255,255,0.08); box-shadow: 0 12px 36px rgba(0,0,0,0.35); max-width: 1400px; }
          .tldr-quote-card .tldr-body { margin-top: 0; color: #e2e8f0; }
          .tldr-meta { display: inline-flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 500; color: #94a3b8; margin-top: 40px; }
          .tldr-meta-tag { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 4px 14px; border-radius: 8px; color: #cbd5e1; }
          .tldr-cta-box { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; max-width: 1400px; background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%); border: 1px solid rgba(96, 165, 250, 0.3); padding: 28px 36px; border-radius: 20px; }
          .tldr-cta-badge { font-size: 28px; font-weight: 700; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4); }
          .tldr-static { padding: 28px 32px; }
          @media (prefers-reduced-motion: reduce) {
            .tldr-frame { display: none; }
            .tldr-static { position: static !important; width: auto !important; height: auto !important; clip: auto !important; overflow: visible !important; white-space: normal !important; }
          }
        `}</style>

        <div className="tldr-frame" style={{ display: animated ? undefined : "none" }}>
          <div className="tldr-stage">
            <div className="tldr-scrim" />
            <div className="tldr-glow" id="glowA" style={{ width: "700px", height: "700px", top: "-150px", right: "-100px", background: "#2563eb", opacity: 0.22 }} />
            <div className="tldr-glow" id="glowB" style={{ width: "500px", height: "500px", bottom: "-100px", left: "-100px", background: "#06b6d4", opacity: 0.15 }} />

            <div className="tldr-scene" id="s1">
              <span className="tldr-eyebrow" id="s1-eye"><span className="tldr-dash" />حرف‌کلاب · خلاصهٔ فوری</span>
              <h1 className="tldr-h1" id="s1-title"><span className="accent">{title}</span></h1>
              <p className="tldr-body" id="s1-body">{description}</p>
              <div className="tldr-meta" id="s1-meta">
                <span className="tldr-meta-tag">{category}</span>
                <span className="tldr-meta-tag">{readingTime} دقیقه مطالعه</span>
              </div>
            </div>

            {line && (
              <div className="tldr-scene" id="s2" style={{ display: "none" }}>
                <span className="tldr-eyebrow" id="s2-eye"><span className="tldr-dash" />در یک خط</span>
                <h1 className="tldr-h1" id="s2-title">{line}</h1>
              </div>
            )}

            {points.length > 0 && (
              <div className="tldr-scene" id="s3" style={{ display: "none" }}>
                <span className="tldr-eyebrow" id="s3-eye"><span className="tldr-dash" />نکته‌های کلیدی</span>
                <ul className="tldr-list" id="s3-list">
                  {points.slice(0, 5).map((p, i) => (
                    <li key={i}><span className="num">{i + 1}</span>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="tldr-scene" id="s4" style={{ display: "none" }}>
              <span className="tldr-eyebrow" id="s4-eye"><span className="tldr-dash" />ته‌خط</span>
              {takeaway && <h1 className="tldr-h1" id="s4-title">{takeaway}</h1>}
              <div className="tldr-cta-box" id="s4-cta">
                <p className="tldr-body" style={{ margin: 0 }}>تمرین‌ها، مثال‌ها و تحلیل کامل در مقالهٔ کامل</p>
                <span className="tldr-cta-badge">{readingTime} دقیقه مطالعه ←</span>
              </div>
            </div>
          </div>
        </div>

        <div className={animated ? "tldr-static sr-only" : "tldr-static"}>
          <h2 className="mb-4 text-xl font-bold">خلاصهٔ فوری</h2>
          {line && <p className="mb-4 text-base leading-8 text-muted">{line}</p>}
          {points.length > 0 && (
            <ul className="mb-4 list-disc space-y-2 pr-6 leading-8">
              {points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
          {takeaway && (
            <p className="rounded-lg border border-border bg-surface p-4 font-medium leading-8">
              <span className="text-accent">ته‌خط: </span>
              {takeaway}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
