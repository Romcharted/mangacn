/*
 * Demo pages for the reading pieces (PageReader, PageThumbnails, GuidedView…): a short chapter drawn in SVG
 * for this repo, "Lantern Street". A page is a scan: ink on paper in both themes. No existing work is drawn.
 */

export type DemoPage = { src: string; alt: string; width: number; height: number }

const INK = "#1f1b17"
const PAPER = "#f8f5ee"
export const PAGE_W = 600
export const PAGE_H = 900

const TONE = `<defs><pattern id="t" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="2" cy="2" r="1.3" fill="${INK}"/><circle cx="6" cy="6" r="1.3" fill="${INK}"/></pattern><pattern id="l" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><rect width="6" height="1.6" fill="${INK}"/></pattern></defs>`

const r1 = (n: number) => Math.round(n * 10) / 10

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

const svgUrl = (w: number, h: number, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${TONE}<rect width="${w}" height="${h}" fill="${PAPER}"/>${body}</svg>`,
  )}`

const frame = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="5"/>`

/** Clips `body` to a panel, then inks its frame. */
const panel = (id: string, x: number, y: number, w: number, h: number, body: string) =>
  `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${body}</g>${frame(x, y, w, h)}`

function focusLines(cx: number, cy: number, hole: number, count: number, seed: number) {
  const rand = rng(seed)
  let d = ""
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.05
    const w = 0.004 + rand() * 0.012
    const inner = hole * (1 + rand() * 0.45)
    d += `M${r1(cx + Math.cos(a - w) * 1200)} ${r1(cy + Math.sin(a - w) * 1200)}L${r1(cx + Math.cos(a) * inner)} ${r1(cy + Math.sin(a) * inner)}L${r1(cx + Math.cos(a + w) * 1200)} ${r1(cy + Math.sin(a + w) * 1200)}Z`
  }
  return `<path d="${d}" fill="${INK}"/>`
}

function speedLines(x: number, y: number, w: number, h: number, count: number, seed: number, angle = 0) {
  const rand = rng(seed)
  let out = ""
  for (let i = 0; i < count; i++) {
    const len = w * (0.25 + rand() * 0.6)
    out += `<rect x="${r1(x + rand() * (w - len))}" y="${r1(y + rand() * h)}" width="${r1(len)}" height="${r1(1 + rand() * 3)}" fill="${INK}"/>`
  }
  return angle ? `<g transform="rotate(${angle} ${x + w / 2} ${y + h / 2})">${out}</g>` : out
}

function rain(x: number, y: number, w: number, h: number, count: number, seed: number) {
  const rand = rng(seed)
  let d = ""
  for (let i = 0; i < count; i++) {
    const len = 14 + rand() * 26
    d += `M${r1(x + rand() * w)} ${r1(y + rand() * h)}l${r1(-len * 0.35)} ${r1(len)}`
  }
  return `<path d="${d}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`
}

/** Head and shoulders, 100 × 124 at scale 1. */
const bust = (x: number, y: number, s: number, fill = PAPER) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 124c4-40 22-58 44-58s40 18 44 58z" fill="${fill}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="36" r="26" fill="${fill}" stroke="${INK}" stroke-width="4"/><path d="M22 30c2-20 20-30 36-26 14 4 22 16 20 30-8-8-20-10-30-6-10 3-18 4-26 2z" fill="${INK}"/></g>`

/** A figure seen from behind, 100 × 124. */
const back = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M6 124c4-40 22-58 44-58s40 18 44 58z" fill="${INK}" stroke="${PAPER}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="36" r="26" fill="${INK}" stroke="${PAPER}" stroke-width="4"/></g>`

/** A paper lantern on a string, 60 × 110. */
const lantern = (x: number, y: number, s: number, lit = true) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M30 0v14" stroke="${INK}" stroke-width="3"/><rect x="14" y="14" width="32" height="8" fill="${INK}"/><ellipse cx="30" cy="56" rx="28" ry="34" fill="${lit ? PAPER : "url(#t)"}" stroke="${INK}" stroke-width="4"/><path d="M6 44h48M4 58h52M7 72h46" stroke="${INK}" stroke-width="2"/><rect x="14" y="88" width="32" height="8" fill="${INK}"/><path d="M30 96v14" stroke="${INK}" stroke-width="3"/></g>`

/** Rooftops along a baseline, 200 × 100. */
const roofs = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 100V58l20-16 20 16v-8l24-20 24 20v10h10V44l18-14 18 14v18h14V50l16-12 16 12v50z" fill="${INK}"/><path d="M14 66h6v8h-6zM56 54h6v8h-6zM104 58h6v8h-6zM150 64h6v8h-6zM176 60h6v8h-6z" fill="${PAPER}"/></g>`

