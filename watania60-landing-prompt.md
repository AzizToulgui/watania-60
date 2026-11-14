# Prompt — Watania 60 Landing Page (Next.js + Tailwind CSS)

Build a production-ready landing page for **Watania 60 — From Memory to the Future** using **Next.js 15 (App Router, TypeScript)** and **Tailwind CSS v4**. No UI kits, no component libraries, no animation libraries. Motion is CSS transitions plus hand-written `requestAnimationFrame` in client components. Match this spec exactly. Do not redesign, rename ids/classes listed here, substitute fonts, or invent extra sections.

The page is a black, cinematic gateway into 60 years of Tunisian television (1966–2026). The hero is a 3D sphere of archive frames, with the title sitting in the exact center of the sphere. Below the hero, the page scrolls through six feature chapters, a 60-year timeline, and a closing call to action.

---

## CONCEPT

- The page should feel like an old broadcast signal turning into something new: test cards, scanlines, film grain, channel-tuning static, and one Tunisian red (#E70013) used as an "on air" light.
- Typography is editorial and quiet. Motion is slow and controlled. No neon, no glassmorphism cards, no purple AI gradients, no emoji, no stock "AI brain" imagery.
- Bilingual by design. Every key headline has an Arabic line beneath or beside it. The Arabic is part of the layout, not a translation footnote.

---

## PROJECT STRUCTURE

```
app/
  layout.tsx          fonts, metadata, <body class="locked">
  page.tsx            assembles sections in order
  globals.css         @import "tailwindcss"; @theme tokens; keyframes; the few rules Tailwind can't express
components/
  Splash.tsx          "use client"
  IntroFilm.tsx       "use client"
  Header.tsx          "use client"
  Menu.tsx            "use client"
  ArchiveSphere.tsx   "use client"  (hero: stage, world, orb, headline, drag, camera loop)
  Lightbox.tsx        "use client"
  Cursor.tsx          "use client"
  Grain.tsx           fixed film-grain + scanline overlay
  sections/
    MemorySearch.tsx
    Restoration.tsx
    Companion.tsx
    Subtitles.tsx
    CreatorStudio.tsx
    Together.tsx
    Timeline.tsx
    FinalCta.tsx
  Footer.tsx
lib/
  archive.ts          the 30 frame records
  sphere.ts           Fibonacci sphere + radius math
public/
  intro.mp4
  archive/frame-01.webp … frame-30.webp
  archive/full/frame-01.jpg … frame-30.jpg
  restoration/before.webp, restoration/after.webp
```

Use `next/font/google` for fonts. Use `next/image` for section images; use plain `<img>` inside the 3D sphere and lightbox (transforms and FLIP need direct control). State shared between the sphere, lightbox, grid, and menu lives in one small React context (`ArchiveContext`): `focused`, `isLit`, `isGrid`, `isMenuOpen`, `revealed`. Body classes (`locked`, `revealed`, `deep`, `gridview`, `lit`, `menu-open`) are toggled from that context in a `useEffect`, because CSS rules key off them.

---

## METADATA (app/layout.tsx)

- `lang="en"`; root `<html>` has `dir="ltr"`. Arabic blocks set `dir="rtl" lang="ar"` locally.
- title: `Watania 60 — From Memory to the Future`
- description: `Sixty years of Tunisian television, reimagined with AI. Search scenes by memory, rediscover restored classics, and share them across generations.`
- viewport: `width=device-width, initial-scale=1, viewport-fit=cover`, themeColor `#000000`
- Open Graph image: `/og.jpg` (1200×630)

---

## FONTS (next/font/google)

- Display serif: **Fraunces** (weights 300, 400; italic 400), variable `--font-serif`. Used for wordmark, splash mark, sphere headline, section titles, lightbox title, timeline years.
- Sans: **Inter** (300, 400, 500), variable `--font-sans`. Body weight 300, antialiased.
- Arabic: **Noto Kufi Arabic** (300, 400, 500), variable `--font-arabic`. Every `[lang="ar"]` element uses it, with `letter-spacing: 0` (never track Arabic).
- Mono: **JetBrains Mono** (400), variable `--font-mono`. Used only for timecodes, channel numbers, and "REC"/"ON AIR" labels, 10–11px, uppercase, letter-spacing .2em.

---

## TOKENS (globals.css, `@theme` + `:root`)

```
--color-bg: #000
--color-ink: #f4f2ef
--color-dim: #8c8783
--color-line: rgba(244,242,239,.18)
--color-red: #E70013        /* Tunisian red: on-air light, active states, one accent per screen */
--color-phosphor: #d9e7d4   /* faint CRT green-white for timecodes */
--pad: clamp(14px, 2.6vw, 34px)
--ease: cubic-bezier(.22,.61,.36,1)
--hw: min(60vw, 720px)
--persp: 1150px             /* JS overwrites per breakpoint */
--safe-top/right/bottom/left: env(safe-area-inset-*)
```

- `html`: background #000, `scrollbar-gutter: stable`.
- `body`: bg black, ink color, `overflow-x: hidden`, `overscroll-behavior-y: none`.
- `body.locked`: `overflow: hidden; height: 100dvh`.
- Red rule: at most one red element visible per viewport. It is a signal, never a fill for large areas.

---

## GLOBAL OVERLAY — Grain.tsx

Fixed inset 0, z-index 95, pointer-events none.
- Film grain: an SVG `feTurbulence` noise (baseFrequency .9, numOctaves 2) as a data-URI background, opacity .06, `mix-blend-mode: overlay`, animated with `steps(6)` translate jitter over 1s.
- Scanlines: `repeating-linear-gradient(to bottom, rgba(255,255,255,.025) 0 1px, transparent 1px 3px)`.
- Disabled under `prefers-reduced-motion` (static grain, no jitter).

---

## LAYERS (bottom to top)

1. Hero scroll track `#scrolltrack` (height 130vh) — the sphere hero is `position: sticky; top: 0; height: 100dvh` inside it, so the dolly-zoom plays over 30vh of scroll and then the page continues into the sections.
2. `#stage` (inside the sticky hero) z-index 10.
3. `.vig` vignette z-index 12.
4. `#grid` flat archive grid z-index 20.
5. Section content z-index 30 (normal flow below the hero).
6. Header z-index 60, hero chrome z-index 55.
7. `#menu` z-index 80.
8. `#lit` lightbox z-index 90.
9. Grain z-index 95.
10. `#intro` z-index 200.
11. `#splash` z-index 250.
12. `#dot` cursor z-index 300.

---

## SPLASH — Splash.tsx

Fixed inset 0, black, grid centered, gap 26px.
- Behind the mark: an SMPTE-style test card drawn in CSS (seven vertical bars in desaturated grey tones, NOT rainbow — #2a2a2a to #d6d6d6), opacity .08, which flickers twice (opacity .08 → .18 → .04 → .08) over 600ms like a signal locking.
- `.mark`: Fraunces 400, clamp(30px, 4.8vw, 58px). Text: `Watania` + a red-dot `<i>` (8px circle, #E70013) + `60`. riseIn 1.25s ease .15s forwards.
- `.mark-ar` (`lang="ar"`): `الوطنية ٦٠`, Noto Kufi Arabic 300, clamp(16px, 2vw, 22px), rgba(244,242,239,.55). riseIn .9s ease .45s.
- `.bar`: width clamp(120px, 17vw, 210px), height 1px, rgba(244,242,239,.16). Inner `<s id="bar">` fills via `scaleX(progress)`, transition .55s.
- `.tag` (mono): `CH 01 · 1966 — 2026`, 10px, letter-spacing .26em, rgba(244,242,239,.38). riseIn .9s ease .7s.
- Progress counts the 30 sphere frames + the intro film. Hold at least 1150ms, never longer than 9000ms. Then fill the bar, add `.out` (opacity 0 over .6s), unmount after 950ms, start the film.

---

## INTRO FILM — IntroFilm.tsx

Same behavior as a cinematic intro: `/public/intro.mp4` (supply a 6–10s montage of archive footage cutting from black-and-white to color). `muted`, `playsInline`, `autoPlay`, `preload="auto"`, `disablePictureInPicture`, set `muted/defaultMuted/playsInline` before `play()`, `playbackRate = 2` (set again on `play`).
- Reveal at `(duration - currentTime - 0.45) / 2` seconds after `playing` (min 300ms), on `ended`, on Skip, or at a 14000ms backstop. If autoplay is blocked, first pointerdown/keydown/touchstart calls `play()`; if still paused after 2600ms, reveal anyway.
- `.veil` fades to black over 1.15s on `.closing`. Then remove `body.locked`, lay out the sphere twice inside the veil (sync + rAF + again at 1000ms), add `body.revealed`, fade `#intro` out (.5s linear), unmount after 700ms.
- Bottom-left mono timecode that counts up with the video: `00:00:04:12` style, rgba(217,231,212,.6).
- Skip button bottom-right: 11px uppercase, letter-spacing .18em, pill, 1px solid rgba(244,242,239,.25), min-height 44px, backdrop-blur 6px. Label: `Skip`.
- `.fallback` (on error or missing file): radial-gradient(circle at 50% 46%, #2a0a0c 0%, #0a0304 42%, #000 72%) with the grain overlay. Reveal after 1300ms.

---

## HEADER — Header.tsx

Fixed top, full width, z-index 60, flex space-between, `mix-blend-mode: difference`, padding `calc(var(--pad)*.8 + var(--safe-top)) calc(var(--pad) + var(--safe-right)) calc(var(--pad)*.35) calc(var(--pad) + var(--safe-left))`.
- Wordmark link: Fraunces clamp(19px, 2.1vw, 27px), white: `Watania` + red dot + `60`. (The red dot stays red: wrap the header's blend mode so the dot sits outside it, or use `isolation`.)
- Center (desktop only, ≥1024px): mono label `● ON AIR SINCE 1966`, the dot is #E70013 and pulses opacity 1 → .35 over 2.4s.
- Right: language switch `AR · FR · EN` (13px, active item opacity 1, others .5; switching is visual only for now) and the Menu button: label `Menu` + two-bar icon (second bar shorter, hover slides it −8px; open state crosses into an X at ±45deg).

---

## HERO — ArchiveSphere.tsx

### HTML (exact)
```html
<section id="scrolltrack">
  <div id="hero" class="sticky top-0 h-dvh">
    <div id="stage">
      <div id="world">
        <div id="orb"></div>
        <h1 id="headline">
          <span class="inner">
            <span class="en">…words…</span>
            <span class="ar" lang="ar" dir="rtl">من الذاكرة إلى المستقبل</span>
          </span>
        </h1>
      </div>
    </div>
    <div class="vig"></div>
    …hero chrome…
  </div>
</section>
```

### Centering (copy verbatim into globals.css — do not replace with Tailwind centering utilities)
```css
#stage{position:absolute;inset:0;perspective:var(--persp);perspective-origin:50% 50%;overflow:hidden;touch-action:none}
@media (pointer:coarse){#stage{touch-action:pan-y}}
#world{position:absolute;top:50%;left:50%;width:0;height:0;transform-style:preserve-3d;will-change:transform}
#orb{position:absolute;top:0;left:0;width:0;height:0;transform-style:preserve-3d}
#headline{
  position:absolute;top:0;left:0;
  width:var(--hw);margin-left:calc(var(--hw) / -2);
  text-align:center;font-family:var(--font-serif);font-weight:300;
  font-size:clamp(28px, 4.2vw, 64px);line-height:1.02;letter-spacing:-.015em;
  color:#fff;text-shadow:0 2px 34px rgba(0,0,0,.6);
  pointer-events:none;user-select:none;
}
#headline .inner{position:absolute;top:0;left:0;width:100%;transform:translateY(-50%)}
#headline .ar{display:block;margin-top:.5em;font-family:var(--font-arabic);font-weight:300;font-size:.38em;letter-spacing:0;color:rgba(244,242,239,.7)}
```
The title is centered on the sphere origin by the negative pixel margin (horizontal) and `.inner`'s translateY(-50%) (vertical). Never use percentage margins, flex, grid, or a centering transform on `#headline` — JS overwrites `#headline.style.transform` every frame.

English words: `From Memory` (line break on ≥640px) `to the` *`Future`* — five inline-block spans with `--i:0..4`. "Future" is Fraunces italic. Each span starts opacity 0, translateY(.42em), blur(7px), and on `body.revealed` transitions to rest with delay `calc(.9s + var(--i)*.085s)`. The Arabic line fades in with `--i:5`.

### Frames — lib/archive.ts
30 records `{ id, year, program, genre, note, tall? }` spread across 1966–2026 (about one per two years). Fields are placeholders the team replaces with real Watania archive entries; do not invent real program titles. Use this shape:
```ts
{ id: "frame-01", year: 1966, program: "Program title", genre: "First broadcast", note: "One sentence about the moment." }
```
Mark frames 1–12 as black-and-white (`bw: true`) so the sphere visibly shifts from monochrome to color as the years advance. Frames 9 and 22 are `tall` (portrait cards, aspect 4/5).

### Sphere math — lib/sphere.ts (copy exactly)
```
N = 30, GA = π * (3 - √5)
for i in 0..N-1:
  y = 1 - (i/(N-1))*2;  rad = √max(0, 1-y²);  θ = i*GA
  x = cos θ * rad;  z = sin θ * rad
  lat = asin(y)·180/π;  lon = atan2(x, z)·180/π
card transform: translate3d(x*R px, -y*R px, z*R px) rotateY(lon deg) rotateX(lat deg)
```
Radius: `hr` .38/.42/.46, `wr` .48/.52/.58, floor 108/120/155 at ≤380 / ≤640 / else; `R = max(floor, min(500, innerHeight*hr, innerWidth*wr))`.
Card width `--cw = round(max(72, R * 0.40))` (smaller than a photo archive — these are TV frames, 4:3 aspect for years < 1995 and 16:9 after). Tall cards 4:5.
Perspective `--persp`: 620 ≤380, 760 ≤640, 920 ≤900, else 1150. Ignore resize deltas under 20px.

### Card chrome
- `figure`: radius 3px, overflow hidden, background #0a0a0a. Inside the figure a CRT treatment: inset box-shadow `0 0 0 1px rgba(255,255,255,.07)`, and `::before` with the scanline gradient at opacity .35.
- Black-and-white frames: `filter: grayscale(1) contrast(1.05)`.
- Depth wash: `figure::after` background `rgba(0,0,0,var(--d,0))`.
- Under each card (absolute, below, 6px gap): mono label `1974`, 9px, rgba(244,242,239,.45). Only visible when the card's depth `zf > .55` (front-facing).
- Hover: scale 1.045 over .5s, the year label turns #E70013.
- Images downscaled once on canvas to 420/520/640/760px (by breakpoint), webp .88, blob URLs reused by the grid.

### Camera loop (same as reference)
- No auto-rotation. Drag-only, with momentum (velocity × 0.94 per frame, snap under .002). Pitch clamped to ±32°. Starting tilt −4°.
- Scroll progress `p = clamp((scrollY) / (innerHeight * 0.30), 0, 1)`.
- `camZ` eases (.075) toward `p * min(64, R*0.12)`.
- `world.style.transform = translateZ(camZ px) rotateY(sy deg) rotateX(sx deg)`.
- `headline.style.transform = rotateX(-sx deg) rotateY(-sy deg) translateZ(R*0.62 px)` — this order, only this.
- Headline opacity `max(0, 1 - p*0.55)`.
- Per-card depth: `base = .14 + .86*((zf+1)/2)^.85`, `dim = (1 - min(1, p*1.6)) * (1 - base)`, near-plane fade at `persp*.66` over 190px. Lightbox open: +0.78 dim on all cards, focused card fade 0. Write styles only when values change.
- At p = 1 the whole hero fades to opacity 0 over the last 15% of the track so the first section emerges from black.

### Drag
Pointer capture rules, 0.13°/px, 10px horizontal-intent check on touch (vertical > horizontal×1.15 cancels so the page scrolls), click slop 14px coarse / 6px fine, click opens the card under the pointer at pointerdown.

### Hero chrome (fade in 1.2s, delay .15s after `body.revealed`; hidden on `.deep`, `.gridview`, `.lit`)
- Bottom-left `.intro-card`, max-width min(340px, 46vw):
  - Mono line: `CH 01 — ARCHIVE 1966/2026`
  - 13px, line-height 1.62, rgba(244,242,239,.72): `Sixty years of Tunisian television, searchable by memory, restored with care, and ready to be shared again. The originals are always preserved.`
  - Two buttons, gap 10px: primary `Enter the archive` (bg #f4f2ef, text #000, radius 999px, min-height 44px, padding 0 20px, 13px) and ghost `Watch the film` (1px border rgba(244,242,239,.35)). Hover primary: bg #fff, a 6px red dot slides in before the label.
- Bottom-right: mono counter `30 / 4,200+ HOURS` (placeholder figure, flag it in a comment).
- Bottom-center cue: animated 44×1 line + `Drag to rotate · Scroll to enter`. Hidden <640px.
- Grid toggle button (2×2 squares) appears when `.deep` or `.gridview`, opens `#grid` with all 30 frames, captions `year — program` on hover.

---

## SECTIONS (below the hero)

Common section rules:
- Each section: `min-h-dvh`, padding-block clamp(96px, 14vh, 180px), padding-inline var(--pad), max-width 1440px centered.
- Section head: mono chapter label (`01 / SEARCH BY MEMORY`), then a Fraunces 300 title clamp(34px, 5.2vw, 76px), line-height 1.02, letter-spacing −.02em, then the Arabic title (Noto Kufi 300, clamp(18px, 2vw, 26px), opacity .6, `dir="rtl"`), then a 15px/1.6 lead paragraph max-width 52ch at rgba(244,242,239,.72).
- Layouts alternate: text-left/visual-right, then full-bleed visual, then visual-left/text-right. Do not use three equal feature cards anywhere.
- Reveal on scroll with one IntersectionObserver: children with `[data-reveal]` go from opacity 0 / translateY(24px) / blur(6px) to rest, 1s var(--ease), stagger 90ms.
- Between sections: a 1px full-width line rgba(244,242,239,.12) with a mono timecode at its left (`00:12:48:00`) that increments per section.

### 01 — MemorySearch.tsx — "Describe it. We'll find the scene."
Arabic: `صِف الذكرى، ونجد لك المشهد`
- Left: head + lead: `No titles, no dates needed. Describe what you remember — a voice, a song, a kitchen, a summer evening — and Watania 60 finds the moment in six decades of footage.`
- Right: a large search field (height 64px, radius 999px, 1px border rgba(244,242,239,.3), Fraunces italic 20px placeholder) that auto-types three example memories in a loop, 45ms per character, 1.8s hold, backspace at 20ms:
  - `the grandmother laughing in a Ramadan evening series`
  - `a song on a beach, early eighties, black and white`
  - `the news anchor the day the sea froze in Bizerte` (team: replace with real memories)
- Under the field, three result rows animate in after each phrase finishes: 16:9 thumbnail (96px wide), program placeholder, mono `1983 · EP 12 · 00:14:22`, and a match bar (thin red 1px line at 92%, 78%, 61%).
- Input is real and focusable but does nothing yet (`onSubmit` preventDefault, comment `// TODO: semantic scene search API`).

### 02 — Restoration.tsx — "Restored. Never replaced."
Arabic: `نُرمّم دون أن نُلغي الأصل`
- Full-bleed (edge to edge) before/after comparison, aspect 21/9 on desktop, 4/5 on mobile.
- Left layer: `/restoration/before.webp` (grainy, black-and-white, soft). Right layer: `/restoration/after.webp` (colorized, sharpened). A draggable vertical handle (1px #f4f2ef line + 44px round grip with `‹ ›`), keyboard-accessible (`role="slider"`, arrow keys move 2%).
- Corner labels in mono: `ORIGINAL · 1971 · 576i` and `RESTORED · AI COLORIZED · 4K`.
- Below: three inline stats separated by thin lines (no cards): `Restoration`, `Colorization`, `Upscaling` each with a one-line description, and a final line in red-dot mono: `● The original version is always one tap away.`

### 03 — Companion.tsx — "Ask the archive anything."
Arabic: `اسأل الأرشيف`
- Right side: a conversation panel (not a phone mockup). Background #0a0a0a, 1px border line, radius 6px, max-width 520px.
- Three scripted exchanges reveal one message at a time when the section enters view (user bubble right-aligned ink-on-#1a1a1a; companion answer left-aligned, no bubble, Fraunces 17px, with a small mono source line `Source: Archive · 1987 · EP 03`). Typing indicator: three 4px dots.
  - User: `Who played the father in that 1990s family series?` → Companion: placeholder answer + "Watch his first scene" link.
  - User: `Why was this program so popular?` → short contextual answer.
  - User (in Arabic, rtl): `متى بُثّت أول نشرة أخبار ملونة؟` → answer in Arabic.
- Left: head + lead about programs, actors, characters, and historical moments.

### 04 — Subtitles.tsx — "Every voice, in every language."
Arabic: `كل صوت، بكل لغة`
- A centered 16:9 frame (max-width 960px) with a looping muted clip or still, and a live subtitle line at the bottom that cycles every 2.4s between Tunisian Arabic (rtl), French, and English for the same sentence, crossfading .4s.
- Above the frame, a segmented control `AR · FR · EN · Auto` (Auto active by default and cycling; clicking a language locks it). Active segment underlined in red.

### 05 — CreatorStudio.tsx — "Turn a scene into a story."
Arabic: `حوّل المشهد إلى قصة`
- Visual-left: a 16:9 clip with an animated 9:16 crop frame (1px #f4f2ef border, darkened outside at rgba(0,0,0,.6)) that tracks smoothly left/right over 6s ("smart cropping"), then the frame "pops out" (scale .96 → 1, 400ms) into a vertical preview beside it with burned-in captions and a progress bar.
- Below the visual, a timeline strip: 12 thumbnails, two highlight markers (red ticks) labeled `HIGHLIGHT`.
- Text-right: lead + three short lines: `Smart crop`, `Auto captions`, `Highlights`. CTA ghost button `Open Creator Studio`.

### 06 — Together.tsx — "Watch it again. Together."
Arabic: `نشاهدها معاً من جديد`
- A watch-party scene: a 16:9 player at center, overlapped by a row of 5 circular avatars (gradient placeholders, no stock faces) with generation labels in mono (`1968`, `1979`, `1994`, `2007`, `2012` = birth years) to communicate generations watching together.
- Floating reactions rise and fade from the avatars every 1.6s (small text, not emoji: `!`, `♪`, `ههه`, `bravo`).
- Side: a shared playlist list, 4 rows, each with thumbnail, title placeholder, `Added by Sami's grandmother` style meta (placeholder names), and a total runtime in mono.

### 07 — Timeline.tsx — "Sixty years on one line."
Arabic: `ستون عاماً على خط واحد`
- Horizontal scroll-snapping strip (drag + wheel-to-horizontal on desktop, native swipe on mobile) of seven decade stops: `1966, 1976, 1986, 1996, 2006, 2016, 2026`.
- Each stop: giant Fraunces year (clamp(64px, 11vw, 160px), outlined text `-webkit-text-stroke: 1px rgba(244,242,239,.4)` with transparent fill, filling solid #f4f2ef when centered), a frame, and a one-sentence placeholder milestone.
- A 1px line runs through all stops; a red 9px dot sits on the line at the currently centered stop. The images shift from grayscale (1966) to full color (2026) using `filter: grayscale(var(--g))` interpolated per stop.
- 2026 stop reads `Today — the archive becomes intelligent.`

### 08 — FinalCta.tsx
- Black, centered, min-h-dvh. Behind the text, a faint sphere ghost: the same 30 frames as a static 2D ring, opacity .12.
- Title: `Sixty years of memory.` / *`Ready when you are.`* (Fraunces 300, clamp(40px, 7vw, 108px)).
- Arabic: `ستون عاماً من الذاكرة، في انتظارك`
- Email field + `Request early access` button (same pill style as hero primary). Success state replaces the form with mono `● YOU'RE ON THE LIST`. No backend: `// TODO: waitlist endpoint`.

### Footer.tsx
Three columns ≥900px, stacked below: wordmark + `Watania 60 — From Memory to the Future` / links `Archive, Restoration, Creator Studio, Watch Parties, About` / Arabic tagline + `© 2026 Établissement de la Télévision Tunisienne` (team: confirm legal name). 12.5px, color var(--color-dim). Bottom mono line: `CH 01 · END OF TRANSMISSION`.

---

## LIGHTBOX — Lightbox.tsx

Same FLIP behavior as reference: plate flies from the clicked card to center (scale floor .04), shows the decoded card image immediately and swaps in `/archive/full/frame-XX.jpg` on load (stale-token guarded). No scrim dimming, archive stays visible behind.
- `.meta` two columns: left `h2` program title (Fraunces) + mono `1974 · Genre`; right note paragraph + two small ghost buttons: `Restore this scene` and `Ask the companion`.
- If the frame is `bw`, show a tiny toggle in the plate's top-left: `Original / Restored` (visual only).
- Close button on the photo top-right, Escape closes lightbox → menu → grid in that order.

---

## MENU — Menu.tsx

Fixed inset 0, background #050505, `clip-path: inset(0 0 100% 0)` → `inset(0)` over .85s var(--ease).
Links (Fraunces clamp(34px, 7.6vw, 78px), opacity .55 → 1 on hover, each with its Arabic equivalent small and dim on the opposite side): `The Archive` (opens grid), `Search by Memory`, `Restoration`, `Creator Studio`, `Watch Together`, `About`. Clicking scrolls smoothly to the section and closes the menu.
Bottom: `Tunis · Since 1966` and `hello@watania60.tn` (placeholder) in 12.5px dim.

---

## CURSOR — Cursor.tsx

Fine pointers only. 19px circle, `mix-blend-mode: difference`, lerp .2. Grows to 52px with a 1px border over cards, links, buttons. Over the restoration slider it becomes a 52px ring with `‹ ›` inside. Over the timeline it shows mono `DRAG`.

---

## RESPONSIVE

- ≤900px: lightbox meta 1 column; grid minmax(150px,1fr); section layouts stack (visual first, then text); restoration aspect 4/5.
- ≤768px: hide header center label and hero counter; headline clamp(24px, 7vw, 38px) — centering unchanged.
- ≤640px: `--hw: min(86vw, 360px)`; `--pad: clamp(12px, 4vw, 18px)`; hide scroll cue; hero intro-card full width, paragraph 12px; grid 2 columns with captions always visible; lightbox becomes a scrolling block.
- ≤380px: `--hw: min(90vw, 320px)`; hide hero paragraph; grid 1 column.
- Landscape max-height 520px: hide hero chrome except header; headline clamp(18px, 4.8vh, 28px).
- `prefers-reduced-motion`: no grain jitter, no auto-typing (show the first phrase statically), no subtitle cycling, sphere drag still works but momentum is disabled; all transitions .14s.

---

## ACCESSIBILITY & PERFORMANCE

- Every interactive element has a 44px minimum target and a visible focus ring (2px #f4f2ef outline, 3px offset; red is not used for focus).
- The sphere is `aria-hidden`; the grid view and an `sr-only` list provide the same 30 frames to assistive tech.
- Arabic blocks always carry `lang="ar" dir="rtl"`.
- LCP target < 2.5s: the hero headline is real text; sphere images load progressively after the splash; section images use `next/image` with `sizes`.
- All animation loops pause when their section is off-screen (IntersectionObserver) and when the tab is hidden.

---

## CHECK BEFORE YOU FINISH

1. With the page revealed and no drag, "From Memory to the Future" and its Arabic line are centered on the sphere origin on both axes, at 1440px and at 390px wide. Rotating the sphere keeps the words fixed at the center while frames move around them.
2. The sphere shifts visibly from black-and-white (early years) to color (recent years).
3. Scrolling past the hero dollies in, fades the hero to black, and the first section rises out of black with no jump.
4. Only one red element is visible on screen at a time.
5. Every section has its English title and its Arabic title.
6. No three-equal-card feature rows, no emoji, no stock AI imagery, no purple.
7. `npm run build` passes with no type errors and no hydration warnings (all browser-only code lives in client components behind `useEffect`).

## OUTPUT

A complete Next.js 15 + Tailwind v4 project with every file listed above, fully written (no `// ...rest` placeholders), plus a short README explaining which assets to drop into `/public` and which placeholder strings to replace with real Watania archive data.
