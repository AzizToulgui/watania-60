"use client";

import { useEffect, useState } from "react";
import { frame, type FrameId } from "@/lib/archive";
import { useI18n } from "@/lib/i18n";
import { SectionHead, sectionCls, useInView, useReducedMotion } from "./shared";

// Results for each example memory in messages (search.memories), in the same order.
const RESULTS: { f: FrameId; ep: string; t: string; m: number }[][] = [
  [
    { f: "ramadan-table", ep: "EP 12", t: "00:14:22", m: 92 },
    { f: "choufli-hal", ep: "EP 03", t: "00:31:05", m: 78 },
    { f: "khatem-el-yasmine", ep: "EP 21", t: "00:08:47", m: 61 },
  ],
  [
    { f: "carthage", ep: "LIVE", t: "00:45:32", m: 94 },
    { f: "malouf", ep: "SPECIAL", t: "00:19:33", m: 81 },
    { f: "el-douar", ep: "EP 07", t: "01:02:18", m: 57 },
  ],
  [
    { f: "world-cup", ep: "LIVE", t: "01:12:40", m: 96 },
    { f: "first-broadcast", ep: "NEWS", t: "00:05:12", m: 64 },
    { f: "oasis", ep: "DOC", t: "00:14:28", m: 52 },
  ],
];

export default function MemorySearch() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [phrase, setPhrase] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const { m } = useI18n();
  const MEMORIES = m.search.memories;

  useEffect(() => {
    if (reduced) {
      setTyped(MEMORIES[0]);
      setShowResults(true);
      return;
    }
    if (!inView || focused || value) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    (async () => {
      let i = phrase;
      while (!cancelled) {
        const text = MEMORIES[i];
        setPhrase(i);
        setShowResults(false);
        for (let c = 1; c <= text.length && !cancelled; c++) {
          setTyped(text.slice(0, c));
          await wait(45);
        }
        if (cancelled) break;
        setShowResults(true);
        await wait(4200);
        for (let c = text.length; c >= 0 && !cancelled; c--) {
          setTyped(text.slice(0, c));
          await wait(20);
        }
        i = (i + 1) % MEMORIES.length;
      }
    })();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // phrase is read once when the loop starts; restarting on every change would reset it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, focused, value, MEMORIES]);

  const rows = RESULTS[phrase];

  return (
    <section id="search" className={sectionCls}>
      <div className="grid items-center gap-[clamp(48px,6vw,110px)] min-[901px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionHead copy={m.search} />

        <div ref={ref} data-reveal style={{ ["--s" as string]: 2 }}>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: semantic scene search API
            }}
            className="relative"
          >
            <label htmlFor="memory" className="sr-only">
              {m.search.label}
            </label>
            <input
              id="memory"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
              className="h-16 w-full rounded-full border border-ink/30 bg-transparent pe-16 ps-7 font-serif text-[clamp(16px,1.6vw,20px)] italic text-ink outline-none transition-colors focus:border-ink"
            />
            {!value && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-7 end-16 flex items-center overflow-hidden font-serif text-[clamp(16px,1.6vw,20px)] whitespace-nowrap text-ink/55 italic"
              >
                {focused ? m.search.placeholder : typed}
                {!focused && <span className="ms-0.5 inline-block h-[1.1em] w-px bg-ink/70 [animation:blink_1s_steps(1)_infinite]" />}
              </span>
            )}
            <button
              type="submit"
              aria-label={m.search.submit}
              className="absolute end-2 top-2 grid size-12 place-items-center rounded-full bg-ink text-black transition-colors hover:bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
            </button>
          </form>

          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10" aria-live="polite">
            {rows.map((r, i) => {
              const f = frame(r.f);
              return (
                <li
                  key={`${phrase}-${i}`}
                  className="flex items-center gap-4 py-4 transition-all duration-700 ease-[var(--ease)]"
                  style={{
                    opacity: showResults ? 1 : 0,
                    transform: showResults ? "none" : "translateY(10px)",
                    transitionDelay: showResults ? `${i * 120}ms` : "0ms",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.thumb}
                    alt=""
                    className={`aspect-video w-24 shrink-0 rounded-[2px] object-cover ${f.bw ? "grayscale" : ""}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-[17px]">{m.archive[f.id].program}</p>
                    <p className="mono mt-1 text-ink/50">
                      {f.year} · {r.ep} · {r.t}
                    </p>
                  </div>
                  <div className="hidden w-28 shrink-0 sm:block">
                    <div className="mono mb-1.5 text-end text-ink/50">{r.m}%</div>
                    <div className="h-px bg-ink/15">
                      <div
                        className={`h-px origin-left transition-transform rtl:origin-right duration-1000 ${i === 0 ? "bg-red" : "bg-ink/70"}`}
                        style={{ transform: `scaleX(${showResults ? r.m / 100 : 0})`, transitionDelay: `${i * 120 + 200}ms` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
