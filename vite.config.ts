import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import type { Plugin as PostcssPlugin } from "postcss"
import { defineConfig } from "vite"

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

// The site lives in ./site but imports the registry sources from ./registry,
// exactly as a user project would after `shadcn add`.
export default defineConfig({
  root: "site",
  base: "./",
  plugins: [react(), tailwindcss()],
  css: { postcss: { plugins: [forceStates] } },
  resolve: {
    alias: {
      "@registry": r("./registry"),
      "@": r("./site/src"),
    },
  },
  server: { fs: { allow: [r(".")] } },
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
