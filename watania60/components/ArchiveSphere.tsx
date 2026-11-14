"use client";

import { useEffect, useRef } from "react";
import { archive } from "@/lib/archive";
import { langProps, useI18n } from "@/lib/i18n";
import { downscale, fibonacciSphere, sphereMetrics } from "@/lib/sphere";
import { useArchive } from "./ArchiveContext";

const UNITS = fibonacciSphere(archive.length);
const DEG = Math.PI / 180;
// How far toward the camera the title sits, as a fraction of R. Just past the surface, so the nearest frames pass behind the words instead of over them.
const TITLE_Z = 1.08;

export default function ArchiveSphere() {
  const { srcs, setSrc, reportLoaded, openShot, focusedRef, relayoutRef, setGrid } = useArchive();
  const trackRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null); // sticky viewport that scrolls away after the dolly
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { m, altLang } = useI18n();
  const words = m.hero.words;

  // Decode every frame once, downscaled for the sphere and grid.
  useEffect(() => {
    const { decodeMax } = sphereMetrics(window.innerWidth, window.innerHeight);
    let alive = true;
    archive.forEach((f, i) => {
      downscale(f.thumb, decodeMax).then((url) => {
        if (!alive) return;
        setSrc(i, url);
        reportLoaded();
      });
    });
    return () => {
      alive = false;
    };
  }, [setSrc, reportLoaded]);

  useEffect(() => {
    const stage = stageRef.current!;
    const world = worldRef.current!;
    const orb = orbRef.current!;
    const headline = headlineRef.current!;
    const track = trackRef.current!;
    const cards = cardRefs.current;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const s = {
      R: 300,
      persp: 1150,
      spin: 0,
      tilt: -4,
      camZ: 0,
      dragX: 0,
      dragY: 0,
      velX: 0,
      velY: 0,
      lastW: 0,
      lastH: 0,
      lastOpacity: [] as number[],
      lastD: [] as number[],
      lastFront: [] as boolean[],
      deep: false,
      past: false,
    };
    const PITCH = 32;

    // Start at the yaw where no front-facing card sits over the title.
    {
      const ca = Math.cos(s.tilt * DEG);
      const sa = Math.sin(s.tilt * DEG);
      let best = 0;
      let bestScore = -1;
      for (let deg = 0; deg < 360; deg += 2) {
        const cb = Math.cos(deg * DEG);
        const sb = Math.sin(deg * DEG);
        let score = Infinity;
        for (const u of UNITS) {
          const py = -u.y;
          const z1 = py * sa + u.z * ca;
          const zf = -u.x * sb + z1 * cb;
          if (zf < 0.8) continue;
          const x = u.x * cb + z1 * sb;
          const y = py * ca - u.z * sa;
          // The title is wide and short: weight vertical distance more.
          score = Math.min(score, Math.hypot(x * 0.55, y));
        }
        if (score > bestScore) {
          bestScore = score;
          best = deg;
        }
      }
      s.spin = best;
    }

    const layout = (force = true) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!force && Math.abs(w - s.lastW) < 20 && Math.abs(h - s.lastH) < 20) return;
      s.lastW = w;
      s.lastH = h;
      const m = sphereMetrics(w, h);
      s.R = m.R;
      s.persp = m.persp;
      stage.style.setProperty("--persp", `${m.persp}px`);
      orb.style.setProperty("--cw", `${m.cw}px`);
      archive.forEach((f, i) => {
        const el = cards[i];
        if (!el) return;
        const u = UNITS[i];
        const cw = m.cw;
        const ch = cw / f.aspect;
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.marginLeft = `${-cw / 2}px`;
        el.style.marginTop = `${-ch / 2}px`;
        el.style.transform = `translate3d(${u.x * m.R}px, ${-u.y * m.R}px, ${u.z * m.R}px) rotateY(${u.lon}deg) rotateX(${u.lat}deg)`;
      });
    };
    relayoutRef.current = () => layout(true);
    layout(true);

    // ---------- Camera loop ----------
    let raf = 0;
    let dragging = false;
    const frame = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const lit = focusedRef.current >= 0;
      const trackEnd = track.offsetHeight - vh;
      const heroVisible = y < trackEnd + vh;

      if (!dragging && !lit) {
        s.dragX += s.velX;
        s.dragY += s.velY;
        s.velX *= 0.94;
        s.velY *= 0.94;
        if (Math.abs(s.velX) < 0.002) s.velX = 0;
        if (Math.abs(s.velY) < 0.002) s.velY = 0;
      }
      s.dragY = Math.max(-PITCH - s.tilt, Math.min(PITCH - s.tilt, s.dragY));

      const p = Math.max(0, Math.min(1, y / (vh * 0.3)));
      const target = p * Math.min(64, s.R * 0.12);
      s.camZ += (target - s.camZ) * 0.075;

      // "deep" holds until the hero has scrolled off, so its chrome does not reappear on the way out.
      const deep = p > 0.5 && heroVisible;
      if (deep !== s.deep) {
        s.deep = deep;
        document.body.classList.toggle("deep", deep);
      }
      // The sphere has started scrolling away: hide the grid button so it does not sit on the next section.
      const past = y > trackEnd + 40;
      if (past !== s.past) {
        s.past = past;
        document.body.classList.toggle("past-hero", past);
      }

      if (heroVisible) {
        const sx = s.tilt + s.dragY;
        const sy = s.spin + s.dragX;
        world.style.transform = `translateZ(${s.camZ}px) rotateY(${sy}deg) rotateX(${sx}deg)`;
        // Scale back the perspective magnification so the title keeps its CSS size.
        const tz = s.R * TITLE_Z;
        const k = (s.persp - tz) / s.persp;
        headline.style.transform = `rotateX(${-sx}deg) rotateY(${-sy}deg) translateZ(${tz}px) scale(${k})`;
        // Fade the inner block, never the h1: opacity < 1 on the h1 flattens its 3D context and
        // Chrome then clips everything above the zero-height box (the first line disappears).
        const inner = headline.firstElementChild as HTMLElement | null;
        if (inner) inner.style.opacity = String(Math.max(0, 1 - p * 0.55));

        const ca = Math.cos(sx * DEG);
        const sa = Math.sin(sx * DEG);
        const cb = Math.cos(sy * DEG);
        const sb = Math.sin(sy * DEG);
        const shade = 1 - Math.min(1, p * 1.6);
        const near = s.persp * 0.66;
        const focus = focusedRef.current;

        for (let i = 0; i < UNITS.length; i++) {
          const el = cards[i];
          if (!el) continue;
          const u = UNITS[i];
          // CSS space: (x, -y, z); rotateX first, then rotateY.
          const py = -u.y;
          const z1 = py * sa + u.z * ca;
          const zf = -u.x * sb + z1 * cb;
          const base = 0.14 + 0.86 * Math.pow((zf + 1) / 2, 0.85);
          let dim = shade * (1 - base);
          const absZ = zf * s.R + s.camZ;
          let fade = absZ > near ? Math.max(0, 1 - (absZ - near) / 190) : 1;
          if (lit) {
            dim = Math.min(1, dim + 0.78);
            if (i === focus) fade = 0;
          }
          const d = Math.round(dim * 100) / 100;
          const o = Math.round(fade * 100) / 100;
          if (s.lastD[i] !== d) {
            s.lastD[i] = d;
            el.style.setProperty("--d", String(d));
          }
          if (s.lastOpacity[i] !== o) {
            s.lastOpacity[i] = o;
            el.style.opacity = String(o);
          }
          const front = zf > 0.55;
          if (s.lastFront[i] !== front) {
            s.lastFront[i] = front;
            el.classList.toggle("front", front);
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();


    // ---------- Drag ----------
    let active = false;
    let pending = false;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let downCard: HTMLElement | null = null;
    const slop = coarse ? 14 : 6;
    const K = 0.13;

    const onDown = (e: PointerEvent) => {
      if (focusedRef.current >= 0 || e.button > 0) return;
      downCard = (e.target as Element).closest<HTMLElement>(".card");
      active = true;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      s.velX = s.velY = 0;
      if (e.pointerType === "touch") {
        pending = true;
        dragging = false;
      } else {
        pending = false;
        dragging = true;
        stage.setPointerCapture(e.pointerId);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!active || e.pointerId !== pointerId) return;
      if (pending) {
        const tx = Math.abs(e.clientX - startX);
        const ty = Math.abs(e.clientY - startY);
        if (Math.hypot(tx, ty) < 10) return;
        if (ty > tx * 1.15) {
          active = false;
          pending = false;
          return;
        }
        pending = false;
        dragging = true;
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {}
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      s.dragX += dx * K;
      s.dragY -= dy * K;
      s.velX = reduced ? 0 : dx * K;
      s.velY = reduced ? 0 : -dy * K;
    };
    const onUp = (e: PointerEvent) => {
      if (!active || e.pointerId !== pointerId) return;
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      active = false;
      dragging = false;
      pending = false;
      if (moved < slop && downCard) {
        const idx = Number(downCard.dataset.idx);
        s.velX = s.velY = 0;
        openShot(idx, downCard);
      }
      downCard = null;
    };
    const onCancel = () => {
      active = false;
      dragging = false;
      pending = false;
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onCancel);

    // ---------- Resize ----------
    const onResize = () => layout(false);
    let orientT: ReturnType<typeof setTimeout>;
    const onOrient = () => {
      clearTimeout(orientT);
      orientT = setTimeout(() => layout(true), 220);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrient);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(orientT);
      relayoutRef.current = null;
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrient);
      window.visualViewport?.removeEventListener("resize", onResize);
      document.body.classList.remove("deep", "past-hero");
    };
  }, [focusedRef, openShot, relayoutRef]);

  return (
    <section id="scrolltrack" ref={trackRef} aria-label={m.hero.label}>
      <div id="hero" ref={heroRef}>
        <div id="stage" ref={stageRef}>
          <div id="world" ref={worldRef}>
            <div id="orb" ref={orbRef} aria-hidden="true">
              {archive.map((f, i) => (
                <div
                  key={f.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`card${f.tall ? " tall" : ""}${f.bw ? " bw" : ""}`}
                  data-idx={i}
                >
                  <figure>
                    {srcs[i] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={srcs[i]}
                        alt=""
                        draggable={false}
                        onLoad={(e) => e.currentTarget.classList.add("in")}
                        ref={(img) => {
                          if (img?.complete && img.naturalWidth) img.classList.add("in");
                        }}
                      />
                    )}
                  </figure>
                  <span className="yr">{f.year}</span>
                </div>
              ))}
            </div>
            <h1 id="headline" ref={headlineRef}>
              <span className="inner">
                <span className="main">
                  {words.map((w, i) => (
                    <span key={i}>
                      <span className={`w${i === m.hero.italic ? " it" : ""}`} style={{ ["--i" as string]: i }}>
                        {w}
                      </span>
                      {i === m.hero.breakAfter ? (
                        <>
                          {" "}
                          <span className="br-desk" />
                        </>
                      ) : i < words.length - 1 ? (
                        " "
                      ) : null}
                    </span>
                  ))}
                </span>
                <span className="alt" {...langProps(altLang)}>
                  <span className="w" style={{ ["--i" as string]: words.length }}>
                    {m.hero.alt}
                  </span>
                </span>
              </span>
            </h1>
          </div>
        </div>
        <div className="vig" />

        {/* Hero chrome */}
        <div
          className="chrome hero-chrome hide-deep hide-landscape absolute z-[55] max-w-[min(340px,46vw)] max-[640px]:end-[calc(var(--pad)+var(--safe-right))] max-[640px]:max-w-none"
          style={{
            insetInlineStart: "calc(var(--pad) + var(--safe-left))",
            bottom: "calc(var(--pad) + var(--safe-bottom))",
          }}
        >
          <div>
            <p className="mono mb-3 text-phosphor/60">{m.hero.channel}</p>
            <p className="mb-4 text-[13px] leading-[1.62] text-ink/72 max-[640px]:text-[12px] max-[380px]:hidden">
              {m.hero.intro}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setGrid(true)}
                className="group inline-flex min-h-11 items-center gap-0 rounded-full bg-ink px-5 text-[13px] font-normal text-black transition-colors hover:bg-white"
              >
                <span className="me-0 inline-block h-1.5 w-0 rounded-full bg-red transition-all duration-300 group-hover:me-2 group-hover:w-1.5" />
                {m.hero.enter}
              </button>
              <a
                href="#restoration"
                className="inline-flex min-h-11 items-center rounded-full border border-ink/35 px-5 text-[13px] text-ink no-underline transition-colors hover:border-ink"
              >
                {m.hero.film}
              </a>
            </div>
          </div>
        </div>

        <div
          className="chrome hero-chrome hide-deep hide-landscape mono absolute z-[55] text-ink/45 max-[768px]:hidden"
          style={{ insetInlineEnd: "calc(var(--pad) + var(--safe-right))", bottom: "calc(var(--pad) + var(--safe-bottom) + 12px)" }}
        >
          {/* Placeholder figure — replace with the real archive size. */}
          {m.hero.counter}
        </div>

        <div
          className="cue chrome hero-chrome hide-deep hide-landscape mono absolute left-1/2 z-[54] flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap text-ink/42 max-[640px]:hidden max-[900px]:!bottom-auto max-[900px]:top-[calc(var(--pad)*4+var(--safe-top))]"
          style={{ bottom: "calc(var(--pad) + var(--safe-bottom) + 18px)", letterSpacing: ".24em" }}
        >
          <s />
          {m.hero.cue}
        </div>
      </div>
    </section>
  );
}