/** An empty balloon with strokes for words (a scan carries no live text). */
const balloon = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number) =>
  `<path d="M${cx - 14} ${cy + ry - 6}L${tx} ${ty}L${cx + 10} ${cy + ry - 4}z" fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M${cx - 14} ${cy + ry - 9}h24" stroke="${PAPER}" stroke-width="5"/><path d="M${r1(cx - rx * 0.55)} ${cy - 8}h${r1(rx * 1.1)}M${r1(cx - rx * 0.4)} ${cy + 8}h${r1(rx * 0.8)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`

const moon = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAPER}" stroke="${INK}" stroke-width="5"/><circle cx="${r1(cx - r * 0.3)}" cy="${r1(cy - r * 0.2)}" r="${r1(r * 0.14)}" fill="url(#t)"/>`

const folio = (n: number) => `<text x="${PAGE_W / 2}" y="${PAGE_H - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${INK}">${n}</text>`

/** Panel geometry of a page, in page units (x, y, w, h). GuidedView reads it. */
export type DemoPanel = { x: number; y: number; w: number; h: number; alt: string }
type Drawn = { alt: string; body: string; panels: DemoPanel[] }

const P = (x: number, y: number, w: number, h: number, alt: string): DemoPanel => ({ x, y, w, h, alt })

function drawn(seed: number): Drawn[] {
  const k = seed * 11
  return [
    {
      alt: "Title page: “Lantern Street”, a paper lantern glowing at the centre of concentration lines.",
      panels: [P(16, 16, 568, 852, "Title page")],
      body:
        focusLines(300, 520, 170, 160, k + 1) +
        `<circle cx="300" cy="520" r="170" fill="${PAPER}"/>` +
        lantern(240, 410, 2) +
        `<rect x="60" y="60" width="480" height="140" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>` +
        `<text x="300" y="132" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="54" textLength="440" lengthAdjust="spacingAndGlyphs" fill="${INK}">LANTERN STREET</text>` +
        `<text x="300" y="178" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-size="24" letter-spacing="2" fill="${INK}">Chapter ${seed} · The night market</text>` +
        frame(16, 16, 568, 852),
    },
    {
      alt: "Three panels: rooftops under the moon, a street of lanterns, a girl looking up.",
      panels: [P(16, 16, 568, 300, "Rooftops under the moon"), P(16, 332, 276, 270, "A street of lanterns"), P(308, 332, 276, 270, "A girl looks up"), P(16, 618, 568, 250, "The crowd in the rain")],
      body:
        panel("a", 16, 16, 568, 300, `<rect x="16" y="16" width="568" height="170" fill="url(#t)"/>${moon(450, 100, 50)}${roofs(0, 170, 3)}`) +
        panel("b", 16, 332, 276, 270, `${lantern(40, 360, 1)}${lantern(120, 380, 0.9)}${lantern(196, 350, 1.1)}<path d="M16 540h276" stroke="${INK}" stroke-width="4"/>`) +
        panel("c", 308, 332, 276, 270, `${speedLines(308, 350, 276, 240, 14, k + 2, -70)}${bust(380, 440, 1.3)}`) +
        panel("d", 16, 618, 568, 250, `${rain(16, 618, 600, 250, 160, k + 3)}${back(90, 720, 1.1)}${back(250, 740, 1)}${back(420, 726, 1.1)}`),
    },
    {
      alt: "Two panels: a stall keeper speaks to her, then a close-up of a lantern with a crack.",
      panels: [P(16, 16, 568, 420, "The stall keeper speaks"), P(16, 452, 568, 416, "A cracked lantern")],
      body:
        panel("a", 16, 16, 568, 420, `<rect x="16" y="330" width="568" height="106" fill="url(#t)"/>${bust(60, 220, 1.6)}${bust(380, 220, 1.6, INK)}${balloon(220, 100, 130, 56, 170, 230)}`) +
        panel("b", 16, 452, 568, 416, `${focusLines(300, 660, 120, 110, k + 4)}<circle cx="300" cy="660" r="120" fill="${PAPER}"/>${lantern(240, 560, 2)}<path d="M290 640l14 22-10 18 12 20" fill="none" stroke="${INK}" stroke-width="4"/>`),
    },
    {
      alt: "A wide panel: the lanterns rise together into the sky.",
      panels: [P(16, 16, 568, 852, "The lanterns rise")],
      body: panel(
        "a",
        16,
        16,
        568,
        852,
        `<rect x="16" y="16" width="568" height="520" fill="url(#t)"/>${moon(140, 140, 60)}${lantern(330, 90, 0.8)}${lantern(420, 180, 0.9)}${lantern(250, 230, 1)}${lantern(380, 320, 1.1)}${roofs(0, 600, 3)}<rect x="16" y="700" width="568" height="168" fill="${INK}"/>${back(250, 600, 1.3)}`,
      ),
    },
    {
      alt: "Four panels: she runs, a hand reaches, a lantern slips, a gasp.",
      panels: [P(16, 16, 276, 400, "She runs"), P(308, 16, 276, 400, "A hand reaches"), P(16, 432, 568, 220, "The lantern slips"), P(16, 668, 568, 200, "A gasp")],
      body:
        panel("a", 16, 16, 276, 400, `${speedLines(16, 30, 276, 380, 30, k + 5)}${bust(80, 160, 1.2)}`) +
        panel("b", 308, 16, 276, 400, `${focusLines(446, 216, 60, 80, k + 6)}<path d="M360 330l60-80 16 8 10-30 14 6-6 30 20-20 10 10-40 50z" fill="${PAPER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`) +
        panel("c", 16, 432, 568, 220, `${speedLines(16, 440, 568, 200, 26, k + 7, 20)}${lantern(270, 470, 1.2)}`) +
        panel("d", 16, 668, 568, 200, `<rect x="16" y="668" width="568" height="200" fill="url(#l)"/><rect x="180" y="730" width="240" height="80" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><text x="300" y="786" text-anchor="middle" font-family="Impact, sans-serif" font-size="48" fill="${INK}">AH!</text>`),
    },
    {
      alt: "A splash page: the lantern bursts into light over the street.",
      panels: [P(16, 16, 568, 852, "The lantern bursts into light")],
      body: panel("a", 16, 16, 568, 852, `${focusLines(300, 420, 200, 140, k + 8)}<circle cx="300" cy="420" r="200" fill="${PAPER}"/>${lantern(220, 280, 2.6)}${roofs(0, 720, 3)}`),
    },
    {
      alt: "Three panels: silence, the keeper smiles, she holds the mended lantern.",
      panels: [P(16, 16, 568, 240, "Silence"), P(16, 272, 568, 300, "The keeper smiles"), P(16, 588, 568, 280, "The mended lantern")],
      body:
        panel("a", 16, 16, 568, 240, `<rect x="16" y="16" width="568" height="240" fill="url(#t)"/>${roofs(40, 120, 2.6)}`) +
        panel("b", 16, 272, 568, 300, `${bust(220, 330, 1.8, INK)}${balloon(140, 330, 90, 40, 210, 400)}`) +
        panel("c", 16, 588, 568, 280, `${bust(120, 640, 1.6)}${lantern(330, 620, 1.9)}`),
    },
    {
      alt: "The last page: she walks home under one lantern; the street goes dark behind her.",
      panels: [P(16, 16, 568, 560, "Walking home"), P(16, 592, 568, 276, "The street goes dark")],
      body:
        panel("a", 16, 16, 568, 560, `<rect x="16" y="16" width="568" height="300" fill="url(#t)"/>${moon(460, 120, 56)}${roofs(0, 330, 3)}${back(260, 420, 1.2)}${lantern(330, 360, 0.8)}`) +
        panel("b", 16, 592, 568, 276, `<rect x="16" y="592" width="568" height="276" fill="${INK}"/>${lantern(270, 640, 1.4)}`),
    },
  ]
}

export type DemoChapterPage = DemoPage & { panels: DemoPanel[] }

/** The eight pages of chapter `n` (the number moves the lines a little). */
export function chapterPages(n = 1): DemoChapterPage[] {
  return drawn(n).map((p, i) => ({ src: svgUrl(PAGE_W, PAGE_H, p.body + folio(i + 1)), alt: p.alt, width: PAGE_W, height: PAGE_H, panels: p.panels }))
}

/** A 2:3 cover drawn as an SVG URL, varied by `seed`. */
export function coverUrl(seed: number, title = "") {
  const rand = rng(seed * 7 + 3)
  const W = 400
  const H = 600
  const shapes = [
    `${focusLines(200, 300, 90, 90, seed)}<circle cx="200" cy="300" r="90" fill="${PAPER}" stroke="${INK}" stroke-width="6"/>`,
    `<rect width="${W}" height="${H}" fill="url(#t)"/>${moon(280, 160, 70)}${roofs(0, 380, 2)}`,
    `${speedLines(0, 80, W, 440, 40, seed, -20)}${bust(120, 220, 1.6)}`,
    `<rect width="${W}" height="${H}" fill="${INK}"/>${lantern(150, 160, 1.8)}`,
    `<rect y="300" width="${W}" height="300" fill="url(#l)"/>${back(140, 300, 1.4)}`,
  ]
  const art = shapes[Math.floor(rand() * shapes.length)]
  const label = title
    ? `<rect x="24" y="24" width="352" height="72" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><text x="200" y="74" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="36" textLength="320" lengthAdjust="spacingAndGlyphs" fill="${INK}">${title.toUpperCase()}</text>`
    : ""
  return svgUrl(W, H, art + label + frame(3, 3, W - 6, H - 6))
}
