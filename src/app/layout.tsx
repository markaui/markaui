import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "MarkaUI — Premium React Component Library",
    template: "%s | MarkaUI",
  },
  description:
    "MarkaUI is a premium, themeable React component library — 339+ accessible components, 12 luxury themes × light & dark, TypeScript-first, works with Next.js, Vite and plain React.",
  keywords: [
    "markaui",
    "component library",
    "react components",
    "ui library",
    "tailwind css",
    "design system",
    "shadcn/ui",
    "nextjs",
    "vite",
  ],
  authors: [{ name: "MarkaUI" }],
  openGraph: {
    type: "website",
    siteName: "MarkaUI",
    title: "MarkaUI — Premium React Component Library",
    description:
      "339+ accessible, themeable React components. 12 luxury themes × light & dark. TypeScript-first. Next.js, Vite & plain JS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkaUI — Premium React Component Library",
    description:
      "339+ accessible, themeable React components. 12 luxury themes × light & dark.",
  },
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

/** Applies stored theme/mode before hydration to avoid flash (legacy keys migrate) */
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('markaui-theme') || localStorage.getItem('saptapadi-theme');
    var m = localStorage.getItem('markaui-mode') || localStorage.getItem('saptapadi-mode');
    var root = document.documentElement;
    if (t) root.setAttribute('data-theme', t);
    if (m === 'dark') { root.classList.add('dark'); root.style.colorScheme = 'dark'; }
    else { root.style.colorScheme = 'light'; }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="maroon">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
