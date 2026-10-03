#!/usr/bin/env node
/**
 * markaui sync script — generates the publishable package from the app source.
 *
 * Single source of truth stays the Next.js app (`<repo>/src`). Running this
 * script copies the closure of `src/components/ui/**` into
 * `packages/markaui/src`, rewrites `@/` imports to relative paths, extracts
 * the theme-token CSS from `src/app/globals.css`, fills package.json
 * `dependencies` from the copied sources' external imports, and generates the
 * component barrel (`src/exports.components.ts`).
 *
 * Zero npm dependencies. Run from anywhere: `node scripts/sync.mjs`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pkgDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(pkgDir, "..", "..");
const appSrc = path.join(repoRoot, "src");
const pkgSrc = path.join(pkgDir, "src");

const EXTENSIONS = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];
const COPY_EXT = new Set([".ts", ".tsx"]);

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

/** Resolve an `@/x` specifier to an app-source file, or null. */
function resolveAppImport(spec) {
  const base = path.join(appSrc, spec);
  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    if (
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile() &&
      COPY_EXT.has(path.extname(candidate))
    ) {
      return candidate;
    }
  }
  return null;
}

/** Collect module specifiers from all import/export forms in a TS/TSX file. */
function collectSpecifiers(source) {
  const specs = [];
  const push = (m) => m && specs.push(m[1]);
  // import x from "@/y"  /  import { x } from "z"  /  export * from "z"  /  export { x } from "z"
  // (specifiers never span lines — guards against prose/strings like `"…-from"`)
  const fromRe = /\bfrom\s*["']([^"'\n\r]+)["']/g;
  let m;
  while ((m = fromRe.exec(source))) push(m);
  // side-effect: import "@/y"
  const sideRe = /\bimport\s*["']([^"'\n\r]+)["']/g;
  while ((m = sideRe.exec(source))) push(m);
  // dynamic: import("@/y")
  const dynRe = /\bimport\(\s*["']([^"'\n\r]+)["']\s*\)/g;
  while ((m = dynRe.exec(source))) push(m);
  return specs;
}

function classify(spec) {
  if (spec.startsWith(".") || spec.startsWith("/")) return "relative";
  if (spec.startsWith("@/")) return "alias";
  if (spec === "react" || spec === "react-dom" || spec === "react/jsx-runtime") return "react";
  if (/^next(\/|$)/.test(spec)) return "next";
  if (spec.startsWith("node:")) return "node";
  return "external";
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

/* ------------------------------------------------------------------ */
/* step a — copy closure of library sources                            */
/* ------------------------------------------------------------------ */

function syncSources() {
  // managed subtrees — wiped so the package never keeps stale app files
  for (const sub of ["components", "lib", "hooks", "styles"]) {
    fs.rmSync(path.join(pkgSrc, sub), { recursive: true, force: true });
  }
  const generatedBarrel = path.join(pkgSrc, "exports.components.ts");
  fs.rmSync(generatedBarrel, { force: true });

  const seeds = walkFiles(path.join(appSrc, "components", "ui")).filter((f) =>
    COPY_EXT.has(path.extname(f))
  );

  const queue = seeds.map((f) => path.relative(appSrc, f));
  const seen = new Set(queue);
  const copied = []; // app-relative posix paths, in copy order
  const unresolvable = []; // { from, spec }
  const nextDependent = []; // app-relative posix paths importing next/*
  const externals = new Set();

  while (queue.length) {
    const appRel = queue.shift(); // e.g. "components/ui/button.tsx"
    const absApp = path.join(appSrc, appRel);
    const source = fs.readFileSync(absApp, "utf8");

    // classify specifiers first (report pass, on original text)
    for (const spec of collectSpecifiers(source)) {
      const kind = classify(spec);
      if (kind === "external") externals.add(spec);
    }
    if (collectSpecifiers(source).some((s) => /^next(\/|$)/.test(s))) {
      nextDependent.push(toPosix(appRel));
    }

    // rewrite `@/x` specifiers to relative package paths
    let out = source;
    const rewrites = [];
    for (const spec of collectSpecifiers(source)) {
      if (classify(spec) !== "alias") continue;
      const appPath = resolveAppImport(spec.slice(2));
      if (!appPath) {
        unresolvable.push({ from: toPosix(appRel), spec });
        continue; // leave `@/` as-is — build will surface it
      }
      const targetRel = path.relative(appSrc, appPath); // package mirrors app paths
      if (!seen.has(targetRel)) {
        seen.add(targetRel);
        queue.push(targetRel);
      }
      rewrites.push({ spec, targetRel });
    }

    for (const { spec, targetRel } of rewrites) {
      const importerPkgFile = path.join(pkgSrc, appRel);
      const targetPkgFile = path.join(pkgSrc, targetRel);
      let rel = toPosix(path.relative(path.dirname(importerPkgFile), targetPkgFile));
      // extensionless (bundler resolution), mirroring the app's `@/x` style
      rel = rel.replace(/\.(ts|tsx)$/, "");
      if (!rel.startsWith(".")) rel = "./" + rel;
      // escape regex specials in the spec, match any quote style
      const escaped = spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`(["'])${escaped}\\1`, "g"), `"${rel}"`);
    }

    const outAbs = path.join(pkgSrc, appRel);
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    fs.writeFileSync(outAbs, out);
    copied.push(toPosix(appRel));
  }

  return { copied, unresolvable, nextDependent, externals };
}

