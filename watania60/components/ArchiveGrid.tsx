"use client";

import { archive } from "@/lib/archive";
import { langProps, rich, useI18n } from "@/lib/i18n";
import { useArchive } from "./ArchiveContext";

export default function ArchiveGrid() {
  const { srcs, isGrid, setGrid, openShot } = useArchive();
  const { m, altLang } = useI18n();

  return (
    <>
      <div id="grid" aria-hidden={!isGrid}>
        <div className="mx-auto mb-[clamp(20px,3vw,40px)] flex max-w-[1680px] items-end justify-between gap-6">
          <div>
            <button
              type="button"
              className="gridback"
              tabIndex={isGrid ? 0 : -1}
              onClick={() => setGrid(false)}
            >
              <span aria-hidden="true">←</span>
              {m.grid.back}
            </button>
            <p className="mono mb-2 text-phosphor/60">{m.grid.kicker}</p>
            <h2 className="font-serif text-[clamp(28px,3.4vw,48px)] font-light leading-none tracking-[-0.02em]">
              {rich(m.grid.title)}
            </h2>
          </div>
          <span {...langProps(altLang)} className="hidden text-[15px] text-ink/55 sm:block">
            {m.grid.alt}
          </span>
        </div>
        <div className="rows">
          {archive.map((f, i) => (
            <figure
              key={f.id}
              data-idx={i}
              className={f.bw ? "bw" : ""}
              tabIndex={isGrid ? 0 : -1}
              role="button"
              aria-label={`${m.archive[f.id].program}, ${f.year}`}
              onClick={(e) => openShot(i, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openShot(i, e.currentTarget);
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {srcs[i] && <img src={srcs[i]} alt="" loading="lazy" />}
              <figcaption>
                <span className="mono">{f.year}</span>
                {m.archive[f.id].program}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <button
        id="gridBtn"
        type="button"
        className="gridbtn"
        aria-label={m.grid.toggle}
        aria-pressed={isGrid}
        onClick={() => setGrid((g) => !g)}
      >
        <b />
        <b />
        <b />
        <b />
      </button>

      {/* Same frames for assistive tech; the sphere itself is aria-hidden. */}
      <ul className="sr-only">
        {archive.map((f) => (
          <li key={f.id}>
            {f.year} — {m.archive[f.id].program}: {m.archive[f.id].note}
          </li>
        ))}
      </ul>
    </>
  );
}
