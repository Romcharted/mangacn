import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// The site lives in ./site but imports the registry sources from ./registry,
// exactly as a user project would after `shadcn add`.
export default defineConfig({
  root: "site",
  base: "./",
  plugins: [react(), tailwindcss()],
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
