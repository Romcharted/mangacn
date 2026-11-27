// Captures the built showcase (site/dist) at 100 % (deviceScaleFactor 1), never scaled down.
//   node scripts/screenshots.mjs                 -> 375/800/1280/1440 px × light/dark:
//                                                   gallery, Button, Tabs, SpeechBubble (full page),
//                                                   an open Dialog and a toast (viewport)
//   node scripts/screenshots.mjs --only button   -> only those views (comma-separated)
// Browser: installed Chrome / Edge, else the newest Chromium in ~/.cache/ms-playwright.
import { existsSync, mkdirSync, readdirSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright-core"
import { preview } from "vite"

const args = process.argv.slice(2)
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null
const outDir = "screenshots"
mkdirSync(outDir, { recursive: true })

function cachedChromium() {
  const dir = join(homedir(), ".cache", "ms-playwright")
  if (!existsSync(dir)) return undefined
  const builds = readdirSync(dir)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
  for (const b of builds)
    for (const exe of ["chrome-linux64/chrome", "chrome-linux/chrome", "chrome-win/chrome.exe", "chrome-win64/chrome.exe"]) {
      const p = join(dir, b, exe)
      if (existsSync(p)) return p
    }
  return undefined
}

async function launch() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel })
    } catch {
      /* next */
    }
  }
  const executablePath = cachedChromium()
  if (executablePath) return chromium.launch({ executablePath })
  throw new Error("No Chromium-based browser found (Chrome, Edge or a Playwright Chromium).")
}

const server = await preview({ preview: { port: Number(process.env.PORT ?? 4179), strictPort: true }, logLevel: "error" })
const base = `http://localhost:${process.env.PORT ?? 4179}`
const browser = await launch()

const views = [
  { name: "gallery", hash: "", full: true },
  { name: "button", hash: "#button", full: true },
  { name: "tabs", hash: "#tabs", full: true },
  { name: "speech-bubble", hash: "#speech-bubble", full: true },
  { name: "dialog-open", hash: "#dialog", full: false, open: async (page) => {
      await page.getByRole("button", { name: "Leave the chapter" }).click()
      await page.waitForTimeout(400)
    } },
  { name: "toast", hash: "#sonner", full: false, open: async (page) => {
      for (const name of ["Error", "With action", "SFX"]) {
        await page.getByRole("button", { name, exact: true }).first().click()
        await page.waitForTimeout(150)
      }
      await page.waitForTimeout(500)
    } },
  { name: "headline", path: "/fonts.html", hash: "", full: true, widths: [1280] },
  { name: "grammar", hash: "#grammar", full: true },
  { name: "switch", hash: "#switch", full: true },
  { name: "select", hash: "#select", full: true },
  { name: "select-open", hash: "#select", full: false, open: async (page) => {
      await page.locator("[data-manga=select-trigger]").first().click()
      await page.waitForTimeout(400)
    } },
  { name: "table", hash: "#table", full: true },
  { name: "accordion", hash: "#accordion", full: true },
  { name: "examples", hash: "#examples", full: true },
  ...["field", "radio-group", "slider", "alert", "progress", "pagination", "breadcrumb", "empty", "bubble", "message", "avatar", "manpu", "burst", "stamp", "banner", "stepper", "stat", "gestures"].map((n) => ({ name: n, hash: "#" + n, full: true })),
  { name: "dropdown-open", hash: "#dropdown-menu", full: false, open: (p) => p.getByRole("button", { name: "Chapter 12" }).click().then(() => p.waitForTimeout(400)) },
  { name: "popover-open", hash: "#popover", full: false, open: (p) => p.getByRole("button", { name: "Volume details" }).click().then(() => p.waitForTimeout(400)) },
  { name: "alert-dialog-open", hash: "#alert-dialog", full: false, open: (p) => p.getByRole("button", { name: "Delete volume" }).click().then(() => p.waitForTimeout(400)) },
  { name: "sheet-open", hash: "#sheet", full: false, open: (p) => p.getByRole("button", { name: "From the right" }).click().then(() => p.waitForTimeout(400)) },
  { name: "hover-card-open", hash: "#hover-card", full: false, open: (p) => p.locator("[data-slot=hover-card-trigger]").first().hover().then(() => p.waitForTimeout(900)) },
].filter((v) => !only || only.includes(v.name))

const widthsArg = args.includes("--widths") ? args[args.indexOf("--widths") + 1].split(",").map(Number) : null
for (const width of widthsArg ?? [375, 800, 1280, 1440]) {
  for (const dark of [0, 1]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 })
    for (const v of views) {
      if (v.widths && !v.widths.includes(width)) continue
      await page.goto(`${base}${v.path ?? "/"}?dark=${dark}&accent=stamp&reading=ltr${v.hash}`, { waitUntil: "networkidle" })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(250)
      if (v.open) await v.open(page)
      const file = `${outDir}/${v.name}-${width}-${dark ? "dark" : "light"}.png`
      await page.screenshot({ path: file, fullPage: v.full })
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      console.log(file + (overflow > 0 ? `  ! horizontal overflow ${overflow}px` : ""))
    }
    await page.close()
  }
}

await browser.close()
await new Promise((r) => server.httpServer.close(r))
