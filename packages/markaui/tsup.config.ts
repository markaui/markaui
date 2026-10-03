import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  target: "es2020",
  outDir: "dist",
  // esbuild strips "use client" directives while bundling; re-add it so the
  // library is a proper client module for Next.js App Router consumers
  // (MarkaUIProvider must be usable directly from server layouts).
  banner: {
    js: '"use client";',
  },
});

