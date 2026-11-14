"use client";

import { useEffect, useState } from "react";
import { langProps, useI18n } from "@/lib/i18n";
import { SectionHead, sectionCls, useInView, useReducedMotion } from "./shared";

export default function Companion() {
  const [ref, inView] = useInView<HTMLDivElement>("0px 0px -20% 0px");
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const { m: t, dir: pageDir, locale } = useI18n();
  const SCRIPT = t.companion.script;

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  useEffect(() => {
    if (!started) return;
    if (reduced) {
      setCount(SCRIPT.length);
      return;
    }
    if (count >= SCRIPT.length) return;
    if (!inView) return;
    const next = SCRIPT[count];
    if (next.from === "ai") {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setCount((c) => c + 1);
      }, 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 300 : 1100);
    return () => clearTimeout(t);
  }, [started, count, inView, reduced]);

  return (
    <section id="companion" className={sectionCls}>
      <div className="grid items-center gap-[clamp(48px,6vw,110px)] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionHead copy={t.companion} />

        <div
          ref={ref}
          data-reveal
          style={{ ["--s" as string]: 2 }}
          className="w-full max-w-[520px] justify-self-end rounded-md border border-ink/15 bg-[#0a0a0a] max-[900px]:justify-self-stretch"
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
            <span className="font-serif text-[15px]">{t.companion.name}</span>
            <span className="mono text-phosphor/55">{t.grid.kicker}</span>
          </div>
          <div className="flex min-h-[440px] flex-col gap-5 p-5" aria-live="polite">
            {SCRIPT.slice(0, count).map((m, i) => {
              // Messages in another language than the page carry their own lang/dir.
              const other = m.lang && m.lang !== locale ? langProps(m.lang) : {};
              const dir = "dir" in other ? other.dir : pageDir;
              return m.from === "user" ? (
                <p
                  key={i}
                  {...other}
                  className="max-w-[85%] self-end rounded-[14px] rounded-ee-[3px] bg-[#1a1a1a] px-4 py-2.5 text-[14px] leading-[1.5] text-ink [animation:riseIn_.5s_ease_both]"
                >
                  {m.text}
                </p>
              ) : (
                <div key={i} className="max-w-[92%] [animation:riseIn_.6s_ease_both]" {...other}>
                  <p className={m.lang === "ar" || (!m.lang && locale === "ar") ? "text-[15px] leading-[1.8] font-light" : "font-serif text-[17px] leading-[1.45]"}>
                    {m.text}
                  </p>
                  <p className="mono mt-2 text-start text-ink/45">
                    {t.companion.source} {m.source}
                  </p>
                  {m.link && (
                    <a href="#grid" onClick={(e) => e.preventDefault()} className="mt-2 inline-block text-[13px] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {m.link} {dir === "rtl" ? "←" : "→"}
                    </a>
                  )}
                </div>
              );
            })}
            {typing && (
              <div className="flex gap-1.5 py-1" aria-label={t.companion.typing}>
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-1 rounded-full bg-ink"
                    style={{ animation: `typingDot 1.2s ease ${d * 0.16}s infinite` }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-ink/10 px-5 py-3.5 text-[13px] text-ink/40">{t.companion.footer}</div>
        </div>
      </div>
    </section>
  );
}
