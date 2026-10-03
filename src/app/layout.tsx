import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7d1f2e" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0a0e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "markaui",
    "component library",
    "react components",
    "ui library",
    "react ui",
    "tailwind css",
    "tailwind v4",
    "design system",
    "themeable components",
    "dark mode",
    "shadcn/ui",
    "radix ui",
    "nextjs",
    "vite",
    "typescript",
    "npm markaui",
  ],
  authors: [{ name: "MarkaUI", url: SITE_URL }],
  creator: "MarkaUI",
  publisher: "MarkaUI",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "339+ accessible, themeable React components. 12 luxury themes × light & dark. TypeScript-first. Next.js, Vite & plain JS.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "339+ accessible, themeable React components. 12 luxury themes × light & dark.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
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
