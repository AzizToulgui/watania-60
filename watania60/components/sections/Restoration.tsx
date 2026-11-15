"use client";

import { useCallback, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SectionHead, sectionCls } from "./shared";

const BEFORE = "/archive/harbor-original.jpg";
const AFTER = "/archive/harbor-restored.jpg";

export default function Restoration() {
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const { m } = useI18n();
  const t = m.restoration;

  const fromEvent = useCallback((clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section id="restoration" data-tc="00:12:48:00" className={sectionCls}>
      <div>
        <div className="grid items-end gap-x-10 gap-y-4 min-[901px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionHead copy={{ ...t, lead: undefined }} />
          <p data-reveal className="max-w-[46ch] text-[15px] leading-[1.6] text-ink/72" style={{ ["--s" as string]: 3 }}>
            {t.lead}
          </p>
        </div>
      </div>

      {/* Slider and notes side by side on desktop; the slider's height follows the screen so the section fits one view. */}
      <div className="mt-[clamp(20px,4vh,44px)] grid items-stretch gap-[clamp(20px,3vw,48px)] min-[901px]:grid-cols-[minmax(0,1fr)_280px]">
      <div
        ref={boxRef}
        data-reveal
        data-cursor="‹ ›"
        // Original on the left, restored on the right, in every language.
        dir="ltr"
        className="relative h-[clamp(220px,calc(100dvh-380px),620px)] w-full touch-pan-y overflow-hidden rounded-[3px] select-none max-[900px]:aspect-video max-[900px]:h-auto max-[640px]:aspect-[4/5]"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromEvent(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* Restored (right) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={AFTER} alt={t.altAfter} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        {/* Original (left) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BEFORE}
            alt={t.altBefore}
            className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_sepia(.12)]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,.3)_0_1px,transparent_1px_3px)] opacity-40" />
          <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,.85)]" />
        </div>

        <span className="mono absolute top-[var(--pad)] left-[var(--pad)] rounded-sm bg-black/50 px-2 py-1 text-ink/80">
          {t.original}
        </span>
        <span className="mono absolute top-[var(--pad)] right-[var(--pad)] rounded-sm max-[640px]:top-auto max-[640px]:bottom-[var(--pad)] bg-black/50 px-2 py-1 text-ink/80">
          {t.restored}
        </span>

        <div className="absolute inset-y-0 w-px bg-ink" style={{ left: `${pos}%` }}>
          <div
            role="slider"
            tabIndex={0}
            aria-label={t.slider}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 2));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
            }}
            className="absolute top-1/2 left-1/2 grid size-11 -translate-1/2 cursor-ew-resize place-items-center rounded-full border border-ink bg-black/60 text-[15px] text-ink backdrop-blur-sm"
          >
            ‹ ›
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6">
        <div className="grid gap-px max-[900px]:min-[641px]:grid-cols-3">
          {t.stats.map(({ t: title, d }, i) => (
            <div
              key={i}
              data-reveal
              style={{ ["--s" as string]: i }}
              className="border-t border-ink/15 py-[clamp(10px,2vh,18px)] max-[900px]:min-[641px]:pe-6"
            >
              <p className="font-serif text-[clamp(18px,2.6vh,22px)]">{title}</p>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-ink/65">{d}</p>
            </div>
          ))}
        </div>
        <p data-reveal className="mono text-ink/70">
          <span className="me-2 inline-block size-1.5 rounded-full bg-red align-[1px]" />
          {t.kept}
        </p>
      </div>
      </div>
    </section>
  );
}
