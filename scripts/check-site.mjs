// node scripts/check-site.mjs [url] — checks every address of the built site, at 375 and 1280 px.
// Run after `npm run build` (without a url it serves site/dist with `vite preview`). Part of `npm run check`.
//
//   1. every address shows a page: no blank page, no "didn't load" panel, no console error
//   2. no horizontal overflow of the page
//   3. no picture of the series drawn larger than its real size (nor larger than the file the browser picked)
//   4. no visible text smaller than 10px on screen (CSS zoom, transforms and SVG scaling counted)
//   5. in every Preview frame of a component page, the content is centred: left and right margins differ by
//      less than 10% of the frame's width
//   6. every component page has Installation, Usage, Examples (3 at least when the component is interactive),
//      States and API reference
//   7. then runs scripts/check-reading.mjs (the ReaderStrip counter) and scripts/check-thumbs.mjs (live
//      thumbnails on /docs/components) against the same server
//   8. old addresses in "#" lead to their new address
//
// ONLY=docs/components/button,examples node scripts/check-site.mjs   checks a few addresses only.
// WIDTHS=375 node scripts/check-site.mjs                              one width only.
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { chromium } from "playwright-core"

const WIDTHS = process.env.WIDTHS ? process.env.WIDTHS.split(",").map(Number) : [375, 1280]
const MIN_TEXT = 10
const CENTRE = 0.1
const REAL = JSON.parse(readFileSync(new URL("../site/src/mapless-art.json", import.meta.url), "utf8"))
const registry = JSON.parse(readFileSync(new URL("../registry.json", import.meta.url), "utf8"))
const ifaceSource = readFileSync(new URL("../site/src/interfaces.tsx", import.meta.url), "utf8")
const interfaces = [...ifaceSource.matchAll(/\{ slug: "([a-z-]+)", title:/g)].map((m) => m[1])
const screens = (/screens: \[([^\]]+)\]/.exec(ifaceSource)?.[1] ?? "").match(/[a-z-]+/g) ?? []

let [url] = process.argv.slice(2)
let server
if (!url) {
  const { preview } = await import("vite")
  server = await preview({ preview: { port: 5215, strictPort: false }, logLevel: "error" })
  url = server.resolvedUrls.local[0]
}
url = url.replace(/\/?$/, "/")

const components = registry.items.filter((i) => i.type !== "registry:block").map((i) => i.name)
const ROUTES = process.env.ONLY
  ? process.env.ONLY.split(",")
  : [
      "",
      ...["docs", "docs/installation", "docs/grammar", "docs/theming", "docs/fonts", "docs/reading-direction", "docs/ai", "docs/changelog"],
      "docs/components",
      ...components.map((n) => `docs/components/${n}`),
      "examples",
      ...interfaces.map((s) => `examples/${s}`),
      ...screens.map((s) => `examples/${s}`),
      ...interfaces.map((s) => `view/${s}`),
      "studio",
      "legal",
    ]

const LEGACY = [
  ["#button", "docs/components/button"],
  ["#speech-bubble", "docs/components/speech-bubble"],
  ["#grammar", "docs/grammar"],
  ["#examples", "examples"],
  ["#examples/dashboard", "examples/dashboard"],
  ["#dashboard", "examples/dashboard"],
  ["#sign-in", "examples/sign-in"],
  ["#studio", "studio"],
  ["#legal", "legal"],
  ["#/", ""],
]

const browser = await chromium.launch()
const problems = []
const say = (route, width, msg) => problems.push(`/${route} @${width}: ${msg}`)

