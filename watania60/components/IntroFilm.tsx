"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useArchive } from "./ArchiveContext";

const FPS = 25;

function timecode(t: number) {
  const f = Math.floor((t % 1) * FPS);
  const s = Math.floor(t) % 60;
  const m = Math.floor(t / 60) % 60;
  const h = Math.floor(t / 3600);
  return [h, m, s, f].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function IntroFilm() {
  const { splashDone, reportLoaded, setUnlocked, setRevealed, relayoutRef } = useArchive();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { m } = useI18n();
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [novideo, setNovideo] = useState(false);
  const [tc, setTc] = useState("00:00:00:00");
  const revealedRef = useRef(false);
  const reportedRef = useRef(false);
  const erroredRef = useRef(false);
  const splashRef = useRef(splashDone);
  splashRef.current = splashDone;

  const report = useCallback(() => {
    if (reportedRef.current) return;
    reportedRef.current = true;
    reportLoaded();
  }, [reportLoaded]);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setClosing(true);
    setUnlocked(true);
    const layout = () => relayoutRef.current?.();
    layout();
    requestAnimationFrame(layout);
    setTimeout(() => {
      layout();
      setRevealed(true);
      setGone(true);
      setTimeout(() => setRemoved(true), 700);
    }, 1000);
  }, [relayoutRef, setRevealed, setUnlocked]);

  // Report film readiness to the splash.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("playsinline", "");
    const onReady = () => report();
    const onError = () => {
      erroredRef.current = true;
      setNovideo(true);
      report();
    };
    if (v.readyState >= 3) report();
    // The source may have failed before hydration attached the listeners.
    if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) onError();
    v.addEventListener("canplaythrough", onReady);
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("error", onError);
    const source = v.querySelector("source");
    source?.addEventListener("error", onError);
    return () => {
      v.removeEventListener("canplaythrough", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("error", onError);
      source?.removeEventListener("error", onError);
    };
  }, [report]);

  // Once the splash is gone, play the film and schedule the reveal.
  useEffect(() => {
    if (!splashDone) return;
    const v = videoRef.current;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    if (v && (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) {
      erroredRef.current = true;
      setNovideo(true);
    }
    if (!v || erroredRef.current) {
      later(reveal, 1300);
      return () => timers.forEach(clearTimeout);
    }

    later(reveal, 14000);
    if (v.currentTime > 0.05) v.currentTime = 0;
    v.playbackRate = 2;

    let scheduled = false;
    const onPlay = () => {
      v.playbackRate = 2;
    };
    const onPlaying = () => {
      if (scheduled || !isFinite(v.duration)) return;
      scheduled = true;
      const ms = Math.max(300, ((v.duration - v.currentTime - 0.45) / 2) * 1000);
      later(reveal, ms);
    };
    const onTime = () => setTc(timecode(v.currentTime));
    const onErr = () => {
      setNovideo(true);
      later(reveal, 1300);
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("ended", reveal);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("error", onErr);

    const kick = () => {
      v.play().catch(() => {});
    };
    const unlock = () => {
      kick();
      later(() => {
        if (v.paused) reveal();
      }, 2600);
    };
    v.play().catch(() => {
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    });

    return () => {
      timers.forEach(clearTimeout);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("ended", reveal);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("error", onErr);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [splashDone, reveal]);

  if (removed) return null;

  return (
    <div id="intro" className={[closing && "closing", gone && "gone", novideo && "novideo"].filter(Boolean).join(" ")}>
      <video ref={videoRef} muted playsInline autoPlay={false} preload="auto" disablePictureInPicture>
        {/* Drop a 6–10s archive montage at public/intro.mp4 */}
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="fallback" aria-hidden="true">
        <div className="grid justify-items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" width={509} height={405} className="w-[clamp(90px,12vw,150px)] opacity-90" />
          <span className="mono">{m.intro.signal}</span>
        </div>
      </div>
      <div className="veil" />
      <div className="timecode mono" aria-hidden="true">
        {tc}
      </div>
      <button id="skip" className="skip" type="button" onClick={reveal}>
        {m.intro.skip}
      </button>
    </div>
  );
}
