"use client";

import { useEffect, useRef } from "react";

interface TldrSlideProps {
  title: string;
  description: string;
  keyIdea: string | null;
  readingTime: number;
  category: string;
}

function toCuriosityHook(keyIdea: string | null): string {
  if (!keyIdea) return "چیزی که فکر می‌کنی می‌دانی، شاید اشتباه باشد.";
  const clean = keyIdea.replace(/\s+/g, " ").trim();
  const definer = /^(.+?)\s+(یعنی|یعنی\s+همان\s+این\s+که)\s+(.+)$/;
  const m = clean.match(definer);
  if (m) return m[3];
  const contrast = /^(.+؟?)\s*(،|\.)\s*اما\s+(.+)$/;
  const c = clean.match(contrast);
  if (c) return c[3];
  const but = /^(.+؟?)\s*(—|-|،)\s*(اما|ولی)\s+(.+)$/;
  const b = clean.match(but);
  if (b) return b[4];
  return clean;
}

function splitHook(hook: string): [string, string?] {
  const breakers = ["؛", ";", ". ", "،", "—", "–"];
  for (const b of breakers) {
    const idx = hook.indexOf(b);
    if (idx > 20) {
      const at = idx + b.length;
      return [hook.slice(0, idx).trim(), hook.slice(at).trim()];
    }
  }
  return [hook];
}

