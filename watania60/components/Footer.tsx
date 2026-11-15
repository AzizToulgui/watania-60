"use client";

import { langProps, useI18n } from "@/lib/i18n";

const LINKS = [
  ["archive", "#search"],
  ["restoration", "#restoration"],
  ["studio", "#studio"],
  ["together", "#together"],
  ["about", "#timeline"],
] as const;

export default function Footer() {
  const { m, altLang } = useI18n();
  const t = m.footer;
  return (
    <footer className="relative z-30 snap-end border-t border-ink/12 px-[var(--pad)] pt-16 pb-[calc(var(--pad)+var(--safe-bottom))] text-[12.5px] text-dim">
      <div className="mx-auto grid max-w-[1440px] gap-10 min-[900px]:grid-cols-3">
        <div>
          <p className="flex items-center gap-3 font-serif text-[24px] text-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width={509} height={405} className="h-10 w-auto" />
            {m.header.brand} 60
          </p>
          <p className="mt-2">{t.tagline}</p>
        </div>
        <ul className="flex flex-col gap-1">
          {LINKS.map(([key, href]) => (
            <li key={key}>
              <a href={href} className="inline-flex min-h-8 items-center text-ink/70 no-underline transition-colors hover:text-ink">
                {t.links[key]}
              </a>
            </li>
          ))}
        </ul>
        <div className="min-[900px]:text-end">
          <p {...langProps(altLang)} className="text-[15px] text-ink/70 min-[900px]:[text-align:inherit]">
            {t.alt}
          </p>
          {/* Confirm the legal entity name before launch. */}
          <p className="mt-2">{t.rights}</p>
        </div>
      </div>
      <p className="mono mx-auto mt-16 max-w-[1440px] text-phosphor/40">{t.end}</p>
    </footer>
  );
}
