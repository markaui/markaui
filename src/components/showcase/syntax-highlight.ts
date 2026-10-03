/**
 * CDN-powered syntax highlighting for the docs code previewer.
 *
 * Deliberately ZERO npm dependencies — Prism.js (core + TSX grammar) and its
 * base theme are loaded from cdnjs at runtime, the way a classic <script>
 * integration would. The loader is memoized, runs once per page session, and
 * degrades gracefully: if the CDN is unreachable the code panel simply keeps
 * showing plain (unhighlighted) text, exactly as before.
 *
 * Theming: the CDN ships a static LIGHT theme. Dark-mode token colors are
 * adapted in globals.css ("Prism token — dark adaptation" section) so the
 * code panel follows the site's light/dark axis without a second download.
 */

/* ------------------------------ Prism typing ------------------------------ */

interface PrismNS {
  highlight(text: string, grammar: unknown, language: string): string;
  languages: Record<string, unknown>;
}

declare global {
  interface Window {
    Prism?: PrismNS;
  }
}

/* ------------------------------- CDN assets ------------------------------- */

const PRISM_VERSION = "1.29.0";
const CDN = `https://cdnjs.cloudflare.com/ajax/libs/prism/${PRISM_VERSION}`;

const THEME_CSS = `${CDN}/themes/prism.min.css`;

/** prism.min.js bundle ships markup + css + clike + javascript grammars. */
const CORE_JS = `${CDN}/prism.min.js`;
/** tsx needs typescript + jsx (which need javascript + markup — in the bundle). */
const LANGUAGE_JS = [
  `${CDN}/components/prism-typescript.min.js`,
  `${CDN}/components/prism-jsx.min.js`,
  `${CDN}/components/prism-tsx.min.js`,
];

/* ------------------------------ DOM injectors ------------------------------ */

function injectStylesheet(href: string): void {
  if (document.querySelector(`link[data-syntax-href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.syntaxHref = href;
  document.head.appendChild(link);
}

function injectScript(src: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-syntax-src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false; // preserve injection order for grammar dependencies
    script.dataset.syntaxSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/* --------------------------------- Loader --------------------------------- */

const LOAD_TIMEOUT_MS = 10_000;

let loaderPromise: Promise<PrismNS | null> | null = null;

/**
 * Loads Prism + the tsx grammar from CDN (once). Resolves with the Prism
 * namespace, or null when the CDN is unreachable/slow — callers must treat
 * null as "keep plain text".
 */
export function loadSyntaxHighlighter(): Promise<PrismNS | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (loaderPromise) return loaderPromise;

  loaderPromise = (async () => {
    try {
      injectStylesheet(THEME_CSS);

      // Manual mode must be declared before the core script executes, so
      // Prism never scans the whole DOM on load — we highlight explicitly.
      if (!window.Prism) {
        const bootstrap = document.createElement("script");
        bootstrap.textContent = "window.Prism=window.Prism||{};window.Prism.manual=true;";
        document.head.appendChild(bootstrap);
      }

      await injectScript(CORE_JS);
      for (const src of LANGUAGE_JS) {
        await injectScript(src);
      }

      const prism = window.Prism;
      if (!prism || !prism.languages?.tsx) return null;
      return prism;
    } catch {
      return null; // graceful fallback: plain text code panel
    }
  })();

  // Never let a hanging CDN stall consumers — race against a timeout.
  const timeout = new Promise<null>((resolve) =>
    window.setTimeout(() => resolve(null), LOAD_TIMEOUT_MS)
  );
  loaderPromise = Promise.race([loaderPromise, timeout]).then((result) => {
    loaderPromise = Promise.resolve(result); // settle the memo on the raced value
    return result;
  });

  return loaderPromise;
}

/**
 * Highlights a <code> element in-place with the tsx grammar. The element
 * keeps its text content as a plain-text fallback; highlighting swaps the
 * innerHTML for token spans once Prism is ready. No `language-*` class is
 * added, so the CDN theme's pre/code background rules stay inert and the
 * panel keeps its own card styling.
 */
export async function highlightCodeElement(el: HTMLElement, code: string): Promise<void> {
  const prism = await loadSyntaxHighlighter();
  if (!prism || !el.isConnected) return;
  // Idempotent: skip when already highlighted (token spans present).
  if (el.firstElementChild?.classList.contains("token")) return;
  el.innerHTML = prism.highlight(code, prism.languages.tsx, "tsx");
}