/** Everything measured inside the page, in one pass. */
function measure({ minText, centre }) {
  const out = { blank: false, loadError: 0, overflow: 0, small: [], images: [], centring: [], sections: null }
  const main = document.querySelector("main") ?? document.body
  out.blank = (main.innerText ?? "").trim().length < 20 && !main.querySelector("img, svg, canvas")
  out.loadError = document.querySelectorAll("[data-load-error]").length
  out.overflow = Math.round(document.documentElement.scrollWidth - innerWidth)

  const visible = (el) => {
    const s = getComputedStyle(el)
    if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) return false
    // screen-reader-only text (clipped to one pixel)
    if (s.position === "absolute" && (s.clip === "rect(0px, 0px, 0px, 0px)" || s.clipPath === "inset(50%)") && r.width <= 2) return false
    for (let p = el; p; p = p.parentElement) {
      const ps = getComputedStyle(p)
      if (ps.display === "none" || ps.visibility === "hidden" || Number(ps.opacity) === 0) return false
      if (p.hasAttribute("hidden")) return false
    }
    return true
  }
  /** How much an element is scaled on screen: CSS zoom and transforms of it and its ancestors. */
  const scaleOf = (el) => {
    let k = 1
    for (let p = el; p && p.nodeType === 1; p = p.parentElement) {
      const s = getComputedStyle(p)
      const z = parseFloat(s.zoom)
      if (z && z !== 1) k *= z
      if (s.transform && s.transform !== "none") {
        const m = new DOMMatrixReadOnly(s.transform)
        k *= Math.hypot(m.a, m.b)
      }
    }
    return k
  }

  // 4. text size
  const seen = new Set()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue
    const el = n.parentElement
    if (!el || seen.has(el)) continue
    seen.add(el)
    if (el.closest("script, style, noscript, [aria-hidden=true] svg title, title")) continue
    if (!visible(el)) continue
    let size
    if (el instanceof SVGElement) {
      const fs = parseFloat(getComputedStyle(el).fontSize)
      const ctm = el.getScreenCTM?.()
      size = ctm ? fs * Math.hypot(ctm.a, ctm.b) : fs
      // CSS zoom and transforms of the HTML ancestors are already in the CTM in Chromium
    } else {
      size = parseFloat(getComputedStyle(el).fontSize) * scaleOf(el)
    }
    if (size < minText - 0.05) {
      const where = el.closest("[data-manga]")?.getAttribute("data-manga") ?? el.closest("[data-card]")?.getAttribute("data-card") ?? el.tagName.toLowerCase()
      out.small.push(`${size.toFixed(1)}px "${n.textContent.trim().slice(0, 24)}" (${where})`)
    }
  }

  // 3. pictures of the series
  for (const img of document.querySelectorAll("img")) {
    const m = /\/art\/([a-z0-9-]+?)-(\d+)\.webp/.exec(img.currentSrc || img.src)
    if (!m || !img.naturalWidth || !visible(img)) continue
    const r = img.getBoundingClientRect()
    const s = getComputedStyle(img)
    const k = scaleOf(img.parentElement ?? img)
    const box = { w: (r.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)), h: (r.height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom)) }
    void k
    const natW = Number(m[2])
    const natH = (natW * img.naturalHeight) / img.naturalWidth
    const sx = box.w / natW
    const sy = box.h / natH
    const fit = s.objectFit
    const scale = fit === "contain" || fit === "scale-down" ? Math.min(sx, sy) : fit === "none" ? 1 : Math.max(sx, sy)
    out.images.push({ name: m[1], file: natW, scale, shown: Math.round(box.w), alt: img.alt.slice(0, 40) })
  }

  // 5. centring in the Preview frames
  for (const stage of document.querySelectorAll("[data-stage]")) {
    if (!visible(stage)) continue
    const fr = stage.getBoundingClientRect()
    let L = Infinity
    let R = -Infinity
    for (const el of stage.querySelectorAll("[data-stage-content] *")) {
      const s = getComputedStyle(el)
      if (s.position === "fixed" || !visible(el)) continue
      const b = el.getBoundingClientRect()
      L = Math.min(L, Math.max(b.left, fr.left))
      R = Math.max(R, Math.min(b.right, fr.right))
    }
    if (!Number.isFinite(L)) continue
    const left = L - fr.left
    const right = fr.right - R
    const label = stage.closest("section")?.querySelector("h3")?.textContent ?? "Preview"
    if (Math.abs(left - right) > centre * fr.width) out.centring.push(`${label}: ${Math.round(left)}px left, ${Math.round(right)}px right of ${Math.round(fr.width)}px`)
  }

  // 6. sections of a component page
  if (/\/docs\/components\/[a-z0-9-]+$/.test(location.pathname)) {
    const ids = ["installation", "usage", "examples", "states", "api-reference"]
    const missing = ids.filter((id) => !document.getElementById(id))
    const examples = document.querySelectorAll("h3[id^=example-]").length
    const stage = document.querySelector("[data-stage]")
    const interactive = !!stage?.querySelector("button, input, select, textarea, a[href], [tabindex='0'], [role=slider], [role=switch], [role=tab]")
    out.sections = { missing, examples, interactive }
  }
  return out
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const wait = () => new Promise((r) => setTimeout(r, 50))
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo({ top: y, behavior: "instant" })
      await wait()
    }
    window.scrollTo({ top: 0, behavior: "instant" })
  })
}

