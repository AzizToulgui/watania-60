"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { archive, frame } from "@/lib/archive";
import { useI18n } from "@/lib/i18n";
import { useArchive } from "./ArchiveContext";

function flipFrom(plate: HTMLElement, from: Element | null) {
  if (!from || !from.isConnected) return null;
  const pr = plate.getBoundingClientRect();
  const fr = from.getBoundingClientRect();
  if (!pr.width || !fr.width) return null;
  const dx = fr.left + fr.width / 2 - (pr.left + pr.width / 2);
  const dy = fr.top + fr.height / 2 - (pr.top + pr.height / 2);
  const sc = Math.max(0.04, fr.width / pr.width);
  return `translate(${dx}px, ${dy}px) scale(${sc})`;
}

export default function Lightbox() {
  const { focused, openToken, closeShot, sourceRef, srcs } = useArchive();
  const plateRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(-1);
  const [img, setImg] = useState<string | undefined>();
  const [restored, setRestored] = useState(true);
  const tokenRef = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const open = focused >= 0;

  // Content follows the focused shot but stays put while closing.
  useLayoutEffect(() => {
    if (focused < 0) return;
    setShown(focused);
    setRestored(false);
  }, [focused, openToken]);

  // Show the decoded thumb immediately, then swap in the full still once it has loaded.
  useEffect(() => {
    if (focused < 0) return;
    const f = archive[focused];
    const token = ++tokenRef.current;
    setImg(srcs[focused] ?? f.thumb);
    const full = new Image();
    full.onload = () => {
      if (tokenRef.current === token) setImg(f.full);
    };
    full.src = f.full;
    // srcs intentionally omitted: only re-run on a new open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, openToken]);

  // FLIP open.
  useLayoutEffect(() => {
    const plate = plateRef.current;
    if (!plate || focused < 0) return;
    clearTimeout(closeTimer.current);
    const t = flipFrom(plate, sourceRef.current);
    plate.style.transition = "none";
    plate.style.transform = t ?? "scale(.92)";
    plate.style.opacity = "0";
    void plate.offsetWidth;
    plate.style.transition = "";
    plate.style.transform = "";
    plate.style.opacity = "";
  }, [focused, openToken, sourceRef]);

  // FLIP close.
  const prevOpen = useRef(false);
  useEffect(() => {
    const plate = plateRef.current;
    if (prevOpen.current && !open && plate) {
      plate.style.transform = flipFrom(plate, sourceRef.current) ?? "scale(.92)";
      plate.style.opacity = "0";
      closeTimer.current = setTimeout(() => {
        plate.style.transition = "none";
        plate.style.transform = "";
        void plate.offsetWidth;
        plate.style.transition = "";
      }, 640);
    }
    prevOpen.current = open;
  }, [open, sourceRef]);

  const { m } = useI18n();
  const f = shown >= 0 ? archive[shown] : null;
  const text = f ? m.archive[f.id] : null;
  const restoredSrc = f?.restored ? frame(f.restored).full : undefined;
  const src = restored && restoredSrc ? restoredSrc : img;

  return (
    <div id="lit" className={open ? "on" : ""} aria-hidden={!open} role="dialog" aria-modal="true" aria-labelledby="litTitle">
      <div className="scrim" data-close onClick={closeShot} />
      <div className="plate" ref={plateRef}>
        <div className={`shot${f?.bw && !(restored && restoredSrc) ? " bw" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {src && <img src={src} alt={f && text ? `${text.program}, ${f.year}${restored && restoredSrc ? m.lightbox.restoredSuffix : ""}` : ""} />}
          {restoredSrc && (
            <div className="toggle" role="group" aria-label={m.lightbox.version}>
              <button type="button" aria-pressed={!restored} onClick={() => setRestored(false)}>
                {m.lightbox.original}
              </button>
              <button type="button" aria-pressed={restored} onClick={() => setRestored(true)}>
                {m.lightbox.restored}
              </button>
            </div>
          )}
          <button type="button" className="close" data-close onClick={closeShot} tabIndex={open ? 0 : -1}>
            {m.lightbox.close}
          </button>
        </div>
        <div className="meta">
          <div>
            <h2 id="litTitle">{text?.program}</h2>
            <div className="where mono !text-[10px]">
              {f?.year} · {text?.genre}
            </div>
          </div>
          <div>
            <p className="note">{text?.note}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="#restoration"
                onClick={closeShot}
                className="inline-flex min-h-9 items-center rounded-full border border-ink/30 px-3.5 text-[12px] text-ink no-underline transition-colors hover:border-ink"
              >
                {m.lightbox.restore}
              </a>
              <a
                href="#companion"
                onClick={closeShot}
                className="inline-flex min-h-9 items-center rounded-full border border-ink/30 px-3.5 text-[12px] text-ink no-underline transition-colors hover:border-ink"
              >
                {m.lightbox.ask}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
