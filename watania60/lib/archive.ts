// Archive frames shown in the sphere, grid and lightbox. Images are prepared by
// scripts/prepare-images.mjs from assets/images (sources in CREDITS.md). Titles, genres
// and notes are translated in messages/*.ts under `archive`.
import type { Messages } from "@/messages/en";

export type FrameId = keyof Messages["archive"];

export type Frame = {
  id: FrameId;
  year: number;
  /** The year is a placeholder for the archive team to verify. */
  approxYear: boolean;
  bw: boolean;
  tall: boolean;
  /** width / height */
  aspect: number;
  /** id of the AI-restored version of this frame, if any */
  restored?: FrameId;
  thumb: string;
  full: string;
};

// [id, year, width, height, black-and-white, year approximate]
const rows: [FrameId, number, number, number, boolean?, boolean?][] = [
  ["inauguration", 1966, 1200, 785, true],
  ["rtt-announcer", 1967, 960, 720, true, true],
  ["haj-klouf", 1970, 1020, 720, true],
  ["harbor-original", 1972, 2400, 1600, true, true],
  ["carthage", 1974, 2400, 1594, false, true],
  ["world-cup", 1978, 1584, 1489, true],
  ["oasis", 1982, 2400, 1600, false, true],
  ["hadhra", 1991, 2400, 1630],
  ["khottab-al-bab", 1996, 1060, 720],
  ["mnamet-aroussia", 2000, 1280, 720],
  ["choufli-hal", 2005, 1228, 700],
  ["malouf", 2015, 2400, 1800, false, true],
  ["zanqet-el-bacha", 2019, 1000, 720],
  ["ahla-tounes", 2024, 1020, 1010],
  ["harbor-restored", 2026, 2400, 1600],
];

export const archive: Frame[] = rows.map(([id, year, w, h, bw = false, approxYear = false]) => ({
  id,
  year,
  approxYear,
  bw,
  tall: h > w,
  aspect: w / h,
  thumb: `/archive/thumb/${id}.jpg`,
  full: `/archive/${id}.jpg`,
  restored: id === "harbor-original" ? "harbor-restored" : undefined,
}));

export function frame(id: FrameId): Frame {
  const f = archive.find((a) => a.id === id);
  if (!f) throw new Error(`Unknown frame: ${id}`);
  return f;
}

/** Images outside the sphere, also built by scripts/prepare-images.mjs. */
export const images = {
  family: "/archive/family.jpg",
  phone: "/archive/studio-vertical.jpg",
  logo: "/logo.svg",
};
