"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { archive } from "@/lib/archive";

type Ctx = {
  /** Decoded (downscaled) image URLs, shared by sphere, grid and lightbox. */
  srcs: (string | undefined)[];
  setSrc: (i: number, url: string) => void;
  /** Splash progress: decoded frames + film. */
  loaded: number;
  total: number;
  reportLoaded: () => void;
  splashDone: boolean;
  setSplashDone: (v: boolean) => void;
  unlocked: boolean;
  setUnlocked: (v: boolean) => void;
  revealed: boolean;
  setRevealed: (v: boolean) => void;
  isGrid: boolean;
  setGrid: (v: boolean | ((p: boolean) => boolean)) => void;
  isMenuOpen: boolean;
  setMenuOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  /** Index of the shot open in the lightbox, -1 when closed. */
  focused: number;
  focusedRef: MutableRefObject<number>;
  openShot: (i: number, from: Element | null) => void;
  closeShot: () => void;
  sourceRef: MutableRefObject<Element | null>;
  openToken: number;
  /** The sphere registers its layout function here so the intro can call it inside the veil. */
  relayoutRef: MutableRefObject<(() => void) | null>;
};

const ArchiveContext = createContext<Ctx | null>(null);

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const total = archive.length + 1;
  const [srcs, setSrcs] = useState<(string | undefined)[]>(() => archive.map(() => undefined));
  const [loaded, setLoaded] = useState(0);
  const [splashDone, setSplashDone] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isGrid, setGrid] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const [openToken, setOpenToken] = useState(0);
  const focusedRef = useRef(-1);
  const sourceRef = useRef<Element | null>(null);
  const relayoutRef = useRef<(() => void) | null>(null);

  const setSrc = useCallback((i: number, url: string) => {
    setSrcs((prev) => {
      const next = prev.slice();
      next[i] = url;
      return next;
    });
  }, []);
  const reportLoaded = useCallback(() => setLoaded((n) => n + 1), []);

  const openShot = useCallback((i: number, from: Element | null) => {
    sourceRef.current = from;
    focusedRef.current = i;
    setFocused(i);
    setOpenToken((t) => t + 1);
  }, []);
  const closeShot = useCallback(() => {
    focusedRef.current = -1;
    setFocused(-1);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const b = document.body;
    const lit = focused >= 0;
    b.classList.toggle("locked", !unlocked || lit || isGrid || isMenuOpen);
    b.classList.toggle("revealed", revealed);
    b.classList.toggle("gridview", isGrid);
    b.classList.toggle("lit", lit);
    b.classList.toggle("menu-open", isMenuOpen);
    document.documentElement.style.overflow = unlocked ? "" : "hidden";
  }, [unlocked, revealed, isGrid, isMenuOpen, focused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (focusedRef.current >= 0) closeShot();
      else if (isMenuOpen) setMenuOpen(false);
      else if (isGrid) setGrid(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen, isGrid, closeShot]);

  const value = useMemo<Ctx>(
    () => ({
      srcs,
      setSrc,
      loaded,
      total,
      reportLoaded,
      splashDone,
      setSplashDone,
      unlocked,
      setUnlocked,
      revealed,
      setRevealed,
      isGrid,
      setGrid,
      isMenuOpen,
      setMenuOpen,
      focused,
      focusedRef,
      openShot,
      closeShot,
      sourceRef,
      openToken,
      relayoutRef,
    }),
    [srcs, setSrc, loaded, total, reportLoaded, splashDone, unlocked, revealed, isGrid, isMenuOpen, focused, openShot, closeShot, openToken],
  );

  return <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>;
}

export function useArchive() {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error("useArchive must be used inside ArchiveProvider");
  return ctx;
}
