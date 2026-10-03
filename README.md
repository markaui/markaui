<div align="center">

<!-- <img src="https://plain-apac-prod-public.komododecks.com/202610/03/ggflYIhrioIV1zBG4cnr/image.png" alt="MarkaUI" width="96" /> -->
<img src="https://markaui.vercel.app/markaui.png" alt="MarkaUI" width="96" />

# MarkaUI

[![npm version](https://img.shields.io/npm/v/markaui.svg)](https://www.npmjs.com/package/markaui)
[![npm downloads](https://img.shields.io/npm/dm/markaui.svg)](https://www.npmjs.com/package/markaui)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![React 18+](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8.svg)](https://tailwindcss.com/)

**A premium, themeable React component library — 339+ accessible components, 12 luxury themes × light & dark.**

[📦 npm](https://www.npmjs.com/package/markaui) · [📚 Components](src/components/ui) · [🎓 Demo](src/app/demo) · [🐛 Report a bug](https://github.com/markaui/markaui/issues)

</div>

---

MarkaUI is a complete design system for building polished, high-end product interfaces. Every component is built on accessible [Radix UI](https://www.radix-ui.com/) primitives, styled with Tailwind CSS v4 utilities and CSS custom-property design tokens, and themed by a single provider that swaps 12 curated luxury palettes — each with full light **and** dark variants — at runtime.

This repository is the MarkaUI monorepo: it contains the component library that ships to npm, the documentation site that showcases every component, and a full production demo.

## Why MarkaUI?

| | MarkaUI |
|---|---|
| 🧩 **339+ components** | Buttons, forms, dialogs, data tables, charts, calendars, command palettes, dashboards and more — documented in 58 families |
| 🎨 **12 luxury themes** | Maroon & Gold, Rose Gold, Royal Purple, Emerald & Brass, Noir & Silver… switch at runtime with one attribute |
| 🌗 **Light & dark, everywhere** | Every theme ships both modes — no per-theme dark stylesheet to maintain |
| ♿ **Accessible by default** | Radix primitives, keyboard navigation, focus management, ARIA semantics |
| 🧵 **TypeScript-first** | Complete `.d.ts` types in the box — JavaScript projects work too (types optional) |
| 📦 **ESM + CJS** | Dual-format build, tree-shakeable, source maps included |
| 🚀 **Framework agnostic** | Next.js (App Router), Vite, Remix or plain React — the only peers are `react` and `react-dom` |
| 🧪 **Tailwind v4 native** | Tokens are plain CSS custom properties mapped through `@theme inline` — no config file needed |

## Quick start

```bash
npm install markaui
```

Import the theme in your global stylesheet — as of v1.0.1 `markaui/theme.css` auto-registers the component bundle with your Tailwind build, so this is the whole setup:

```css
@import "tailwindcss";
@import "markaui/theme.css";
/* optional — powers enter/exit animation utilities used by overlays */
@import "tw-animate-css";
```

Wrap your app with the provider and use any component:

```tsx
import { MarkaUIProvider, Button } from "markaui";

export default function App() {
  return (
    <MarkaUIProvider defaultTheme="maroon" defaultMode="light">
      <Button variant="gold">Get started</Button>
    </MarkaUIProvider>
  );
}
```

`MarkaUIProvider` carries its own `"use client"` directive, so it works directly inside a Next.js server layout.

➡️ **Full setup guides** (Next.js · Vite · plain JavaScript · theming API) live in [`packages/markaui/README.md`](./packages/markaui/README.md).

## Themes

Wrap once with `<MarkaUIProvider>` and switch palettes at runtime — the provider sets `data-theme="<id>"` on `<html>` and toggles the `dark` class:

| id | Theme | Group |
|---|---|---|
| `maroon` | Maroon & Gold | Signature |
| `wine` | Burgundy & Honey | Signature |
| `rose` | Rose Gold | Signature |
| `royal` | Royal Purple | Signature |
| `emerald` | Emerald & Brass | Heritage |
| `forest` | Forest & Sage | Heritage |
| `teal` | Teal & Copper | Heritage |
| `champagne` | Champagne Bronze | Heritage |
| `cocoa` | Cocoa & Caramel | Heritage |
| `coral` | Coral Terracotta | Modern |
| `plum` | Plum & Mauve | Modern |
| `noir` | Noir & Silver | Modern |

Drive it yourself — no provider required:

```html
<html data-theme="royal" class="dark">
```

Or programmatically with the `useMarkaUI()` hook (`theme`, `setTheme`, `mode`, `toggleMode`, `themes`).

## Repository structure

```
markaui/
├── src/                        # documentation site (Next.js 16, App Router)
│   ├── app/                    # routes: / (landing) · /components (docs) · /demo/matrimuni (demo)
│   ├── components/ui/          # the 339 components — source of truth for the library
│   ├── components/showcase/    # docs shell: preview, code tabs, theme switcher
│   ├── components/site/        # landing page sections
│   ├── components/matrimonial/ # production demo app
│   └── lib/                    # registry, theme definitions, utilities
├── packages/markaui/           # the npm package
│   ├── scripts/sync.mjs        # generates src/ from the app (single source of truth)
│   ├── src/                    # generated library source + MarkaUIProvider
│   └── dist/                   # built ESM + CJS + types + theme.css
├── prisma/                     # database schema (demo app)
└── public/                     # static assets
```

The library is **generated from the docs site** — `packages/markaui/scripts/sync.mjs` copies components from `src/components/ui`, rewrites `@/` imports to relative paths, extracts all 12 theme token blocks from `globals.css`, and auto-generates the barrel export. The app source stays the single source of truth; the published package is always a faithful snapshot of the docs site.

## Local development

Requires [Node.js 20+](https://nodejs.org/) (or [Bun](https://bun.sh/)).

```bash
git clone https://github.com/markaui/markaui.git
cd markaui
bun install        # or: npm install

bun run dev        # docs site + landing + demo → http://localhost:3000
```

Work with the package:

```bash
cd packages/markaui
bun run sync       # regenerate library source from the app
bun run build      # tsup → dist/ (esm + cjs + dts + theme.css)
```

## Publishing

The npm package is versioned and published from `packages/markaui`:

```bash
cd packages/markaui
npm version patch|minor|major
npm publish
```

## Contributing

Contributions are welcome! If you're adding or changing a component:

1. Edit the component in `src/components/ui/` — the app is the source of truth
2. Verify it renders in the docs shell (`bun run dev` → `/components`)
3. Run `cd packages/markaui && bun run sync && bun run build` and make sure the package builds
4. Open a pull request

## License

[MIT](./LICENSE) © 2025 MarkaUI