/* ------------------------------------------------------------------ */
/* step b — extract theme CSS from app globals.css                     */
/* ------------------------------------------------------------------ */

/**
 * Walk `css` top-level, yielding chunks. A chunk is either a block
 * (selector + { ... }) or a statement (ends with `;`). Comments are skipped
 * so braces/semicolons inside them never confuse the parser; comments are
 * preserved verbatim in the emitted output.
 */
function walkTopLevel(css) {
  const chunks = [];
  let i = 0;
  const n = css.length;

  const skipComment = (idx) => {
    const end = css.indexOf("*/", idx + 2);
    return end === -1 ? n : end + 2;
  };

  let bufStart = 0;
  let buf = "";
  const flushStatement = (endIdx) => {
    const text = css.slice(bufStart, endIdx + 1);
    const sel = text.replace(/\/\*[\s\S]*?\*\//g, " ");
    chunks.push({ type: "statement", text, sel: sel.replace(/\s+/g, " ").trim() });
    bufStart = endIdx + 1;
    buf = "";
  };
  const flushBlock = (selEndIdx, bodyEndIdx) => {
    const text = css.slice(bufStart, bodyEndIdx + 1);
    const selRaw = css.slice(bufStart, selEndIdx);
    const sel = selRaw.replace(/\/\*[\s\S]*?\*\//g, " ");
    chunks.push({ type: "block", text, sel: sel.replace(/\s+/g, " ").trim() });
    bufStart = bodyEndIdx + 1;
    buf = "";
  };

  while (i < n) {
    if (css.startsWith("/*", i)) {
      i = skipComment(i);
      continue;
    }
    const ch = css[i];
    if (ch === ";" && buf === "") {
      // empty statement (stray semicolon) — skip
      bufStart = i + 1;
      i++;
      continue;
    }
    if (ch === "{") {
      const selEnd = i;
      // consume the body with brace matching (comments skipped)
      let depth = 1;
      let j = i + 1;
      while (j < n && depth > 0) {
        if (css.startsWith("/*", j)) {
          j = skipComment(j);
          continue;
        }
        const c = css[j];
        if (c === "{") depth++;
        else if (c === "}") depth--;
        j++;
      }
      flushBlock(selEnd, Math.min(j, n) - 1);
      i = bufStart;
      continue;
    }
    if (ch === ";") {
      flushStatement(i);
      i = bufStart;
      continue;
    }
    if (ch === "}") {
      // stray close brace at top level — skip
      bufStart = i + 1;
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  return chunks;
}

const DARK_PART = /^\.dark$/;
const DARK_THEMED_PART = /^\[data-theme=["'][^"']+["']\]\.dark$/;
const LIGHT_THEMED_PART = /^\[data-theme=["'][^"']+["']\]$/;

function selectorParts(sel) {
  // split on commas that are not inside () or [] (none in this file, but safe)
  return sel.split(",").map((s) => s.trim()).filter(Boolean);
}

function syncThemeCss() {
  const globalsPath = path.join(appSrc, "app", "globals.css");
  const css = fs.readFileSync(globalsPath, "utf8");
  const chunks = walkTopLevel(css);

  const kept = [];
  for (const chunk of chunks) {
    const sel = chunk.sel;
    let keep = false;
    if (sel.startsWith("@custom-variant")) keep = true;
    else if (sel.startsWith("@theme inline")) keep = true;
    else if (sel.startsWith(":root")) keep = true;
    else if (sel.startsWith("@layer base")) keep = true;
    else if (chunk.type === "block") {
      const parts = selectorParts(sel);
      if (parts.length && parts.every((p) => DARK_PART.test(p) || DARK_THEMED_PART.test(p))) keep = true;
      else if (parts.length && parts.every((p) => LIGHT_THEMED_PART.test(p))) keep = true;
    }
    if (keep) kept.push(chunk.text.trim());
  }

  let out = `/* MarkaUI theme tokens — generated from the design system. Do not edit. */\n\n${kept.join(
    "\n\n"
  )}\n`;

  // add font fallbacks — ONLY inside the `@theme inline` block
  const start = out.indexOf("@theme inline");
  if (start !== -1) {
    const openBrace = out.indexOf("{", start);
    let depth = 1;
    let j = openBrace + 1;
    while (j < out.length && depth > 0) {
      if (out[j] === "{") depth++;
      else if (out[j] === "}") depth--;
      j++;
    }
    const bodyStart = openBrace + 1;
    const bodyEnd = j - 1;
    const body = out.slice(bodyStart, bodyEnd)
      .replace("var(--font-geist-sans)", 'var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)')
      .replace("var(--font-playfair)", 'var(--font-playfair, Georgia, "Times New Roman", serif)')
      .replace("var(--font-geist-mono)", 'var(--font-geist-mono, ui-monospace, SFMono-Regular, Menlo, monospace)');
    out = out.slice(0, bodyStart) + body + out.slice(bodyEnd);
  }

  const outPath = path.join(pkgSrc, "styles", "theme.css");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out);
  return { bytes: Buffer.byteLength(out), blocks: kept.length };
}

/* ------------------------------------------------------------------ */
/* step c — merge external dependencies into package.json              */
/* ------------------------------------------------------------------ */

function syncDependencies(externals) {
  const appPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  const pkgPath = path.join(pkgDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  pkg.dependencies = pkg.dependencies || {};
  let added = 0;
  const missing = [];
  for (const name of [...externals].sort()) {
    const version = appPkg.dependencies?.[name];
    if (!version) {
      missing.push(name);
      continue;
    }
    if (pkg.dependencies[name] !== version) {
      pkg.dependencies[name] = version;
      added++;
    }
  }
  // keep deps sorted for readable diffs
  const sorted = {};
  for (const k of Object.keys(pkg.dependencies).sort()) sorted[k] = pkg.dependencies[k];
  pkg.dependencies = sorted;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  return { added, missing, total: Object.keys(sorted).length };
}

/* ------------------------------------------------------------------ */
/* step d — generate the component barrel                              */
/* ------------------------------------------------------------------ */

/** Extract exported names from a TS/TSX source (lightweight, heuristic). */
function scanExportedNames(source) {
  const code = source.replace(/\/\*[\s\S]*?\*\//g, ""); // strip block comments
  const names = new Set();
  const typeOnly = new Set();
  let m;

  // export { A, B as C, type D } [from "..."]  — brace-matched (may be multi-line)
  const exportBlock = /\bexport\s*\{/g;
  while ((m = exportBlock.exec(code))) {
    let depth = 1;
    let j = m.index + m[0].length;
    while (j < code.length && depth > 0) {
      const c = code[j];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      j++;
    }
    const inner = code.slice(m.index + m[0].length, j - 1);
    for (let part of inner.split(",")) {
      part = part.trim();
      if (!part) continue;
      const isTypePart = /^type\s/.test(part);
      part = part.replace(/^type\s+/, "");
      const asMatch = part.match(/\bas\s+([A-Za-z_$][\w$]*)\s*$/);
      const name = asMatch ? asMatch[1] : part.split(/\s/)[0];
      if (name === "default") continue;
      if (/^[A-Za-z_$][\w$]*$/.test(name)) {
        names.add(name);
        if (isTypePart) typeOnly.add(name);
      }
    }
  }

  // export interface X / export type X / export enum X — type-space
  const typeRe = /\bexport\s+(?:declare\s+)?(?:interface|type|enum)\s+([A-Za-z_$][\w$]*)/g;
  while ((m = typeRe.exec(code))) {
    names.add(m[1]);
    typeOnly.add(m[1]);
  }

  // export const/let/var/function/class X — values
  const valueRe = /\bexport\s+(?:declare\s+)?(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/g;
  while ((m = valueRe.exec(code))) names.add(m[1]);

  return { names: [...names], typeOnly };
}

function syncBarrel(nextDependent) {
  const uiDir = path.join(pkgSrc, "components", "ui");
  const files = walkFiles(uiDir)
    .filter((f) => COPY_EXT.has(path.extname(f)))
    .map((f) => toPosix(path.relative(pkgSrc, f))) // "components/ui/button.tsx"
    .sort();

  const nextSet = new Set(nextDependent);
  const normal = [];
  const excluded = [];
  for (const rel of files) {
    const appRel = rel; // package mirrors app paths
    const withoutExt = "./" + rel.replace(/\.tsx?$/, "");
    if (nextSet.has(appRel)) excluded.push(withoutExt);
    else normal.push(withoutExt);
  }

  // detect export-name conflicts across `export *` lines and resolve them with
  // explicit re-exports (required for valid declaration emit — TS2308).
  // Winner: a value export beats a type-only export; otherwise the
  // alphabetically-first module wins (deterministic).
  const owner = new Map(); // name -> { file, typeOnly }
  const resolutions = new Map(); // name -> { file, typeOnly }
  for (const rel of files) {
    const { names, typeOnly } = scanExportedNames(fs.readFileSync(path.join(pkgSrc, rel), "utf8"));
    for (const name of names) {
      const curType = typeOnly.has(name);
      if (!owner.has(name)) {
        owner.set(name, { file: rel, typeOnly: curType });
        continue;
      }
      const prev = owner.get(name);
      let winner = prev;
      if (prev.typeOnly && !curType) {
        winner = { file: rel, typeOnly: curType };
        owner.set(name, winner);
      }
      resolutions.set(name, { file: winner.file, typeOnly: winner.typeOnly });
    }
  }

  const lines = [
    "/* eslint-disable */",
    "/**",
    " * Auto-generated by scripts/sync.mjs — do not edit.",
    " *",
    ` * Barrel of all MarkaUI components (${normal.length} exported).`,
    " */",
    "",
    ...normal.map((p) => `export * from "${p}";`),
  ];

  if (resolutions.size) {
    lines.push(
      "",
      "/*",
      " * Export-name conflicts (the same name exported by several components).",
      " * Resolved with explicit re-exports — a value export wins over a",
      " * type-only export, otherwise the alphabetically-first module wins.",
      " * The losing module's other exports are unaffected.",
      " */",
      ...[...resolutions.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, r]) =>
          r.typeOnly
            ? `export type { ${name} } from "./${r.file.replace(/\.tsx?$/, "")}";`
            : `export { ${name} } from "./${r.file.replace(/\.tsx?$/, "")}";`
        ),
      ""
    );
  }

  if (excluded.length) {
    lines.push(
      "",
      "/*",
      " * The following components depend on Next.js (`next/link` / `next/image`)",
      " * and are excluded from the default barrel so the package stays",
      " * framework-agnostic. Copy them from the source app if you need them,",
      " * or import them via a framework-specific entry in a Next.js project.",
      " */",
      ...excluded.map((p) => `// export * from "${p}";`),
      ""
    );
  }
  const outPath = path.join(pkgSrc, "exports.components.ts");
  fs.writeFileSync(outPath, lines.join("\n") + "\n");
  return { exported: normal.length, excluded: excluded.length, conflicts: [...resolutions.keys()].sort() };
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

const t0 = Date.now();
const { copied, unresolvable, nextDependent, externals } = syncSources();
const theme = syncThemeCss();
const deps = syncDependencies(externals);
const barrel = syncBarrel(nextDependent);

console.log("── markaui sync ─────────────────────────────────────────");
console.log(`files copied:            ${copied.length}`);
console.log(`  components (ui/**):    ${copied.filter((p) => p.startsWith("components/")).length}`);
console.log(`  lib/hooks helpers:     ${copied.filter((p) => !p.startsWith("components/")).length}`);
console.log(`theme.css:               ${theme.bytes} bytes (${theme.blocks} top-level blocks kept)`);
console.log(`package dependencies:    ${deps.total} (${deps.added} newly added)`);
console.log(`barrel exports:          ${barrel.exported} components`);
console.log(`excluded (next/*):       ${barrel.excluded}${nextDependent.length ? " → " + nextDependent.join(", ") : ""}`);
if (barrel.conflicts.length) {
  console.log(`name conflicts resolved: ${barrel.conflicts.length} → ${barrel.conflicts.join(", ")}`);
}

if (deps.missing.length) {
  console.warn(`⚠ dependencies not found in app package.json (skipped): ${deps.missing.join(", ")}`);
}
if (unresolvable.length) {
  console.warn(`⚠ unresolvable @/ imports (left as-is — build will surface them):`);
  for (const u of unresolvable) console.warn(`   ${u.from}: "${u.spec}"`);
}
console.log(`done in ${Date.now() - t0}ms`);
