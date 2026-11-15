"use client";

import { useEffect, useRef, useState } from "react";
import { useArchive } from "./ArchiveContext";

const BARS = ["#d6d6d6", "#b8b8b8", "#9a9a9a", "#7c7c7c", "#5e5e5e", "#444", "#2a2a2a"];

export default function Splash() {
  const { loaded, total, setSplashDone } = useArchive();
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const born = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    born.current = performance.now();
  }, []);

  useEffect(() => {
    if (done.current) return;
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setOut(true);
      setSplashDone(true);
      setTimeout(() => setGone(true), 950);
    };
    if (loaded >= total) {
      const wait = Math.max(0, 1150 - (performance.now() - born.current));
      const t = setTimeout(finish, wait + 350);
      return () => clearTimeout(t);
    }
    const backstop = setTimeout(finish, Math.max(0, 9000 - (performance.now() - born.current)));
    return () => clearTimeout(backstop);
  }, [loaded, total, setSplashDone]);

  if (gone) return null;
  const progress = out ? 1 : Math.min(1, loaded / total);

  return (
    <div id="splash" className={out ? "out" : ""} aria-hidden="true">
      <div className="testcard">
        {BARS.map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src="/logo.svg" alt="" width={378} height={324} />
      <div className="mark">Watania 60</div>
      <div className="mark-ar" lang="ar" dir="rtl">
        الوطنية ٦٠
      </div>
      <div className="bar">
        <s style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="tag mono">CH 01 · 1966 — 2026</div>
    </div>
  );
}
