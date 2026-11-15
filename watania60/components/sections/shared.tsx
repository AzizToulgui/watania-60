"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { langProps, rich, useI18n } from "@/lib/i18n";

/** True while the element is on screen and the tab is visible. Pauses loops off-screen. */
export function useInView<T extends Element>(rootMargin = "0px"): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let onScreen = false;
    const update = () => setInView(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        update();
      },
      { rootMargin },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [rootMargin]);
  return [ref, inView];
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** One observer for every [data-reveal] element on the page, including ones added later. */
export function Reveals() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("shown");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const scan = (root: ParentNode) =>
      root.querySelectorAll("[data-reveal]:not(.shown)").forEach((el) => io.observe(el));
    scan(document);
    // Content re-rendered after a language switch must be revealed too.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-reveal]:not(.shown)")) io.observe(n);
          scan(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}

type HeadCopy = { chapter: string; title: string; alt: string; lead?: string };

export function SectionHead({ copy, className = "", center = false }: { copy: HeadCopy; className?: string; center?: boolean }) {
  const { altLang, dir } = useI18n();
  return (
    <div className={className}>
      <p data-reveal className="mono mb-[clamp(12px,2.4vh,24px)] text-phosphor/60" style={{ ["--s" as string]: 0 }}>
        {copy.chapter}
      </p>
      <h2
        data-reveal
        className="font-serif text-[clamp(30px,min(5.2vw,8.5vh),76px)] leading-[1.02] font-light tracking-[-0.02em] text-balance"
        style={{ ["--s" as string]: 1 }}
      >
        {rich(copy.title)}
      </h2>
      <p
        data-reveal
        {...langProps(altLang)}
        className="mt-[clamp(8px,1.6vh,16px)] text-[clamp(17px,min(2vw,3.4vh),26px)] font-light text-ink/60"
        // Align with the page, not with the secondary line's own direction.
        style={{ ["--s" as string]: 2, textAlign: center ? "center" : dir === "rtl" ? "right" : "left" }}
      >
        {copy.alt}
      </p>
      {copy.lead && (
        <p data-reveal className="mt-[clamp(14px,3vh,28px)] max-w-[52ch] text-[15px] leading-[1.6] text-ink/72" style={{ ["--s" as string]: 3 }}>
          {copy.lead}
        </p>
      )}
    </div>
  );
}

/** One screen per section: full viewport height, snapped, content centered between the header and the timecode. */
export const screenCls =
  "relative z-30 flex min-h-dvh snap-start snap-always flex-col justify-center pt-[calc(84px+var(--safe-top))] pb-[calc(64px+var(--safe-bottom))]";

export const sectionCls = `${screenCls} mx-auto max-w-[1440px] px-[var(--pad)]`;
