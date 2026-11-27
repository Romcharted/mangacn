import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import type { Plugin as PostcssPlugin } from "postcss"
import { defineConfig, type Plugin } from "vite"

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Showcase only: every :hover / :focus-visible / :active rule also matches
// data-force="hover|focus|active", so the state grids can show frozen states.
// Nothing here ships with the registry.
const FORCED: [string, string][] = [
  [":hover", '[data-force~="hover"]'],
  [":focus-visible", '[data-force~="focus"]'],
  [":active", '[data-force~="active"]'],
]
const forceStates: PostcssPlugin = {
  postcssPlugin: "mangacn-force-states",
  Rule(rule) {
    if (!FORCED.some(([p]) => rule.selector.includes(p))) return
    if (rule.selector.includes("data-force")) return
    // Only real pseudo-classes: skip escaped ones inside class names (\:hover).
    const extra = rule.selectors.flatMap((s) =>
      FORCED.map(([p, f]) => s.replace(new RegExp("(?<!\\\\)" + p + "(?![\\w-])", "g"), f)).filter((x) => x !== s),
    )
    rule.selectors = [...rule.selectors, ...extra]
  },
}

/*
 * Hosting (see docs/deploy.md). BASE_PATH: where the site is served ("/" at the root of a domain,
 * "/mangacn/" in a folder). The site routes with real paths (/docs/components/button), so the base is absolute;
 * the host sends unknown paths to index.html (site/public/.htaccess).
 * SITE_URL: the public address (https://example.com/ or https://example.com/mangacn/), written into the
 * share tags; without it the canonical and og:url tags are left out and og:image stays relative.
 */
const BASE_PATH = process.env.BASE_PATH || "/"
const SITE_URL = process.env.SITE_URL ? process.env.SITE_URL.replace(/\/?$/, "/") : ""
const siteUrl: Plugin = {
  name: "mangacn-site-url",
  transformIndexHtml(html) {
    if (SITE_URL) return html.replaceAll("__SITE_URL__", SITE_URL)
    return html
      .split("\n")
      .filter((line) => !/rel="canonical"|property="og:url"/.test(line))
      .join("\n")
      .replaceAll("__SITE_URL__", "")
  },
}

// The site lives in ./site but imports the registry sources from ./registry,
// exactly as a user project would after `shadcn add`.
export default defineConfig({
  root: "site",
  base: BASE_PATH,
  // .env files live at the repository root, next to package.json (the Vite root is ./site)
  envDir: r("."),
  plugins: [react(), tailwindcss(), siteUrl],
  css: { postcss: { plugins: [forceStates] } },
  resolve: {
    alias: {
      "@registry": r("./registry"),
      // registry lib files keep the import path users get after install (@/lib/manga/...)
      "@/lib/manga": r("./registry/manga/lib"),
      "@/components/ui/manga": r("./registry/manga/ui"),
      "@/components/manga": r("./registry/manga/signature"),
      "@": r("./site/src"),
    },
  },
  server: { fs: { allow: [r(".")] } },
  // Prebundled at start: discovered late, after a long session, react-dom was left unoptimized and the dev
  // server answered 504 (Outdated Optimize Dep), so Author site and PageReader no longer opened.
  optimizeDeps: { include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"] },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: r("./site/index.html"),
        fonts: r("./site/fonts.html"),
      },
    },
  },
})
