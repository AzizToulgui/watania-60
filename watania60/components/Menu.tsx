"use client";

import { langProps, useI18n } from "@/lib/i18n";
import { useArchive } from "./ArchiveContext";
import { LanguageSwitch } from "./Header";

const LINKS = [
  { key: "archive", target: "grid" },
  { key: "search", target: "search" },
  { key: "restoration", target: "restoration" },
  { key: "studio", target: "studio" },
  { key: "together", target: "together" },
  { key: "about", target: "timeline" },
] as const;

export default function Menu() {
  const { isMenuOpen, setMenuOpen, setGrid } = useArchive();
  const { m, altLang } = useI18n();

  return (
    <div id="menu" aria-hidden={!isMenuOpen}>
      <nav aria-label={m.menu.nav}>
        {LINKS.map((l) => (
          <a
            key={l.key}
            href={l.target === "grid" ? "#" : `#${l.target}`}
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              if (l.target === "grid") {
                setGrid(true);
                return;
              }
              setGrid(false);
              // Wait a frame so the body unlocks before scrolling.
              requestAnimationFrame(() =>
                document.getElementById(l.target)?.scrollIntoView({ behavior: "smooth", block: "start" }),
              );
            }}
          >
            {m.menu.links[l.key]}
            <span {...langProps(altLang)}>{m.menu.alt[l.key]}</span>
          </a>
        ))}
      </nav>
      <div className="addr">
        <span>{m.menu.city}</span>
        <LanguageSwitch className="text-ink sm:hidden" />
        {/* Placeholder address */}
        <span dir="ltr">hello@watania60.tn</span>
      </div>
    </div>
  );
}
