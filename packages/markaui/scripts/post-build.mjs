#!/usr/bin/env node
/**
 * Post-build step: copies the generated theme stylesheet into dist/ and
 * prints the final dist listing.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pkgDir = path.resolve(scriptDir, "..");
const src = path.join(pkgDir, "src", "styles", "theme.css");
const dist = path.join(pkgDir, "dist");
const dest = path.join(dist, "theme.css");

fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(src, dest);

const files = fs.readdirSync(dist).sort();
console.log("── markaui dist ─────────────────────────────────────────");
for (const f of files) {
  const stat = fs.statSync(path.join(dist, f));
  const kb = (stat.size / 1024).toFixed(1).padStart(9);
  console.log(`${kb} kB  ${f}`);
}
console.log(`theme.css copied → dist/theme.css (${fs.statSync(dest).size} bytes)`);
