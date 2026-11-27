// Checks the page counter of the readers against the reading-line rule: the current page is the last page whose
// top has crossed a line a third of the way down the visible view, under the sticky header; page 1 until page 2
// crosses it, the last page at the bottom of the strip.
// For each reader below, at three window heights (600, 900, 1300 px), scrolls the window by steps of 10 px from
// the top of the page to its bottom, then back up, and reads the counter after each step. The counter must start
// at 1 and show every page number in order, without skipping one, both ways.
// Usage: node scripts/check-reading.mjs [url]   (without a url, starts its own Vite dev server)
import { chromium } from "playwright-core"

const HEIGHTS = process.env.HEIGHTS ? process.env.HEIGHTS.split(",").map(Number) : [600, 900, 1300]
const STEP = 10
const READERS = [
  { name: "Reader Strip", hash: "docs/components/reader-strip", counter: '[role=progressbar][aria-label="Chapter progress"]' },
]

let [url] = process.argv.slice(2)
let server
if (!url) {
  const { createServer } = await import("vite")
  server = await createServer({ logLevel: "error", server: { port: 5213, strictPort: false, fs: { strict: false } } })
  await server.listen()
  url = server.resolvedUrls.local[0]
}

const browser = await chromium.launch()
let failed = 0

// warm-up: a fresh dev server optimises its dependencies on the first visit and reloads the page
{
  const page = await browser.newPage()
  for (const reader of READERS) {
    await page.goto(new URL(reader.hash, url).href, { waitUntil: "networkidle" })
    await page.waitForTimeout(1500)
  }
  await page.close()
}

/** The page numbers the counter showed, in order, with repeats folded. */
const fold = (list) => list.filter((n, i) => i === 0 || n !== list[i - 1])
const expected = (count, down) => Array.from({ length: count }, (_, i) => (down ? i + 1 : count - i))

for (const reader of READERS) {
  for (const height of HEIGHTS) {
    const page = await browser.newPage({ viewport: { width: 1280, height } })
    await page.goto(new URL(reader.hash, url).href, { waitUntil: "networkidle" })
    const counter = page.locator(reader.counter).first()
    await counter.waitFor()
    const run = await page.evaluate(
      async ({ selector, step }) => {
        const el = document.querySelector(selector)
        const frame = () => new Promise((r) => requestAnimationFrame(() => r()))
        const read = () => {
          const m = /Page (\d+) \/ (\d+)/.exec(el.getAttribute("aria-valuetext") ?? "")
          return m ? [Number(m[1]), Number(m[2])] : [NaN, NaN]
        }
        const settle = async () => {
          await frame()
          await frame()
          return read()[0]
        }
        window.scrollTo({ top: 0, behavior: "instant" })
        const start = await settle()
        const count = read()[1]
        const max = () => document.documentElement.scrollHeight - document.documentElement.clientHeight
        const down = [start]
        for (let y = step; y < max() + step; y += step) {
          window.scrollTo({ top: Math.min(y, max()), behavior: "instant" })
          down.push(await settle())
        }
        const up = [down[down.length - 1]]
        for (let y = max() - step; y > -step; y -= step) {
          window.scrollTo({ top: Math.max(y, 0), behavior: "instant" })
          up.push(await settle())
        }
        return { start, count, down, up, steps: down.length + up.length }
      },
      { selector: reader.counter, step: STEP },
    )
    const down = fold(run.down)
    const up = fold(run.up)
    const ok =
      run.start === 1 &&
      down.join() === expected(run.count, true).join() &&
      up.join() === expected(run.count, false).join()
    if (!ok) failed++
    console.log(
      `${ok ? "ok  " : "FAIL"} ${reader.name} · ${height}px · ${run.steps} steps · start ${run.start} · down ${down.join(" ")} · up ${up.join(" ")}`,
    )
    await page.close()
  }
}

await browser.close()
await server?.close()
console.log(failed ? `${failed} run(s) failed` : "reading line: every page in order, both ways, at every height")
process.exit(failed ? 1 : 0)
