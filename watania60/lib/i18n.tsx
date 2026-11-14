"use client";

// Lightweight client-side i18n: no locale URLs. The chosen language lives in
// React state, is remembered in localStorage, and drives <html lang dir>.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import ar from "@/messages/ar";
import en, { type Messages } from "@/messages/en";
import fr from "@/messages/fr";

export const LOCALES = ["ar", "fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

const DICTS: Record<Locale, Messages> = { en, fr, ar };
const STORAGE_KEY = "w60-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  m: Messages;
  dir: "ltr" | "rtl";
  /** Language of the secondary (bilingual) lines under titles. */
  altLang: "ar" | "en";
};

const I18nContext = createContext<Ctx | null>(null);

function detect(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LOCALES as readonly string[]).includes(saved)) return saved as Locale;
  } catch {}
  const nav = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2).toLowerCase());
  return (nav.find((l) => (LOCALES as readonly string[]).includes(l)) as Locale | undefined) ?? "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // The server always renders English; the saved or browser language is applied
  // on mount, while the splash screen still covers the page.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const l = detect();
    if (l !== "en") setLocaleState(l);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const m = DICTS[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = dir;
  }, [locale, dir]);

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, m, dir, altLang: locale === "ar" ? "en" : "ar" }),
    [locale, setLocale, m, dir],
  );
  return (
    <I18nContext.Provider value={value}>
      {/* React hoists these into <head>; they follow the active language. */}
      <title>{m.meta.title}</title>
      <meta name="description" content={m.meta.description} />
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Renders the small markup allowed in messages: <em>…</em> and <br/>. */
export function rich(text: string): ReactNode {
  return text.split(/(<em>.*?<\/em>|<br\/>)/g).map((part, i) => {
    if (part === "<br/>") return <br key={i} />;
    if (part.startsWith("<em>")) return <em key={i}>{part.slice(4, -5)}</em>;
    return part;
  });
}

/** Props for an element whose text is in `lang`, so the browser picks the right direction and font. */
export function langProps(lang: "ar" | "en" | "fr") {
  return { lang, dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const) };
}
