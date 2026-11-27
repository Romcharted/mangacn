// Checks that the previews of /docs/components are live: for each component card, hovers then clicks the controls of
// its preview (buttons first, then tabs, inputs…, then its centre, then a right-click) and compares screenshots
// of the preview before and after. Lists the cards where nothing changed, and any preview whose click left the
// page (only the title and the arrow may open a component's page).
// Usage: node scripts/check-thumbs.mjs <url of /docs/components> [only-title ...]   (npm run check runs it)
import { chromium } from "playwright-core"

const [url = "http://127.0.0.1:5173/docs/components", ...only] = process.argv.slice(2)
const CONTROLS = [
  "button:not([disabled]):not([aria-hidden=true])",
  "[role=tab], [role=radio], [role=switch], [role=checkbox], [role=slider], [role=menuitem], [role=option]",
  "input:not([type=hidden]), select, textarea",
  "a[href], [tabindex='0'], summary",
]
const TRIES = 4

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(url, { waitUntil: "networkidle" })

const cards = "article:has([data-demo])"
const titles = await page.$$eval(`${cards} a[href*='/docs/components/']:not([aria-hidden])`, (as) => as.map((a) => a.textContent.trim()))
const still = []
const navigates = []
const moving = []

const same = (a, b) => a.length === b.length && a.equals(b)
const layers = () =>
  page.evaluate(() => document.querySelectorAll("[role=dialog],[role=menu],[role=listbox],[role=tooltip],[data-state=open],[data-open]").length)

/** The points to try in a preview: the centres of its controls (by kind), then its own centre. */
async function points(demo, box) {
  const out = []
  for (const sel of CONTROLS) {
    for (const el of await demo.locator(sel).filter({ visible: true }).all()) {
      const b = await el.boundingBox()
      // only what shows inside the preview's frame can be reached
      const cy = b ? b.y + b.height / 2 : -1
      if (b && b.width > 0 && cy > box.y && cy < box.y + box.height) out.push({ x: b.x + b.width / 2, y: cy })
      if (out.length >= TRIES) return out
    }
  }
  out.push({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
  return out
}

for (const [i, title] of titles.entries()) {
  if (only.length && !only.includes(title)) continue
  const demo = page.locator(cards).nth(i).locator("[data-demo]")
  await demo.scrollIntoViewIfNeeded()
  await page.waitForTimeout(900) // the preview's chunk loads near the screen
  const box = await demo.boundingBox()
  if (!box) continue
  const shot = async () => {
    await page.waitForTimeout(350)
    return page.screenshot({ clip: box, animations: "disabled", caret: "hide" })
  }
  const hash = await page.evaluate(() => location.pathname)
  const open = await layers()
  // a preview that moves on its own cannot be judged by screenshots
  if (!same(await shot(), await shot())) {
    moving.push(title)
    process.stdout.write("~")
    continue
  }
  let changed = false
  for (const at of await points(demo, box)) {
    const before = await shot()
    await page.mouse.move(at.x, at.y)
    const hovered = await shot()
    await page.mouse.click(at.x, at.y)
    const clicked = await shot()
    changed = !same(before, hovered) || !same(hovered, clicked) || (await layers()) > open
    if (process.env.DEBUG) {
      const { writeFileSync } = await import("node:fs")
      for (const [k, b] of Object.entries({ before, hovered, clicked })) writeFileSync(`${process.env.DEBUG}/${i}-${k}.png`, b)
      console.log(title, at, { hover: !same(before, hovered), click: !same(hovered, clicked) })
    }
    if (!changed) {
      // a scroll, then a short drag (scroll areas, strips, resize handles)
      const still = await shot()
      for (const dy of [-160, 160]) {
        if (changed) break
        const y = await page.evaluate(() => scrollY)
        await page.mouse.wheel(0, dy)
        await page.waitForTimeout(600) // the page may scroll smoothly
        // a wheel that scrolled the page itself does not count
        if ((await page.evaluate(() => scrollY)) !== y) await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y)
        else changed = !same(still, await shot())
      }
      if (!changed) {
        await page.mouse.move(at.x, at.y)
        await page.mouse.down()
        await page.mouse.move(at.x + 40, at.y, { steps: 5 })
        await page.mouse.up()
        await page.evaluate(() => getSelection()?.removeAllRanges())
        changed = !same(still, await shot())
      }
    }
    if (!changed) {
      await page.mouse.click(at.x, at.y, { button: "right" })
      changed = (await layers()) > open || !same(hovered, await shot())
    }
    await page.keyboard.press("Escape")
    await page.keyboard.press("Escape")
    if ((await page.evaluate(() => location.pathname)) !== hash) {
      navigates.push(title)
      await page.goto(url, { waitUntil: "networkidle" })
      break
    }
    if (changed) break
  }
  await page.mouse.move(2, 2)
  if (!changed) still.push(title)
  process.stdout.write(changed ? "." : "x")
}

console.log(`\n${only.length || titles.length} previews checked.`)
console.log(still.length ? `Nothing changed in ${still.length}: ${still.join(", ")}` : "Every preview reacted.")
if (moving.length) console.log(`Moving on their own (not judged): ${moving.join(", ")}`)
if (navigates.length) console.log(`Left the page: ${navigates.join(", ")}`)
await browser.close()
process.exit(navigates.length ? 1 : 0)
