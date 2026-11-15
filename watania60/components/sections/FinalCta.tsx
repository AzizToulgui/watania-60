"use client";

import { useState } from "react";
import { archive } from "@/lib/archive";
import { langProps, useI18n } from "@/lib/i18n";
import { screenCls } from "./shared";

export default function FinalCta() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const { m, altLang } = useI18n();
  const t = m.cta;

  return (
    <section id="access" className={`${screenCls} items-center overflow-hidden px-[var(--pad)]`}>
      {/* Static ghost of the sphere */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-[.12]" aria-hidden="true">
        <div className="relative size-[min(90vw,820px)]">
          {archive.map((f, i) => {
            const a = (i / archive.length) * Math.PI * 2;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={f.id}
                src={f.thumb}
                alt=""
                className={`absolute w-[11%] rounded-[2px] ${f.bw ? "grayscale" : ""}`}
                style={{
                  left: `${50 + Math.cos(a) * 44}%`,
                  top: `${50 + Math.sin(a) * 44}%`,
                  transform: `translate(-50%, -50%) rotate(${(a * 180) / Math.PI + 90}deg)`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-reveal src="/logo.png" alt={t.logoAlt} width={509} height={405} className="mx-auto mb-[clamp(16px,4vh,40px)] w-[clamp(64px,min(8vw,13vh),110px)]" />
        <h2 data-reveal className="font-serif text-[clamp(40px,7vw,108px)] leading-[1] font-light tracking-[-0.025em]">
          {t.line1}
          <br />
          <em>{t.line2}</em>
        </h2>
        <p data-reveal {...langProps(altLang)} className="mt-6 text-[clamp(18px,2.2vw,28px)] font-light text-ink/60" style={{ ["--s" as string]: 1 }}>
          {t.alt}
        </p>

        <div data-reveal className="mx-auto mt-12 max-w-[520px]" style={{ ["--s" as string]: 2 }}>
          {sent ? (
            <p className="mono text-[11px] text-ink" role="status">
              <span className="me-2 inline-block size-1.5 rounded-full bg-red align-[1px]" />
              {t.done}
            </p>
          ) : (
            <form
              className="flex gap-2 max-[480px]:flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: waitlist endpoint
                if (email) setSent(true);
              }}
            >
              <label htmlFor="email" className="sr-only">
                {t.label}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                dir="ltr"
                className="min-h-12 flex-1 rounded-full border border-ink/30 bg-transparent px-5 text-[14px] text-ink outline-none placeholder:text-ink/35 focus:border-ink"
              />
              <button
                type="submit"
                className="group inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-[13px] font-normal text-black transition-colors hover:bg-white"
              >
                <span className="me-0 inline-block h-1.5 w-0 rounded-full bg-red transition-all duration-300 group-hover:me-2 group-hover:w-1.5" />
                {t.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
