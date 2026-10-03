import { DocsShell } from "@/components/showcase/docs-shell";

/**
 * Persistent docs chrome (sidebar + topbar) shared by /components,
 * /components/[family] and /components/guides/[guide]. Children swap per
 * route while the shell — search, palette and theme state — stays mounted.
 */
export default function ComponentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DocsShell>{children}</DocsShell>;
}
