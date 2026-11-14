"use client";

import { LOCALES, useI18n, type Locale } from "@/lib/i18n";
import { useArchive } from "./ArchiveContext";

export const LANGUAGE_NAMES: Record<Locale, string> = { ar: "العربية", fr: "Français", en: "English" };

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale, m } = useI18n();
  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="group" aria-label={m.header.language}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          <button
            type="button"
            lang={l}
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            aria-label={LANGUAGE_NAMES[l]}
            title={LANGUAGE_NAMES[l]}
            className={`min-h-11 px-0.5 transition-opacity ${locale === l ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
          >
            {l.toUpperCase()}
          </button>
          {i < LOCALES.length - 1 && <span className="opacity-40">·</span>}
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const { isMenuOpen, setMenuOpen } = useArchive();
  const { m } = useI18n();

  return (
    <header className="site chrome">
      <a
        className="wordmark"
        href="#"
        aria-label={m.header.home}
        onClick={(e) => {
          e.preventDefault();
          setMenuOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="logo-mark" width={509} height={405} />
        <span>{m.header.brand}</span>
      </a>

      <p className="onair mono hidden min-h-11 items-center text-white/70 lg:flex">
        <span className="pulse" />
        {m.header.onAir}
      </p>

      <div className="flex items-start gap-[clamp(16px,2.4vw,36px)]">
        {/* On phones the switch lives in the menu. */}
        <LanguageSwitch className="hidden min-h-11 text-[13px] text-white sm:flex" />
        <button
          id="menuBtn"
          type="button"
          className="menu-btn"
          aria-expanded={isMenuOpen}
          aria-controls="menu"
          aria-label={isMenuOpen ? m.header.closeMenu : m.header.openMenu}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="menu-label">{m.header.menu}</span>
          <span className="bars">
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  );
}
