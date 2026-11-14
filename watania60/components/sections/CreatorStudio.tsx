"use client";

import { archive, frame, images } from "@/lib/archive";
import { useI18n } from "@/lib/i18n";
import { SectionHead, sectionCls, useInView, useReducedMotion } from "./shared";

export default function CreatorStudio() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const clip = frame("sitcom");
  const play = inView && !reduced ? "running" : "paused";
  const { m } = useI18n();
  const t = m.studio;

  return (
    <section id="studio" className={sectionCls}>
      <div className="grid items-center gap-[clamp(48px,6vw,110px)] min-[901px]:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        {/* The demo keeps a left-to-right layout so the crop animation matches in every language. */}
        <div ref={ref} data-reveal className="max-[900px]:order-2" dir="ltr">
          {/* Side by side from tablet up; stacked on phones so both previews stay readable. */}
          <div className="flex items-end gap-[clamp(16px,2.4vw,32px)] max-[640px]:flex-col max-[640px]:items-center">
            {/* 16:9 source with tracking 9:16 crop */}
            <div className="relative aspect-video flex-1 overflow-hidden rounded-[3px] bg-[#0b0b0b] max-[640px]:w-full max-[640px]:flex-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={clip.thumb} alt="" className="h-full w-full object-cover" />
              <div
                className="absolute top-0 h-full w-[31.64%] border border-ink shadow-[0_0_0_9999px_rgba(0,0,0,.6)]"
                style={{ animation: "cropTrack 6s ease-in-out infinite", animationPlayState: play }}
              >
                <span className="mono absolute -top-px left-1.5 translate-y-1.5 text-[8px] text-ink/80">9:16</span>
              </div>
              <span className="mono absolute bottom-3 left-3 whitespace-nowrap text-ink/70 max-[640px]:text-[9px]">{t.crop}</span>
            </div>

            {/* Vertical preview */}
            <div
              className="relative aspect-[286/512] w-[clamp(110px,16vw,210px)] shrink-0 max-[640px]:mb-7 max-[640px]:w-[46%]"
              style={{ animation: "popOut 6s ease infinite", animationPlayState: play }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images.phone} alt={t.phoneAlt} className="h-full w-full object-contain" />
              <span className="mono absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] whitespace-nowrap text-ink/60">
                {t.ready}
              </span>
            </div>
          </div>

          {/* Timeline strip */}
          <div className="relative mt-5">
            <div className="grid grid-cols-12 gap-1 max-[640px]:grid-cols-6">
              {archive.slice(0, 12).map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={f.id}
                  src={f.thumb}
                  alt=""
                  className={`aspect-video w-full rounded-[1px] object-cover opacity-60 ${i >= 6 ? "max-[640px]:hidden" : ""}`}
                />
              ))}
            </div>
            {[22, 64].map((left) => (
              <div key={left} className="absolute -top-2 -bottom-2" style={{ left: `${left}%` }}>
                <div className="h-full w-px bg-red" />
                <span className="mono absolute top-full mt-1.5 -translate-x-1/2 text-[8px] text-ink/60">{t.highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHead copy={t} />
          <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {t.features.map(({ t: title, d }, i) => (
              <div key={i} data-reveal style={{ ["--s" as string]: i }} className="flex items-baseline justify-between gap-6 py-3.5">
                <dt className="shrink-0 font-serif text-[18px] whitespace-nowrap">{title}</dt>
                <dd className="text-end text-[13px] text-ink/60">{d}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#together"
            data-reveal
            className="mt-8 inline-flex min-h-11 items-center rounded-full border border-ink/35 px-5 text-[13px] text-ink no-underline transition-colors hover:border-ink"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