async function checkRoute(context, route, width) {
  const page = await context.newPage()
  const errors = []
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)))
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)))
  try {
    await page.goto(url + route, { waitUntil: "networkidle", timeout: 45000 })
    await page.waitForTimeout(400)
    await scrollThrough(page)
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(300)
    const m = await page.evaluate(measure, { minText: MIN_TEXT, centre: CENTRE })
    if (m.blank) say(route, width, "blank page")
    if (m.loadError) say(route, width, `${m.loadError} part(s) did not load`)
    for (const e of [...new Set(errors)].filter((e) => !/api\.github\.com|Failed to load resource.*(github|stats)/.test(e))) say(route, width, `console: ${e}`)
    if (m.overflow > 1) say(route, width, `page ${m.overflow}px wider than the window`)
    for (const s of [...new Set(m.small)].slice(0, 6)) say(route, width, `text ${s}`)
    if (m.small.length > 6) say(route, width, `…and ${m.small.length - 6} more small texts`)
    for (const img of m.images) {
      const real = REAL[img.name]
      if (!real) continue
      const blown = (img.scale * img.file) / real.width
      if (blown > 1.02) say(route, width, `picture ${img.name} drawn at x${blown.toFixed(2)} of its real size (${img.alt})`)
      else if (img.scale > 1.02) say(route, width, `picture ${img.name}: file ${img.file}px drawn at x${img.scale.toFixed(2)} (a larger file exists)`)
    }
    for (const c of m.centring) say(route, width, `off-centre preview: ${c}`)
    if (m.sections && width === WIDTHS[WIDTHS.length - 1]) {
      const { missing, examples, interactive } = m.sections
      if (missing.length) say(route, width, `missing section(s): ${missing.join(", ")}`)
      if (interactive && examples < 3) say(route, width, `interactive component with ${examples} example(s), 3 needed`)
    }
  } catch (e) {
    say(route, width, `did not load: ${String(e).split("\n")[0]}`)
  } finally {
    await page.close()
  }
}

// warm-up
{
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: "networkidle" })
  await page.close()
}

const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4)
for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const queue = [...ROUTES]
  let done = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const route = queue.shift()
        await checkRoute(context, route, width)
        done++
        if (done % 25 === 0) process.stderr.write(`  ${width}px: ${done}/${ROUTES.length}\n`)
      }
    }),
  )
  await context.close()
}

// 8. old addresses
if (!process.env.ONLY) {
  const page = await browser.newPage()
  for (const [hash, route] of LEGACY) {
    await page.goto(url + hash, { waitUntil: "networkidle" })
    await page.waitForTimeout(200)
    const path = new URL(page.url()).pathname
    const want = new URL(url + route).pathname
    if (path.replace(/\/$/, "") !== want.replace(/\/$/, "")) problems.push(`old address ${hash} opened ${path}, expected ${want}`)
  }
  await page.close()
}
await browser.close()

console.log(problems.length ? problems.join("\n") : `${ROUTES.length} addresses at ${WIDTHS.join(" and ")} px: no problem`)
let failed = problems.length > 0
console.log(`${problems.length} problem(s)`)

// 7. the reader counter and the live thumbnails, against the same server
if (!process.env.ONLY) {
  for (const [script, args] of [
    ["scripts/check-reading.mjs", [url]],
    ["scripts/check-thumbs.mjs", [url + "docs/components"]],
  ]) {
    console.log(`\n$ node ${script}`)
    const run = spawnSync(process.execPath, [script, ...args], { stdio: "inherit" })
    if (run.status !== 0) failed = true
  }
}
await server?.close()
process.exit(failed ? 1 : 0)
