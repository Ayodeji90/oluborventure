/**
 * Convert site images to WebP for fast mobile loading.
 *
 * - public/images/*.jpg  ->  .webp (quality 80, max width 1920px, metadata stripped)
 * - logo.png / logo-white.png -> .webp (transparency preserved, quality 90)
 *
 * Run with:  node convert-images.mjs
 * Original .jpg/.png files are kept as the master copies; the site references
 * only the .webp files.
 */
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const IMAGES_DIR = join(process.cwd(), "public", "images");
const LOGOS = ["logo.png", "logo-white.png"].map((f) => join(process.cwd(), "public", f));

function bytes(n) {
  return `${(n / 1024).toFixed(0)} KB`;
}

async function convert(src, dest, { quality, maxWidth, pngOut = false }) {
  const originalSize = statSync(src).size;
  let pipeline = sharp(src).rotate(); // respect EXIF orientation
  if (maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  pipeline = pipeline.webp({ quality, effort: 4 });
  const info = await pipeline.toFile(dest);
  console.log(
    `${basename(src)} -> ${basename(dest)}: ${bytes(originalSize)} -> ${bytes(info.size)} (${info.width}x${info.height})`
  );
}

const photos = readdirSync(IMAGES_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
let failures = 0;

for (const photo of photos) {
  const src = join(IMAGES_DIR, photo);
  const dest = join(IMAGES_DIR, photo.replace(/\.(jpe?g|png)$/i, ".webp"));
  try {
    await convert(src, dest, { quality: 80, maxWidth: 1920 });
  } catch (err) {
    failures++;
    console.error(`FAILED ${photo}:`, err.message);
  }
}

for (const logo of LOGOS) {
  const dest = logo.replace(/\.png$/, ".webp");
  try {
    await convert(logo, dest, { quality: 90, maxWidth: 512, pngOut: true });
  } catch (err) {
    failures++;
    console.error(`FAILED ${basename(logo)}:`, err.message);
  }
}

process.exit(failures ? 1 : 0);
