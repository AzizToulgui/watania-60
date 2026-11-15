// Builds the archive frames from the source stills in assets/images (see CREDITS.md for where
// each one comes from). Crops away channel logos and letterboxing, then writes a full-size
// still (max 2400 px wide) to public/archive and a 960 px thumbnail to public/archive/thumb.
// Also derives the restoration "before" frame, the vertical Creator Studio clip, the watch-party
// avatars, the logo and the app icons.
// Run: npm run images
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => join(root, "assets", "images", f);
const out = join(root, "public", "archive");
const thumbs = join(out, "thumb");
mkdirSync(thumbs, { recursive: true });

const FULL = 2400;
const THUMB = 960;

// [source, output name, crop in source pixels or null for the full frame]
const jobs = [
  ["inauguration.jpg", "inauguration", { left: 0, top: 0, width: 1200, height: 785 }],
  ["rtt-announcer.jpg", "rtt-announcer", { left: 120, top: 0, width: 960, height: 720 }],
  ["haj-klouf.jpg", "haj-klouf", { left: 40, top: 0, width: 1020, height: 720 }],
  ["kerkennah.jpg", "harbor-restored", null],
  ["carthage.jpg", "carthage", null],
  ["world-cup.jpg", "world-cup", { left: 16, top: 0, width: 1584, height: 1489 }],
  ["chebika.jpg", "oasis", null],
  ["hadhra.jpg", "hadhra", null],
  ["khottab-al-bab.jpg", "khottab-al-bab", { left: 40, top: 0, width: 1060, height: 720 }],
  ["mnamet-aroussia.jpg", "mnamet-aroussia", null],
  ["choufli-hal.jpg", "choufli-hal", { left: 26, top: 6, width: 1228, height: 700 }],
  ["malouf.jpg", "malouf", null],
  ["zanqet-el-bacha.jpg", "zanqet-el-bacha", { left: 100, top: 0, width: 1000, height: 720 }],
  ["ahla-tounes.jpg", "ahla-tounes", { left: 60, top: 0, width: 1020, height: 1010 }],
  ["choufli-hal-salon.jpg", "family", { left: 18, top: 4, width: 1244, height: 704 }],
];

const write = async (img, name) => {
  const buf = await img.png({ compressionLevel: 1 }).toBuffer();
  await sharp(buf)
    .resize({ width: FULL, withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(out, `${name}.jpg`));
  await sharp(buf)
    .resize({ width: THUMB, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(thumbs, `${name}.jpg`));
};

for (const [file, name, crop] of jobs) {
  let img = sharp(src(file)).rotate();
  if (crop) img = img.extract(crop);
  await write(img, name);
}

// Restoration "before": the same harbor, aged the way a worn 1970s film transfer looks
// (no colour, low resolution, lifted blacks, grain), at the same size as the "after".
{
  const after = sharp(join(out, "harbor-restored.jpg"));
  const { width, height } = await after.metadata();
  const soft = await after
    .clone()
    .grayscale()
    .resize({ width: Math.round(width / 4) })
    .resize({ width, height })
    .linear(0.72, 34)
    .blur(1.2)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = soft.data;
  let seed = 7;
  for (let i = 0; i < px.length; i += soft.info.channels) {
    seed = (seed * 16807) % 2147483647;
    const n = ((seed / 2147483647) - 0.5) * 38;
    for (let c = 0; c < soft.info.channels; c++) px[i + c] = Math.max(0, Math.min(255, px[i + c] + n));
  }
  const { width: w, height: h, channels } = soft.info;
  await write(sharp(px, { raw: { width: w, height: h, channels } }), "harbor-original");
}

// Creator Studio: the vertical 9:16 cut of the same Zanqet El Bacha frame.
await sharp(src("zanqet-el-bacha.jpg"))
  .extract({ left: 478, top: 0, width: 405, height: 720 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(out, "studio-vertical.jpg"));

// Watch-party avatars: square face crops of the characters, in the order of together.viewers.
mkdirSync(join(out, "viewers"), { recursive: true });
const viewers = [
  ["choufli-hal-office.jpg", "sbou3i", { left: 370, top: 40, width: 240, height: 240 }],
  ["choufli-hal-office.jpg", "slimane", { left: 40, top: 60, width: 220, height: 220 }],
  ["haj-klouf-radio.jpg", "haj-klouf", { left: 290, top: 50, width: 320, height: 320 }],
  ["kamel-touati.jpg", "bacha", { left: 350, top: 140, width: 400, height: 400 }],
  ["ommi-traki.jpg", "ommi-traki", { left: 240, top: 50, width: 300, height: 300 }],
];
for (const [file, name, crop] of viewers) {
  await sharp(src(file)).extract(crop).resize(192, 192).jpeg({ quality: 86, mozjpeg: true }).toFile(join(out, "viewers", `${name}.jpg`));
}

// Logo: the Watania+ mark (cut from assets/images/watania-plus-brand-sheet.svg), served as SVG,
// plus app icons on the brand background.
copyFileSync(src("watania-plus.svg"), join(root, "public", "logo.svg"));
await sharp(src("watania-plus.svg"), { density: 600 })
  .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(join(root, "app", "icon.png"));
await sharp(src("watania-plus.svg"), { density: 300 })
  .resize(130, 130, { fit: "contain", background: "#131418" })
  .extend({ top: 25, bottom: 25, left: 25, right: 25, background: "#131418" })
  .flatten({ background: "#131418" })
  .png()
  .toFile(join(root, "app", "apple-icon.png"));

console.log(`Prepared ${jobs.length + 1} frames, the studio clip and logo assets.`);