export function TldrSlide({ title, description, keyIdea, readingTime, category }: TldrSlideProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let tl: gsap.core.Timeline | null = null;
    let resizeHandler: (() => void) | null = null;

    import("gsap").then(({ default: gsap }) => {
      if (!elRef.current) return; // unmounted before gsap loaded

      const stage = el.querySelector(".tldr-stage") as HTMLElement;

      function fit() {
        const w = el.clientWidth;
        const h = el.clientHeight;
        stage.style.transform = "scale(" + Math.min(w / 1920, h / 1080) + ")";
      }
      stage.style.opacity = "0";
      fit();
      resizeHandler = fit;
      window.addEventListener("resize", fit);
      stage.style.opacity = "1";

      const s = (id: string) => el.querySelector("#" + id) as HTMLElement | null;

      tl = gsap.timeline({ paused: true, repeat: -1 });

      tl.set("#s2, #s3", { opacity: 0, visibility: "hidden", display: "none" });
      tl.set("#s1", { opacity: 1, visibility: "visible", display: "flex" });

      tl.fromTo(s("glowA")!, { opacity: 0.22 }, { opacity: 0.35, duration: 3, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0);
      tl.fromTo(s("glowB")!, { opacity: 0.15 }, { opacity: 0.25, duration: 3.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.5);

      tl.fromTo(s("s1-eye")!, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.2);
      tl.fromTo(s("s1-title")!, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.65, ease: "power3.out" }, 0.55);
      tl.fromTo(s("s1-body")!, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 1.15);
      tl.fromTo(s("s1-meta")!, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 1.7);

      tl.to(s("s1")!, { opacity: 0, duration: 0.35, ease: "power2.in" }, 4.2);
      tl.set(s("s2")!, { display: "flex", opacity: 0, visibility: "visible" }, 4.55);
      tl.to(s("s2")!, { opacity: 1, duration: 0.25, ease: "power2.out" }, 4.6);

      tl.fromTo(s("s2-eye")!, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 4.8);
      tl.fromTo(s("s2-title")!, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 5.2);
      if (s("s2-card")) {
        tl.fromTo(s("s2-card")!, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }, 5.8);
      } else if (s("s2-body")) {
        tl.fromTo(s("s2-body")!, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 5.8);
      }

      tl.to(s("s2")!, { opacity: 0, duration: 0.3, ease: "power2.in" }, 8.6);
      tl.set(s("s3")!, { display: "flex", opacity: 0, visibility: "visible" }, 8.9);
      tl.to(s("s3")!, { opacity: 1, duration: 0.2, ease: "power2.out" }, 8.95);

      tl.fromTo(s("s3-eye")!, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 9.15);
      tl.fromTo(s("s3-title")!, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 9.55);
      tl.fromTo(s("s3-body")!, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 10.15);

      tl.to({ dummy: 0 }, { dummy: 1, duration: 5, ease: "none" }, 10.65);

      tlRef.current = tl;
      tl.play();
    });

    return () => {
      if (tl) tl.kill();
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      tlRef.current = null;
    };
  }, [keyIdea]);

  const curiosityHook = toCuriosityHook(keyIdea);
  const [hookHead, hookBody] = splitHook(curiosityHook);

  return (
    <section
      aria-label="خلاصه مقاله"
      className="mb-10 overflow-hidden rounded-2xl border border-border bg-background"
    >
      <div className="relative aspect-[16/9] w-full" ref={elRef}>
        <style>{`
          .tldr-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
          .tldr-stage {
            position: relative; width: 1920px; height: 1080px; flex: none; overflow: hidden;
            background: radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.18) 0%, transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(13, 148, 136, 0.12) 0%, transparent 45%),
                        linear-gradient(145deg, #070d1e 0%, #030712 100%);
            font-family: Vazirmatn, system-ui, sans-serif; color: #f4f4f5;
            border-radius: 24px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }
          .tldr-scrim {
            position: absolute; inset: 0; pointer-events: none; z-index: 0;
            background-image:
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 48px 48px;
          }
          .tldr-glow { position: absolute; border-radius: 50%; z-index: 1; filter: blur(100px); pointer-events: none; }
          .tldr-scene { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 100px; z-index: 2; }
          .tldr-eyebrow {
            display: inline-flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700;
            color: #60a5fa; margin-bottom: 28px; width: fit-content;
            background: rgba(37, 99, 235, 0.12); border: 1px solid rgba(96, 165, 250, 0.25);
            padding: 6px 16px; border-radius: 9999px;
          }
          .tldr-dash { width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 12px #38bdf8; }
          .tldr-h1 {
            font-size: 84px; font-weight: 900; line-height: 1.25; color: #ffffff; max-width: 1400px;
            text-shadow: 0 4px 24px rgba(0,0,0,0.4);
          }
          .tldr-h1 .accent {
            background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .tldr-body { font-size: 38px; font-weight: 400; line-height: 1.6; color: #cbd5e1; max-width: 1300px; margin-top: 24px; }
          .tldr-quote-card {
            margin-top: 24px; padding: 32px 40px; background: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(12px); border-right: 6px solid #38bdf8; border-radius: 0 20px 20px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
            max-width: 1400px;
          }
          .tldr-quote-card .tldr-body { margin-top: 0; color: #e2e8f0; }
          .tldr-meta { display: inline-flex; align-items: center; gap: 16px; font-size: 24px; font-weight: 500; color: #94a3b8; margin-top: 40px; }
          .tldr-meta-tag { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); padding: 4px 14px; border-radius: 8px; color: #cbd5e1; }
          .tldr-cta-box {
            display: flex; align-items: center; justify-content: space-between; margin-top: 40px; max-width: 1400px;
            background: linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
            border: 1px solid rgba(96, 165, 250, 0.3); padding: 28px 36px; border-radius: 20px;
          }
          .tldr-cta-badge {
            font-size: 28px; font-weight: 700; background: #2563eb; color: #ffffff;
            padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
          }
        `}</style>

        <div className="tldr-frame">
          <div className="tldr-stage">
            <div className="tldr-scrim" />
            <div className="tldr-glow" id="glowA" style={{ width: "700px", height: "700px", top: "-150px", right: "-100px", background: "#2563eb", opacity: 0.22 }} />
            <div className="tldr-glow" id="glowB" style={{ width: "500px", height: "500px", bottom: "-100px", left: "-100px", background: "#06b6d4", opacity: 0.15 }} />

            <div className="tldr-scene" id="s1">
              <span className="tldr-eyebrow" id="s1-eye"><span className="tldr-dash" />باورت را به چالش بکش</span>
              <h1 className="tldr-h1" id="s1-title"><span className="accent">{title}</span></h1>
              <p className="tldr-body" id="s1-body">{description}</p>
              <div className="tldr-meta" id="s1-meta">
                <span className="tldr-meta-tag">{category}</span>
                <span className="tldr-meta-tag">{readingTime} دقیقه مطالعه</span>
              </div>
            </div>

            <div className="tldr-scene" id="s2" style={{ display: "none" }}>
              <span className="tldr-eyebrow" id="s2-eye"><span className="tldr-dash" />آیا می‌دانی که …</span>
              <h1 className="tldr-h1" id="s2-title">{hookHead}</h1>
              {hookBody && (
                <div className="tldr-quote-card" id="s2-card">
                  <p className="tldr-body" id="s2-body">{hookBody}</p>
                </div>
              )}
            </div>

            <div className="tldr-scene" id="s3" style={{ display: "none" }}>
              <span className="tldr-eyebrow" id="s3-eye"><span className="tldr-dash" />جواب را در مقاله پیدا کن</span>
              <h1 className="tldr-h1" id="s3-title">{title}</h1>
              <div className="tldr-cta-box" id="s3-body">
                <p className="tldr-body" style={{ margin: 0 }}>تمرین‌ها، مثال‌ها و تحلیل کامل در</p>
                <span className="tldr-cta-badge">{readingTime} دقیقه مطالعه ←</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}