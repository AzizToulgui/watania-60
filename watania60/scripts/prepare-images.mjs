// Crops the supplied stills in public/images down to the picture itself
// (several are UI mockups with browser chrome, players or TV bezels) and
// writes them to public/archive. Also derives the favicon and a trimmed logo.
// Run: node scripts/prepare-images.mjs
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => join(root, "public", "images", f);
const out = join(root, "public", "archive");
mkdirSync(out, { recursive: true });

// [source, output name, crop in source pixels or null for the full frame]
const jobs = [
  ["hero-first-broadcast-1966.jpg", "first-broadcast", { left: 0, top: 0, width: 512, height: 250 }],
  ["restore-before.jpg", "harbor-original", { left: 110, top: 54, width: 293, height: 156 }],
  ["hero-carthage-1974.jpg", "carthage", { left: 64, top: 14, width: 386, height: 272 }],
  ["hero-world-cup-1978.jpg", "world-cup", { left: 22, top: 14, width: 466, height: 248 }],
  ["archive-tunisia-green.jpg", "oasis", { left: 77, top: 19, width: 355, height: 202 }],
  ["archive-ommi-traki.jpg", "ommi-traki", { left: 176, top: 56, width: 166, height: 122 }],
  ["archive-malouf-night.jpg", "malouf", null],
  ["search-result-douar.jpg", "ramadan-table", { left: 80, top: 22, width: 350, height: 232 }],
  ["studio-preview-wide.jpg", "sitcom", { left: 150, top: 57, width: 212, height: 126 }],
  ["hero-choufli-hal.jpg", "choufli-hal", { left: 100, top: 42, width: 304, height: 172 }],
  ["hero-el-douar.jpg", "el-douar", null],
  ["archive-warda-wa-bab.jpg", "warda-wa-bab", null],
  ["hero-khatem-el-yasmine.jpg", "khatem-el-yasmine", { left: 26, top: 44, width: 460, height: 164 }],
  ["studio-preview-vertical.jpg", "comedy-night", { left: 40, top: 62, width: 206, height: 230 }],
  ["restore-after.jpg", "harbor-restored", null],
  ["share-family.jpg", "family", null],
];

for (const [file, name, crop] of jobs) {
  let img = sharp(src(file));
  if (crop) img = img.extract(crop);
  await img.jpeg({ quality: 90, mozjpeg: true }).toFile(join(out, `${name}.jpg`));
}

// Logo: trimmed for the header/splash, plus app icons.
await sharp(src("logo.png")).trim().png().toFile(join(root, "public", "logo.png"));
await sharp(src("logo.png")).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(root, "app", "icon.png"));
await sharp(src("logo.png"))
  .resize(150, 150, { fit: "contain", background: "#000" })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#000" })
  .flatten({ background: "#000" })
  .png()
  .toFile(join(root, "app", "apple-icon.png"));

console.log(`Prepared ${jobs.length} frames and logo assets.`);
