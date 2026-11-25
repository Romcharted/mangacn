// Captures open overlays (dialog, toasts, tooltips) from the built site, light and dark.
//   node scripts/overlay-shots.mjs
import { existsSync, mkdirSync, readdirSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright-core"
import { preview } from "vite"

mkdirSync("screenshots", { recursive: true })
const dir = join(homedir(), ".cache", "ms-playwright")
const exe = existsSync(dir)
  ? readdirSync(dir)
      .filter((d) => /^chromium-\d+$/.test(d))
      .sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))
      .map((b) => join(dir, b, "chrome-linux64/chrome"))
      .find(existsSync)
  : undefined

const server = await preview({ preview: { port: 4181, strictPort: true }, logLevel: "error" })
const browser = await chromium.launch(exe ? { executablePath: exe } : { channel: "chrome" })
const page = await browser.newPage({ viewport: { width: 1280, height: 860 }, reducedMotion: "reduce" })

for (const mode of ["light", "dark", "webtoon"]) {
  const q = mode === "dark" ? "dark=1&theme=manga" : mode === "webtoon" ? "dark=0&theme=webtoon" : "dark=0&theme=manga"
  await page.goto(`http://localhost:4181/?${q}`, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: "body > div > header { position: static !important }" })

  await page.locator("#dialog").getByRole("button", { name: "Scrolling body" }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `screenshots/dialog-open-${mode}.png` })
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  const sonner = page.locator("#sonner")
  await sonner.scrollIntoViewIfNeeded()
  for (const name of ["Default", "Success", "Error", "With action", "SFX"]) {
    await sonner.getByRole("button", { name, exact: true }).click()
    await page.waitForTimeout(120)
  }
  await page.mouse.move(1180, 820)
  await page.waitForTimeout(600)
  await page.screenshot({ path: `screenshots/toasts-${mode}.png` })
  console.log(mode, "done")
}

await browser.close()
await new Promise((r) => server.httpServer.close(r))
