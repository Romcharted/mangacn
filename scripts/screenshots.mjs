// Captures the built showcase (site/dist).
//   node scripts/screenshots.mjs                    -> manga light + dark, headline page
//   node scripts/screenshots.mjs --all              -> also webtoon, right-to-left and mobile
//   node scripts/screenshots.mjs --sections tabs,skeleton
//                                                   -> close-ups of those items (light, dark, webtoon)
// Browser: installed Chrome / Edge, else the newest Chromium in ~/.cache/ms-playwright.
import { existsSync, mkdirSync, readdirSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright-core"
import { preview } from "vite"

const args = process.argv.slice(2)
const all = args.includes("--all")
const sectionsArg = args[args.indexOf("--sections") + 1]
const sections = args.includes("--sections") && sectionsArg ? sectionsArg.split(",") : []
const outDir = "screenshots"
mkdirSync(outDir, { recursive: true })

function cachedChromium() {
  const dir = join(homedir(), ".cache", "ms-playwright")
  if (!existsSync(dir)) return undefined
  const builds = readdirSync(dir)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
  for (const b of builds) {
    for (const exe of ["chrome-linux64/chrome", "chrome-linux/chrome", "chrome-win/chrome.exe", "chrome-win64/chrome.exe"]) {
      const p = join(dir, b, exe)
      if (existsSync(p)) return p
    }
  }
  return undefined
}

async function launch() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel })
    } catch {
      /* try the next browser */
    }
  }
  const executablePath = cachedChromium()
  if (executablePath) return chromium.launch({ executablePath })
  throw new Error("No Chromium-based browser found (Chrome, Edge or a Playwright Chromium).")
}

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: "error" })
const base = "http://localhost:4179"
const browser = await launch()

async function open(page, path) {
  await page.goto(base + path, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
}

if (sections.length) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" })
  const modes = [
    ["light", "dark=0&theme=manga"],
    ["dark", "dark=1&theme=manga"],
    ["webtoon", "dark=0&theme=webtoon"],
  ]
  for (const [mode, q] of modes) {
    await open(page, `/?${q}&dir=ltr`)
    await page.addStyleTag({ content: "body > div > header { position: static !important }" })
    for (const id of sections) {
      const el = page.locator(`#${id}`)
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(150)
      await el.screenshot({ path: `${outDir}/${id}-${mode}.png` })
      console.log(`${outDir}/${id}-${mode}.png`)
    }
  }
  await page.close()
} else {
  const shots = [
    ["index-light", "/?dark=0&theme=manga&dir=ltr"],
    ["index-dark", "/?dark=1&theme=manga&dir=ltr"],
    ["headline-light", "/fonts.html?dark=0"],
    ["headline-dark", "/fonts.html?dark=1"],
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
      await open(page, path)
      await page.screenshot({ path: `${outDir}/${name}${viewport.tag}.png`, fullPage: true })
      console.log(`${outDir}/${name}${viewport.tag}.png`)
    }
    await page.close()
  }
}

await browser.close()
await new Promise((r) => server.httpServer.close(r))
