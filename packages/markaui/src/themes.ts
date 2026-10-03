/**
 * MarkaUI theme registry — 12 luxury themes × light & dark modes.
 */

export type ThemeMode = "light" | "dark";

export interface ThemeDef {
  id: string;
  name: string;
  group: string;
  /** [primary, gold] swatch preview colors */
  swatch: [string, string];
}

/** All available color themes — shown in the theme selector */
export const THEMES: ThemeDef[] = [
  { id: "maroon", name: "Maroon & Gold", group: "Signature", swatch: ["#7d1f2e", "#c9a227"] },
  { id: "wine", name: "Burgundy & Honey", group: "Signature", swatch: ["#7b2340", "#d8a25e"] },
  { id: "rose", name: "Rose Gold", group: "Signature", swatch: ["#a34464", "#b76e79"] },
  { id: "royal", name: "Royal Purple", group: "Signature", swatch: ["#5b2d86", "#c9a227"] },
  { id: "emerald", name: "Emerald & Brass", group: "Heritage", swatch: ["#166a48", "#b08d3e"] },
  { id: "forest", name: "Forest & Sage", group: "Heritage", swatch: ["#2f5d3a", "#a3b18a"] },
  { id: "teal", name: "Teal & Copper", group: "Heritage", swatch: ["#0f6a70", "#c17a4a"] },
  { id: "champagne", name: "Champagne Bronze", group: "Heritage", swatch: ["#a67c52", "#cfae6e"] },
  { id: "cocoa", name: "Cocoa & Caramel", group: "Heritage", swatch: ["#6b4226", "#d09a4e"] },
  { id: "coral", name: "Coral Terracotta", group: "Modern", swatch: ["#c2543b", "#d98e5f"] },
  { id: "plum", name: "Plum & Mauve", group: "Modern", swatch: ["#6d3087", "#c98bb9"] },
  { id: "noir", name: "Noir & Silver", group: "Modern", swatch: ["#2b2b2b", "#8a8578"] },
];

export const THEME_STORAGE_KEY = "markaui-theme";
export const MODE_STORAGE_KEY = "markaui-mode";
