import { useState } from "react"
import { Tile, Tiles } from "../state-grid"
import { ReaderEnd, ReaderPage, ReaderStrip, type ReaderStripPage } from "@registry/manga/signature/reader-strip"
import { ReadingProgress } from "@registry/manga/signature/reading-progress"

/* Pages drawn for this repo as SVG data URLs (a page is a scan: ink on paper in both themes). */
const INK = "#1f1b17"
const PAPER = "#f8f5ee"

const page = (w: number, h: number, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${PAPER}"/>${body}</svg>`,
  )}`

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}
const r1 = (n: number) => Math.round(n * 10) / 10

/** Concentration lines: thin wedges from far away toward a clear circle. */
function focusLines(cx: number, cy: number, hole: number, count: number, seed: number) {
  const rand = rng(seed)
  let d = ""
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.05
    const w = 0.004 + rand() * 0.012
    const inner = hole * (1 + rand() * 0.5)
    const far = 900
    d += `M${r1(cx + Math.cos(a - w) * far)} ${r1(cy + Math.sin(a - w) * far)}L${r1(cx + Math.cos(a) * inner)} ${r1(cy + Math.sin(a) * inner)}L${r1(cx + Math.cos(a + w) * far)} ${r1(cy + Math.sin(a + w) * far)}Z`
  }
  return `<path d="${d}" fill="${INK}"/>`
}

/** Speed lines: horizontal strokes of random length and weight inside a box. */
function speedLines(x: number, y: number, w: number, h: number, count: number, seed: number) {
  const rand = rng(seed)
  let out = ""
  for (let i = 0; i < count; i++) {
    const len = w * (0.25 + rand() * 0.6)
    const x0 = x + rand() * (w - len)
    out += `<rect x="${r1(x0)}" y="${r1(y + rand() * h)}" width="${r1(len)}" height="${r1(1 + rand() * 3)}" fill="${INK}"/>`
  }
  return out
}

const frame = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="5"/>`

const figure = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M100 18c22 0 38 17 38 40 0 16-7 29-17 36l3 10c26 6 46 20 54 56H22c8-36 28-50 54-56l3-10c-10-7-17-20-17-36 0-23 16-40 38-40z" fill="${PAPER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M62 56c4-26 26-40 48-38 22 2 34 20 30 40-10-14-26-18-40-14-14 4-26 6-38 12z" fill="${INK}"/></g>`

const skyline = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 100V62h18V48h14v14h10V36h20v26h8V54h16v-8h6v8h10V40l12-8 12 8v22h10V50h18v-6h12v18h10v-8h14v46z" fill="${INK}"/><path d="M24 58h4v4h-4zM50 44h4v4h-4zM50 54h4v4h-4zM112 46h4v4h-4zM124 52h4v4h-4zM164 56h4v4h-4z" fill="${PAPER}"/></g>`

const runner = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="74" cy="22" r="11" fill="${INK}"/><path d="M70 36 52 64l-22 4M62 50l20 10 14-8M52 64l16 20-6 26M52 64l-14 22-20 6" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>`

const eyes = (x: number, y: number, s: number) => {
  const eye = (cx: number) =>
    `<path d="M${cx - 34} 50c14-20 54-20 68 0-14 20-54 20-68 0z" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="50" r="13" fill="${INK}"/><circle cx="${cx + 4}" cy="45" r="4" fill="${PAPER}"/><path d="M${cx - 36} 28c18-10 50-10 70 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
  return `<g transform="translate(${x} ${y}) scale(${s})">${eye(56)}${eye(144)}</g>`
}

const burst = (cx: number, cy: number, r: number, seed: number) => {
  const rand = rng(seed)
  const pts: string[] = []
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const rr = i % 2 ? r * (0.55 + rand() * 0.1) : r * (0.9 + rand() * 0.2)
    pts.push(`${r1(cx + Math.cos(a) * rr)},${r1(cy + Math.sin(a) * rr)}`)
  }
  return `<polygon points="${pts.join(" ")}" fill="${INK}"/>`
}

