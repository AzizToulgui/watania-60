"use client";

import { useEffect, useRef, useState } from "react";
import { archive } from "@/lib/archive";
import { useI18n } from "@/lib/i18n";
import { SectionHead, screenCls } from "./shared";

// Milestone texts are in messages (timeline.stops), in this order.
const YEARS = [1966, 1976, 1986, 1996, 2006, 2016, 2026];

function frameFor(year: number) {
  let best = archive[0];
  for (const f of archive) if (Math.abs(f.year - year) < Math.abs(best.year - year)) best = f;
  return best;
}

export default function Timeline() {
  const scroller = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);
  const { m, dir } = useI18n();
  const STOPS = YEARS.map((year, i) => ({ year, text: m.timeline.stops[i] }));

  useEffect(() => {
    const el = scroller.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-stop]"));

    const update = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setCenter(best);
    };

    // Vertical wheel scrolls the strip horizontally, until it reaches either end.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    // Mouse drag to scroll.
    let down = false;
    let sx = 0;
    let sl = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      sx = e.clientX;
      sl = el.scrollLeft;
      el.style.scrollSnapType = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (down) el.scrollLeft = sl - (e.clientX - sx);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = "";
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      id="timeline"
      data-tc="00:48:21:16"
      className={screenCls}
      // Stop width follows the screen height so year, image and text fit one view.
      style={{ ["--stop" as string]: "min(72vw, 520px, calc((85dvh - 430px) * 16 / 9 + 56px))" }}
    >
      <div className="mx-auto max-w-[1440px] px-[var(--pad)]">
        <SectionHead copy={m.timeline} />
      </div>

      <div
        ref={scroller}
        data-cursor="drag"
        // Time runs left to right in every language; the scroll math assumes it.
        dir="ltr"
        className="no-scrollbar relative mt-[clamp(16px,3vh,56px)] flex snap-x snap-mandatory overflow-x-auto px-[calc(50vw-var(--stop)/2)] select-none"
      >
        {STOPS.map((s, i) => {
          const f = frameFor(s.year);
          const g = 1 - i / (STOPS.length - 1);
          return (
            <div
              key={s.year}
              data-stop
              className={`relative w-[var(--stop)] min-w-[260px] shrink-0 snap-center px-[clamp(12px,2vw,28px)] ${i === center ? "is-center" : ""}`}
            >
              <p className="outline-year font-serif text-[clamp(56px,min(11vw,15vh),160px)] leading-[.82] font-light tracking-[-0.03em]">{s.year}</p>
              <div className="relative -mx-[clamp(12px,2vw,28px)] h-px bg-ink/20">
                <span
                  className={`absolute top-1/2 left-[clamp(12px,2vw,28px)] size-[9px] -translate-y-1/2 rounded-full transition-all duration-500 ${i === center ? "bg-red opacity-100" : "bg-ink/40 opacity-60"}`}
                />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.thumb}
                alt=""
                draggable={false}
                className="mt-[clamp(10px,2vh,24px)] aspect-video w-full rounded-[3px] object-cover transition-opacity duration-500"
                style={{ filter: `grayscale(${g})`, opacity: i === center ? 1 : 0.45 }}
              />
              <p dir={dir} className="mt-4 max-w-[38ch] text-start text-[14px] leading-[1.6] text-ink/70">
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mono mx-auto mt-[clamp(10px,2vh,32px)] w-full max-w-[1440px] px-[var(--pad)] text-ink/40" dir="ltr">
        {STOPS[center].year} · {center + 1} / {STOPS.length}
      </p>
    </section>
  );
}
