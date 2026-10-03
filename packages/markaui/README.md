<div align="center">

# MarkaUI

[![npm version](https://img.shields.io/npm/v/markaui.svg)](https://www.npmjs.com/package/markaui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Types: TypeScript](https://img.shields.io/badge/Types-Included-3178C6.svg)](https://www.typescriptlang.org/)
[![React 18+](https://img.shields.io/badge/React-18%2B-61DAFB.svg)](https://react.dev/)

**A premium, themeable React component library. 339+ accessible components, 12 luxury themes × light & dark. TypeScript-first. Works in Next.js, Vite and plain React.**

</div>

MarkaUI is a complete design system for building polished, high-end product interfaces. Every component is built on accessible Radix primitives, styled with Tailwind CSS v4 utility classes and CSS custom-property design tokens, and themed by a single provider that swaps 12 curated luxury color palettes — each with a full light and dark variant — at runtime.

## Features

- **339+ components** — buttons, forms, dialogs, data tables, charts, calendars, command palettes, dashboards and more
- **12 themes × light & dark** — Maroon & Gold, Rose Gold, Royal Purple, Emerald & Brass, Noir & Silver… switch at runtime with one attribute
- **Accessible by default** — built on Radix UI primitives with keyboard navigation, focus management and ARIA semantics
- **TypeScript-first** — complete `.d.ts` types ship in the box; JavaScript projects work too (types are optional)
- **ESM + CJS** — dual-format build with tree-shaking friendly exports and source maps
- **Tailwind CSS v4** — theme tokens are plain CSS custom properties mapped through `@theme inline`; no config file needed
- **Framework agnostic** — Next.js (App Router), Vite, Remix, or plain React from a CDN bundle; the only peers are `react` and `react-dom`

## Install

```bash
npm install markaui
```

```bash
bun add markaui
# or
pnpm add markaui
# or
yarn add markaui
```

## Tailwind setup (v4)

MarkaUI components use Tailwind v4 utility classes plus the design tokens in `markaui/theme.css`. In your global stylesheet:

```css
@import "tailwindcss";
@import "markaui/theme.css";
/* optional but recommended — powers enter/exit animation utilities (animate-in, fade-in, zoom-in…) */
@import "tw-animate-css";
```

> `tw-animate-css` ships as a dependency of `markaui`; importing it enables the animation utilities used by Dialogs, Dropdowns, Selects, Popovers, Sheets and other overlay components.

## Next.js (App Router)

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
import { MarkaUIProvider } from "markaui";
import "./globals.css"; // contains the Tailwind + theme.css imports from the previous step

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MarkaUIProvider defaultTheme="maroon" defaultMode="light">
          {children}
        </MarkaUIProvider>
      </body>
    </html>
  );
}
```

`MarkaUIProvider` carries its own `"use client"` directive, so you can use it directly in a server layout. The provider applies `data-theme="…"` and the `dark` class to `<html>`, and persists the selection to `localStorage` (`markaui-theme` / `markaui-mode`).

To avoid a flash of the wrong theme on reload, add a tiny inline script to `<head>` that reads the two storage keys and sets the attributes before paint.

## Vite (or any SPA)

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { MarkaUIProvider, Button } from "markaui";
import "markaui/theme.css"; // if your global CSS doesn't already import it
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MarkaUIProvider>
      <App />
    </MarkaUIProvider>
  </React.StrictMode>
);
```

## JavaScript (no TypeScript)

Types ship with the package, but they're entirely optional — use it from plain `.jsx`:

```jsx
// app.jsx
import { MarkaUIProvider, Button, Card, useMarkaUI } from "markaui";

export function App() {
  return (
    <MarkaUIProvider defaultTheme="emerald">
      <Card>
        <Button variant="gold" onClick={() => alert("Welcome!")}>
          Get started
        </Button>
      </Card>
    </MarkaUIProvider>
  );
}
```

## Theming

Wrap your app once with `<MarkaUIProvider>` and switch themes at runtime:

| id          | name               | group     |
| ----------- | ------------------ | --------- |
| `maroon`    | Maroon & Gold      | Signature |
| `wine`      | Burgundy & Honey   | Signature |
| `rose`      | Rose Gold          | Signature |
| `royal`     | Royal Purple       | Signature |
| `emerald`   | Emerald & Brass    | Heritage  |
| `forest`    | Forest & Sage      | Heritage  |
| `teal`      | Teal & Copper      | Heritage  |
| `champagne` | Champagne Bronze   | Heritage  |
| `cocoa`     | Cocoa & Caramel    | Heritage  |
| `coral`     | Coral Terracotta   | Modern    |
| `plum`      | Plum & Mauve       | Modern    |
| `noir`      | Noir & Silver      | Modern    |

The provider sets `data-theme="<id>"` on `<html>` for the palette and toggles the `dark` class for color mode. You can also drive them yourself — no provider required:

```html
<html data-theme="royal" class="dark">
```

### useMarkaUI hook

```tsx
"use client";
import { useMarkaUI, Button } from "markaui";

export function ThemePicker() {
  const { theme, setTheme, mode, toggleMode, themes } = useMarkaUI();

  return (
    <div>
      {themes.map((t) => (
        <Button key={t.id} variant={t.id === theme ? "default" : "ghost"} onClick={() => setTheme(t.id)}>
          {t.name}
        </Button>
      ))}
      <Button onClick={toggleMode}>{mode === "dark" ? "☀️ Light" : "🌙 Dark"}</Button>
    </div>
  );
}
```

## Usage

```tsx
import { Button, Card, Dialog } from "markaui";

export function Example() {
  return (
    <Button variant="outline" size="lg">
      Press me
    </Button>
  );
}
```

### Per-component imports & tree-shaking

```tsx
import { Button } from "markaui";
import { Dialog, DialogContent, DialogTrigger } from "markaui";
```

The package is a tree-shakeable ESM bundle: named imports pull only the components you use into your final bundle. Deep-path imports (e.g. `markaui/dist/…`) are not part of the public API — always import from the package root. Two components (`Link`, `Media`) depend on Next.js `next/link` / `next/image` and are therefore not re-exported from the root barrel; copy them from the source app if you need Next-optimized routing/images.

## License

[MIT](./LICENSE) — Copyright (c) 2025 MarkaUI
