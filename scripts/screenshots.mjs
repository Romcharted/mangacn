// Captures the built showcase (site/dist) in light and dark.
//   node scripts/screenshots.mjs          -> manga light + dark, fonts page
//   node scripts/screenshots.mjs --all    -> also webtoon and right-to-left
// Uses an installed Edge or Chrome through playwright-core (no browser download).
import { mkdirSync } from "node:fs"
import { chromium } from "playwright-core"
import { preview } from "vite"

const all = process.argv.includes("--all")
const outDir = "screenshots"
mkdirSync(outDir, { recursive: true })

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: "error" })
const base = "http://localhost:4179"

let browser
for (const channel of ["msedge", "chrome", undefined]) {
  try {
    browser = await chromium.launch({ channel })
    break
  } catch {
    /* try the next browser */
  }
}
if (!browser) throw new Error("No Chromium-based browser found (Edge or Chrome).")

const shots = [
  ["index-light", "/?dark=0&theme=manga&dir=ltr"],
  ["index-dark", "/?dark=1&theme=manga&dir=ltr"],
  ["fonts-light", "/fonts.html?dark=0"],
  ["fonts-dark", "/fonts.html?dark=1"],
]
if (all)
  shots.push(
    ["index-webtoon-light", "/?dark=0&theme=webtoon"],
    ["index-webtoon-dark", "/?dark=1&theme=webtoon"],
    ["index-rtl", "/?dark=0&dir=rtl"],
  )

for (const viewport of [
  { width: 1280, height: 900, tag: "" },
  ...(all ? [{ width: 390, height: 844, tag: "-mobile" }] : []),
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce", deviceScaleFactor: 1 })
  for (const [name, path] of shots) {
    await page.goto(base + path, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${outDir}/${name}${viewport.tag}.png`, fullPage: true })
    console.log(`${outDir}/${name}${viewport.tag}.png`)
  }
  await page.close()
}

await browser.close()
await new Promise((r) => server.httpServer.close(r))
