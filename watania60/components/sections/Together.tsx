"use client";

import { useEffect, useRef, useState } from "react";
import { frame, images, type FrameId } from "@/lib/archive";
import { useI18n } from "@/lib/i18n";
import { SectionHead, sectionCls, useInView, useReducedMotion } from "./shared";

// Portraits of beloved Watania characters; their names are in messages (together.viewers),
// same order. Built by scripts/prepare-images.mjs.
const VIEWERS = ["sbou3i", "slimane", "haj-klouf", "bacha", "ommi-traki"].map((id) => `/archive/viewers/${id}.jpg`);
const REACTIONS = ["!", "♪", "ههه", "bravo", "يا سلام", "♪"];

// Placeholder playlist; "added by" lines are in messages (together.addedBy), same order.
const PLAYLIST: { f: FrameId; rt: string }[] = [
  { f: "mnamet-aroussia", rt: "52:10" },
  { f: "choufli-hal", rt: "38:44" },
  { f: "carthage", rt: "1:04:02" },
  { f: "world-cup", rt: "24:31" },
];

type Float = { id: number; who: number; text: string };

export default function Together() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [floats, setFloats] = useState<Float[]>([]);
  const { m } = useI18n();
  const t = m.together;
  const nextId = useRef(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => {
      const id = nextId.current++;
      const f = { id, who: Math.floor(Math.random() * VIEWERS.length), text: REACTIONS[id % REACTIONS.length] };
      setFloats((list) => [...list.slice(-6), f]);
      setTimeout(() => setFloats((list) => list.filter((x) => x.id !== id)), 2600);
    }, 1600);
    return () => clearInterval(t);
  }, [inView, reduced]);


  return (
    <section id="together" data-tc="00:41:55:08" className={sectionCls}>
      {/* Heading and playlist on the left, the watch party on the right: one screen on desktop. */}
      <div ref={ref} className="grid items-center gap-[clamp(32px,4vw,72px)] min-[1024px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <SectionHead copy={t} />
          <div data-reveal className="mt-[clamp(16px,3.5vh,40px)]" style={{ ["--s" as string]: 4 }}>
            <div className="mb-3 flex items-baseline justify-between gap-4 max-[480px]:flex-col max-[480px]:gap-1">
              <p className="font-serif text-[20px]">{t.playlist}</p>
              <p className="mono text-ink/50">{t.playlistMeta}</p>
            </div>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {PLAYLIST.map((p, i) => {
                const f = frame(p.f);
                return (
                  <li key={p.f} className="flex items-center gap-4 py-[clamp(8px,1.5vh,14px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.thumb} alt="" className={`aspect-video w-[clamp(56px,9vh,80px)] shrink-0 rounded-[2px] object-cover ${f.bw ? "grayscale" : ""}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-normal">{m.archive[f.id].program}</p>
                      <p className="mt-0.5 truncate text-[12px] text-ink/50">{t.addedBy[i]}</p>
                    </div>
                    <span className="mono shrink-0 text-ink/50" dir="ltr">{p.rt}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div data-reveal className="relative">
          <div className="relative aspect-video overflow-hidden rounded-[3px] bg-[#0b0b0b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.family} alt="" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,.7))]" />
            <span className="mono absolute start-4 top-4 flex items-center gap-2 text-ink/80">
              <span className="size-1.5 rounded-full bg-red" />
              {t.party}
            </span>
            <span className="mono absolute end-4 top-4 text-ink/55" dir="ltr">00:21:47</span>
            <div className="absolute inset-x-4 bottom-4 h-px bg-ink/25">
              <div className="h-px w-[42%] bg-ink rtl:ms-auto" />
            </div>
          </div>

          <div className="relative -mt-7 flex justify-center max-[640px]:-mt-5 gap-[clamp(10px,2vw,22px)]">
            {VIEWERS.map((src, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {floats
                  .filter((f) => f.who === i)
                  .map((f) => (
                    <span
                      key={f.id}
                      lang={/[؀-ۿ]/.test(f.text) ? "ar" : undefined}
                      className="pointer-events-none absolute -top-2 left-1/2 text-[13px] whitespace-nowrap text-ink"
                      style={{ animation: "floatUp 2.6s ease-out forwards" }}
                    >
                      {f.text}
                    </span>
                  ))}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="size-[clamp(40px,5vw,56px)] rounded-full border-2 border-black object-cover"
                />
                <span className="mt-2 w-[clamp(52px,7vw,84px)] text-center text-[11px] leading-tight text-ink/60">{t.viewers[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
