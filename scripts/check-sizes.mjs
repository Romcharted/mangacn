// Checks that no picture of the series is shown larger than it really is. For every page of the site (the home,
// each component page, each example), at a phone and a desktop width, scrolls through the page so lazy images
// load, then for each <img> from /art/ compares the size it is drawn at (object-fit taken into account) with:
//   - the real size of the picture (its largest file): drawn larger = the crop itself is blown up;
//   - the file the browser picked (currentSrc): drawn larger = a bigger file existed but was not used.
// Usage: node scripts/check-sizes.mjs [url] [only-hash ...]   (without a url, starts its own Vite dev server)
import { readFileSync } from "node:fs"
import { chromium } from "playwright-core"

const WIDTHS = [375, 1280, 1536]
const TOLERANCE = 1.02 // rounding of borders and percentages
const REAL = JSON.parse(readFileSync(new URL("../site/src/mapless-art.json", import.meta.url), "utf8"))

let [url, ...only] = process.argv.slice(2)
let server
if (!url || url.startsWith("#")) {
  if (url) only.unshift(url)
  const { createServer } = await import("vite")
  server = await createServer({ logLevel: "error", server: { port: 5214, strictPort: false, fs: { strict: false } } })
  await server.listen()
  url = server.resolvedUrls.local[0]
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(url, { waitUntil: "networkidle" })
const hashes = only.length
  ? only
  : [
      "",
      ...new Set(
        await page.$$eval("a[href^='#']", (as) =>
          as.map((a) => a.getAttribute("href")).filter((h) => h.length > 2 && h !== "#main" && !h.includes(" ")),
        ),
      ),
    ]

const found = new Map()
for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 })
  for (const hash of hashes) {
    await page.goto(new URL(hash || "#", url).href, { waitUntil: "networkidle" })
    // scroll through the page so the lazy pictures load
    await page.evaluate(async () => {
      const frame = () => new Promise((r) => setTimeout(r, 60))
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo({ top: y, behavior: "instant" })
        await frame()
      }
    })
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(300)
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((img) => /\/art\/[a-z0-9-]+-\d+\.webp/.test(img.currentSrc || img.src) && img.naturalWidth > 0)
        .map((img) => {
          const r = img.getBoundingClientRect()
          const s = getComputedStyle(img)
          if (r.width < 2 || r.height < 2 || s.visibility === "hidden") return null
          const box = { w: r.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight), h: r.height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) }
          const fit = s.objectFit
          // the file's own pixels: with a srcset, naturalWidth is corrected by the density the browser assumed
          const [, name, file] = /\/art\/([a-z0-9-]+?)-(\d+)\.webp/.exec(img.currentSrc || img.src)
          const natW = Number(file)
          const natH = (natW * img.naturalHeight) / img.naturalWidth
          const sx = box.w / natW
          const sy = box.h / natH
          // how much one pixel of the file is magnified
          const scale = fit === "cover" ? Math.max(sx, sy) : fit === "contain" || fit === "scale-down" ? Math.min(sx, sy) : fit === "none" ? 1 : Math.max(sx, sy)
          const where = [img.closest("[data-manga]")?.getAttribute("data-manga"), img.alt].filter(Boolean).join(" · ")
          return { name, file: Number(file), natW, scale, shown: Math.round(box.w), where }
        })
        .filter(Boolean),
    )
    for (const row of rows) {
      const real = REAL[row.name]
      if (!real) continue
      const blown = (row.scale * row.natW) / real.width // magnification of the real picture
      const kind = blown > TOLERANCE ? "crop" : row.scale > TOLERANCE ? "file" : null
      if (!kind) continue
      const key = `${kind}|${row.name}|${hash || "#home"}|${row.where}`
      const prev = found.get(key)
      if (!prev || prev.blown < blown) found.set(key, { kind, ...row, blown, real: real.width, hash: hash || "#home", width })
    }
  }
}

await browser.close()
await server?.close()

const list = [...found.values()].sort((a, b) => a.kind.localeCompare(b.kind) || b.blown - a.blown)
for (const f of list) {
  console.log(
    `${f.kind === "crop" ? "CROP" : "FILE"} ${f.name} (real ${f.real}px, file ${f.file}px) drawn x${f.blown.toFixed(2)} of real, x${f.scale.toFixed(2)} of its file · ${f.hash} · ${f.where} · ${f.width}px window`,
  )
}
console.log(list.length ? `${list.length} picture(s) drawn larger than they are` : "no picture drawn larger than it is")
process.exit(list.length ? 1 : 0)
