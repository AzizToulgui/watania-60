# Watania 60 — From Memory to the Future

Landing page for Watania 60, built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.
No UI or animation libraries: motion is CSS plus hand-written `requestAnimationFrame`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## What's on the page

1. Splash (test card, loading bar), then the intro film at 2× with Skip.
2. Hero: a 3D sphere of 15 archive frames (1966 → 2026, black-and-white turning to color) with
   "From Memory to the Future / من الذاكرة إلى المستقبل" fixed at its center. Drag to rotate,
   scroll to dolly in. Click a frame for the FLIP lightbox; the grid button opens a flat archive.
3. Sections: Search by memory · Restoration (before/after slider) · AI companion · Subtitles &
   translation · Creator Studio · Watch together · 60-year timeline · Early-access CTA · Footer.

## Replace before launch

| What | Where |
| --- | --- |
| Intro film (6–10 s montage, B&W → color) | `public/intro.mp4` (missing → a fallback screen is shown) |
| Clear rights for the Watania frames (see `CREDITS.md`) | `assets/images/` |
| Years marked "approx." and frame notes | `lib/archive.ts` |
| Example memories and results | `components/sections/MemorySearch.tsx` |
| Companion answers (`[Actor name]`, `[year]`) | `components/sections/Companion.tsx` |
| Timeline milestones | `components/sections/Timeline.tsx` |
| Playlist names, "4,200+ hours" figure | `Together.tsx`, `ArchiveSphere.tsx` |
| Contact email, legal entity name | `Menu.tsx`, `Footer.tsx` |
| OG image (1200×630) | add `public/og.jpg` and `openGraph.images` in `app/layout.tsx` |

## Languages (AR · FR · EN)

All text lives in `messages/en.ts`, `messages/fr.ts` and `messages/ar.ts`. The French and Arabic
files are typed against the English one, so a missing or misspelled key fails `tsc`.

- No locale URLs: `lib/i18n.tsx` keeps the language in React state, remembers it in
  `localStorage` (`w60-locale`) and falls back to the browser language on a first visit.
- Switching updates `<html lang dir>`, the page title and description instantly, without a reload.
- Arabic turns the page right-to-left. Positioned chrome uses logical properties (`start`/`end`,
  `inset-inline-*`). The restoration slider, Creator Studio demo and timeline strip stay
  left-to-right on purpose.
- Every title keeps a secondary line in the other script: Arabic under EN/FR, English under AR.
- Strings may use `<em>…</em>` and `<br/>` (see `rich()`). Arabic never gets letter-spacing or
  italics (see `:lang(ar)` in `globals.css`).
- Have a native speaker review the Arabic copy, especially the program notes in `archive`.

## Images

Source stills and the logo live in `assets/images/` (outside `public/`, so they are not shipped).
Every frame is a real photo or broadcast frame; `CREDITS.md` lists where each one comes from and
its license. `npm run images` (`scripts/prepare-images.mjs`) crops away channel logos and
letterboxing, then writes full stills (max 2400 px) to `public/archive/`, 960 px thumbnails to
`public/archive/thumb/`, the restoration "before" frame, the vertical Creator Studio clip, the
Watania+ logo (`public/logo.svg`, cut from the brand sheet) and the app icons. Re-run it after replacing a source image, and
adjust its crop box in the script if the new image has a different layout.

## Not wired yet (marked `TODO` in code)

- Memory search → semantic scene search API
- Early-access form → waitlist endpoint

## Notes

- One screen per section: `html` uses `scroll-snap-type: y mandatory` (proximity on phones, where
  stacked sections can be taller than the screen). Sections use `screenCls` / `sectionCls` from
  `components/sections/shared.tsx`; sizes that must fit one view are tied to `dvh`.

- The title sits just in front of the sphere surface (`TITLE_Z` in `ArchiveSphere.tsx`) and is
  counter-scaled for perspective, so it stays centered and readable while frames pass behind it.
- Tunisian red (`--color-red`) is a signal color: keep it to one element per screen.