const P1: ReaderStripPage = {
  src: page(480, 640, `${focusLines(240, 300, 150, 150, 7)}${figure(80, 384, 1.6)}${frame(12, 12, 456, 616)}`),
  alt: "A figure stands still at the centre of concentration lines.",
  width: 480,
  height: 640,
}
const P2: ReaderStripPage = {
  src: page(
    480,
    420,
    `<circle cx="360" cy="96" r="42" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>${speedLines(30, 40, 260, 120, 10, 3)}${skyline(0, 180, 2.4)}${frame(12, 12, 456, 396)}`,
  ),
  alt: "A city skyline at night under a round moon.",
  width: 480,
  height: 420,
}
const P3: ReaderStripPage = {
  src: page(
    480,
    720,
    `${speedLines(20, 30, 440, 270, 46, 11)}${runner(150, 40, 2.2)}${frame(12, 12, 456, 316)}${focusLines(240, 520, 70, 110, 5)}${burst(240, 520, 64, 9)}${frame(12, 344, 456, 364)}`,
  ),
  alt: "Two panels: a figure runs through speed lines, then a burst of impact.",
  width: 480,
  height: 720,
}
const P4_FIXED: ReaderStripPage = {
  src: page(480, 560, `${focusLines(240, 280, 180, 120, 13)}<rect x="40" y="200" width="400" height="160" fill="${PAPER}"/>${eyes(40, 180, 2)}${frame(12, 12, 456, 536)}`),
  alt: "A close-up of two wide-open eyes.",
  width: 480,
  height: 560,
}
const P4_BROKEN: ReaderStripPage = { ...P4_FIXED, src: "data:image/png;base64,broken" }
const P5: ReaderStripPage = {
  src: page(480, 600, `${burst(240, 300, 220, 21)}${burst(240, 300, 150, 4).replace(INK, PAPER)}${figure(140, 230, 1)}${frame(12, 12, 456, 576)}`),
  alt: "A small figure inside a huge burst.",
  width: 480,
  height: 600,
}
const P6: ReaderStripPage = {
  src: page(
    480,
    640,
    `<circle cx="330" cy="130" r="56" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>${skyline(0, 260, 2.4)}<rect x="0" y="500" width="480" height="140" fill="${INK}"/>${figure(150, 420, 0.9).replace(`fill="${PAPER}" stroke`, `fill="${INK}" stroke`)}${frame(12, 12, 456, 616)}`,
  ),
  alt: "A figure, seen from behind, looks at the city and the moon.",
  width: 480,
  height: 640,
}

const CHAPTER = [P1, P2, P3, P4_BROKEN, P5, P6]

export function Preview() {
  const [pages, setPages] = useState(CHAPTER)
  const [at, setAt] = useState({ ratio: 0, index: 0 })
  const [ended, setEnded] = useState(false)
  return (
    <div className="grid gap-4">
      <p className="max-w-prose text-sm">
        Scroll the page: the strip follows it. Page 4 fails on purpose; Retry loads it.
      </p>
      <ReaderStrip
        aria-label="Chapter 12, Night Run"
        pages={pages}
        gap="md"
        onProgress={(ratio, index) => setAt({ ratio, index })}
        onEnd={() => setEnded(true)}
        onRetry={(i) => setPages((list) => list.map((p, j) => (j === i ? P4_FIXED : p)))}
      />
      <div className="sticky bottom-3 z-10 max-md:bottom-[4.25rem] mx-auto grid w-full max-w-[30rem] gap-1 border-ink bg-background px-3 py-2">
        <span className="font-letter text-sm tracking-wide uppercase">{ended ? "Chapter read" : "Night Run · ch. 12"}</span>
        <ReadingProgress
          value={Math.round(at.ratio * 100)}
          label="Chapter progress"
          showValue
          valueText={`Page ${at.index + 1} / ${pages.length}`}
        />
      </div>
    </div>
  )
}

const small = (p: ReaderStripPage): ReaderStripPage => ({ ...p, width: 180, height: Math.round((180 * p.height) / p.width) })

export function States() {
  return (
    <Tiles>
      <Tile label="page · loading" size="lg">
        <ReaderPage page={small(P2)} index={1} count={6} status="loading" className="w-full max-w-44" />
      </Tile>
      <Tile label="page · error" size="lg">
        <ReaderPage page={small(P4_BROKEN)} index={3} count={6} status="error" className="w-full max-w-44" />
      </Tile>
      <Tile label="page · loaded" size="lg">
        <ReaderPage page={small(P2)} index={1} count={6} status="loaded" className="w-full max-w-44" />
      </Tile>
      <Tile label="end" size="lg">
        <ReaderEnd className="w-full max-w-56 py-6" />
      </Tile>
      <Tile label="gap · none (no frame)" size="lg">
        <div className="grid w-full max-w-44">
          <ReaderPage page={small(P2)} index={1} count={6} framed={false} status="loaded" />
          <ReaderPage page={small(P2)} index={2} count={6} framed={false} status="loaded" />
        </div>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  const wide = (p: ReaderStripPage): ReaderStripPage => ({ ...p, width: 480, height: 200 })
  return (
    <div aria-hidden className="grid w-36 gap-1.5">
      <ReaderPage page={wide(P2)} index={0} count={2} status="loaded" />
      <ReaderPage page={wide(P3)} index={1} count={2} status="loaded" />
    </div>
  )
}
