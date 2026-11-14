// Archive frames shown in the sphere, grid and lightbox. Images are prepared by
// scripts/prepare-images.mjs from public/images. Titles, genres and notes are
// translated in messages/*.ts under `archive`.
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
  ["first-broadcast", 1966, 512, 250, true],
  ["harbor-original", 1968, 293, 156, true],
  ["carthage", 1974, 386, 272],
  ["malouf", 1976, 512, 279, false, true],
  ["world-cup", 1978, 466, 248],
  ["oasis", 1980, 355, 202],
  ["ommi-traki", 1984, 166, 122, true, true],
  ["sitcom", 1995, 212, 126, false, true],
  ["ramadan-table", 1999, 350, 232, false, true],
  ["choufli-hal", 2005, 304, 172],
  ["warda-wa-bab", 2010, 512, 279, false, true],
  ["el-douar", 2014, 512, 279, false, true],
  ["khatem-el-yasmine", 2020, 460, 164, false, true],
  ["comedy-night", 2024, 206, 230, false, true],
  ["harbor-restored", 2026, 512, 286],
];

export const archive: Frame[] = rows.map(([id, year, w, h, bw = false, approxYear = false]) => ({
  id,
  year,
  approxYear,
  bw,
  tall: h > w,
  aspect: w / h,
  thumb: `/archive/${id}.jpg`,
  full: `/archive/${id}.jpg`,
  restored: id === "harbor-original" ? "harbor-restored" : undefined,
}));

export function frame(id: FrameId): Frame {
  const f = archive.find((a) => a.id === id);
  if (!f) throw new Error(`Unknown frame: ${id}`);
  return f;
}

/** Images outside the sphere, also from public/images. */
export const images = {
  family: "/archive/family.jpg",
  phone: "/images/studio-preview-vertical.jpg",
  logo: "/logo.png",
};
