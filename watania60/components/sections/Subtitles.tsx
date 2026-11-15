"use client";

import { useEffect, useState } from "react";
import { frame as getFrame } from "@/lib/archive";
import { useI18n } from "@/lib/i18n";
import { SectionHead, sectionCls, useInView, useReducedMotion } from "./shared";

// The same line in three languages: this is the demo itself, so it is not translated.
const LINES = [
  { code: "AR", text: "شوف، الدنيا ما تدوم لحد… أما الذكريات تبقى.", rtl: true },
  { code: "FR", text: "Tu vois, rien ne dure en ce monde… mais les souvenirs restent." },
  { code: "EN", text: "You see, nothing in this world lasts… but memories stay." },
];
const MODES = ["AR", "FR", "EN", "Auto"] as const;

export default function Subtitles() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<(typeof MODES)[number]>("Auto");
  const [auto, setAuto] = useState(0);
  const { m: t } = useI18n();

  useEffect(() => {
    if (mode !== "Auto" || !inView || reduced) return;
    const t = setInterval(() => setAuto((a) => (a + 1) % LINES.length), 2400);
    return () => clearInterval(t);
  }, [mode, inView, reduced]);

  const active = mode === "Auto" ? auto : LINES.findIndex((l) => l.code === mode);
  const frame = getFrame("mnamet-aroussia");

  return (
    <section id="subtitles" data-tc="00:27:36:04" className={sectionCls}>
      <SectionHead
        center
        className="mx-auto max-w-[900px] text-center [&_p]:mx-auto"
        copy={t.subtitles}
      />

      <div ref={ref} data-reveal className="mx-auto mt-[clamp(16px,3.5vh,56px)] w-full max-w-[min(960px,calc((100dvh-420px)*16/9))] min-w-[min(100%,420px)]">
        <div className="mb-4 flex justify-center">
          <div className="flex gap-1 text-[13px]" role="group" aria-label={t.subtitles.group}>
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`relative min-h-11 px-3.5 transition-opacity ${mode === m ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
              >
                {m === "Auto" ? t.subtitles.auto : m}
                <span
                  className={`absolute inset-x-3.5 bottom-2 h-px transition-transform duration-500 ${mode === m ? "scale-x-100 bg-red" : "scale-x-0 bg-ink"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[3px] bg-[#0b0b0b]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame.full} alt="" className="h-full w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_55%,rgba(0,0,0,.75))]" />
          <span className="mono absolute start-4 top-4 text-phosphor/70">{t.subtitles.live}</span>
          <span className="mono absolute end-4 top-4 text-ink/55" dir="ltr">{frame.year} · EP 04</span>
          <div className="absolute inset-x-0 bottom-[8%] grid place-items-center px-6">
            {LINES.map((l, i) => (
              <p
                key={l.code}
                lang={l.rtl ? "ar" : undefined}
                dir={l.rtl ? "rtl" : "ltr"}
                className={`col-start-1 row-start-1 max-w-[80%] text-center text-[clamp(15px,2vw,24px)] leading-[1.4] text-white transition-opacity duration-400 [text-shadow:0_1px_12px_rgba(0,0,0,.9)]`}
                style={{ opacity: i === active ? 1 : 0 }}
                aria-hidden={i !== active}
              >
                {l.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
