#!/usr/bin/env node
/**
 * Post-build step: copies the generated theme stylesheet into dist/ (with a
 * Tailwind v4 `@source` directive so consumers' Tailwind builds auto-detect
 * the component bundle's class names) and prints the final dist listing.
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

// Tailwind v4's automatic content detection ignores node_modules, so a
// consumer importing "markaui/theme.css" would get the design tokens but NO
// utility classes for our components (bg-primary, rounded-md, ...) — the
// components render unstyled. The @source directive below is resolved by
// Tailwind relative to THIS file (dist/theme.css), registering the JS bundle
// as a content source in the consumer's build. Consumers need zero config.
// Plain-CSS consumers (no Tailwind) simply ignore the unknown at-rule.
const sourceDirective = `/* markaui: register the component bundle as a Tailwind v4 content source
   (resolved relative to this file — no consumer setup needed). */
@source "./index.js";

`;
fs.writeFileSync(dest, sourceDirective + fs.readFileSync(dest, "utf8"));

const files = fs.readdirSync(dist).sort();
console.log("── markaui dist ─────────────────────────────────────────");
for (const f of files) {
  const stat = fs.statSync(path.join(dist, f));
  const kb = (stat.size / 1024).toFixed(1).padStart(9);
  console.log(`${kb} kB  ${f}`);
}
console.log(`theme.css copied → dist/theme.css (${fs.statSync(dest).size} bytes)`);
