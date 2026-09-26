// Crops the originals in photos/originals to consistent ratios and writes
// responsive WebP files to public/photos. Run with `npm run images`.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "photos/originals";
const OUT = "public/photos";
const WIDTHS = [720];

// crop: region of the original (px) to keep, chosen so the subject stays whole.
const photos = [
  // 1500x2000 -> 4:5, trims a little sky, keeps the full figure on the bridge.
  { src: "bridge.jpg", name: "bridge", crop: { left: 0, top: 125, width: 1500, height: 1875 } },
  // 1500x2000, already 3:4.
  { src: "waterfall.jpg", name: "waterfall", crop: { left: 0, top: 0, width: 1500, height: 2000 } },
  // 1125x1500, already 3:4.
  { src: "buddha-snow.jpg", name: "buddha-snow", crop: { left: 0, top: 0, width: 1125, height: 1500 } },
  // 720x1600 phone frame -> 3:4 around the hat tip, drops empty wall and table.
  { src: "hat-tip-bw.jpg", name: "hat-tip", crop: { left: 0, top: 200, width: 720, height: 960 } },
];

await mkdir(OUT, { recursive: true });

for (const p of photos) {
  for (const w of WIDTHS) {
    if (w >= p.crop.width) continue;
    await sharp(`${SRC}/${p.src}`)
      .rotate()
      .extract(p.crop)
      .resize({ width: w })
      .webp({ quality: 80 })
      .toFile(`${OUT}/${p.name}-${w}.webp`);
  }
  // Largest size the crop allows, for sharp display on big screens.
  await sharp(`${SRC}/${p.src}`)
    .rotate()
    .extract(p.crop)
    .resize({ width: Math.min(1600, p.crop.width) })
    .webp({ quality: 80 })
    .toFile(`${OUT}/${p.name}-full.webp`);
  console.log("processed", p.name);
}

// Social share card (1200x630) framed on the face and hat from the bridge shot.
await sharp(`${SRC}/bridge.jpg`)
  .resize({ width: 1200 })
  .extract({ left: 0, top: 880, width: 1200, height: 630 })
  .jpeg({ quality: 82 })
  .toFile("public/og.jpg");
console.log("processed og.jpg");
