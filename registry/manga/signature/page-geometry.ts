/*
 * Manga page model: pure data and geometry, no React.
 *
 * A page is made of tiers (horizontal bands), each tier of cells: a panel, or a column that holds tiers
 * of its own. Every cut (between two tiers, or two cells) can slant. The layout is computed in page
 * units: a page is 100 units wide (200 for a double-page spread) and as tall as its format says.
 * Everything a page draws (lines, gutters, lettering) is measured in these units, so the page scales
 * as one block, like a picture.
 */

export type PageFormat = "pocket" | "magazine" | "square" | "strip"
export type FrameShape = "straight" | "tilted" | "jagged" | "cloud" | "memory"
export type Anchor =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right"

/** A point inside a panel, in percent of the panel's box (0 = left / top, 100 = right / bottom). */
export type PagePoint = { x: number; y: number }

type Placed = { x: number; y: number; anchor?: Anchor }
export type BubbleItem = Placed & {
  type: "bubble"
  text: string
  variant?: "speech" | "thought" | "shout" | "whisper" | "narration" | "electronic" | "wobbly"
  /** The point the tail aims at, in percent of the panel. Leave out for a bubble without a tail. */
  pointAt?: PagePoint
  /** Maximum width in percent of the panel. */
  maxWidth?: number
  align?: "start" | "center" | "end"
  seed?: number
}
export type SfxItem = Placed & {
  type: "sfx"
  text: string
  size?: "sm" | "md" | "lg" | "xl"
  rotate?: number
  variant?: "solid" | "outline"
  /** Spoken text for screen readers; without it the sound effect is decorative. */
  label?: string
}
export type CaptionItem = Placed & { type: "caption"; text: string; maxWidth?: number }
export type PageItem = BubbleItem | SfxItem | CaptionItem

export type TonedArtOptions = {
  pattern?: "dots" | "lines" | "cross" | "noise"
  density?: number
  contrast?: number
  threshold?: number
}
export type PanelArtData = {
  src: string
  alt: string
  /** Focal point, in percent of the picture (50 = centre). */
  x?: number
  y?: number
  /** 1 = the picture just covers the panel. */
  zoom?: number
  /** Turn the picture into a screentone (TonedImage). */
  toned?: boolean | TonedArtOptions
}

export type PanelData = {
  /** Share of the tier's width (default 1). */
  width?: number
  /** Slant of the cut after this panel, in page units: the top of the cut moves this far toward the end. */
  slant?: number
  /** Outline: straight, tilted, jagged (shock), cloud or memory (black borders). */
  shape?: FrameShape
  /** Tilt in degrees for shape "tilted" (default -2.5). */
  tilt?: number
  /** Sides that touch the page margin run off the page edge. */
  bleed?: boolean
  /** No outline. */
  frameless?: boolean
  /** Content may leave the frame (a figure breaking out). */
  overflow?: boolean
  /** Ink background, paper lines: night, flashback. */
  ink?: boolean
  /** Laid over the previous panel of the tier instead of taking room: box in percent of that panel. */
  inset?: { x: number; y: number; w: number; h: number }
  art?: PanelArtData
  items?: PageItem[]
  /** Accessible name of the panel (default "Panel n"). */
  label?: string
}
export type ColumnData = {
  width?: number
  slant?: number
  /** A column holds tiers of its own. */
  tiers: TierData[]
}
export type CellData = PanelData | ColumnData
export type TierData = {
  /** Share of the page height (default 1; in a strip, 1 = half the page width). */
  height?: number
  /** Slant of the cut below this tier, in page units: the end side goes down this far, the start side up. */
  slant?: number
  panels: CellData[]
}
export type PageData = {
  version?: 1
  format?: PageFormat
  /** A double-page spread: twice as wide. */
  spread?: boolean
  /** Panel order: left to right, or right to left (manga). */
  reading?: "ltr" | "rtl"
  /** Gutters in page units: x between panels of a tier, y between tiers (wider, as in print). */
  gutter?: { x?: number; y?: number }
  /** Page margin in page units (default from the format). */
  margin?: number
  /** Width of the frame lines in page units (default 0.55). */
  line?: number
  /** Scale of the lettering (bubbles, captions, sound effects); 1 by default. */
  lettering?: number
  tiers: TierData[]
}

export const isColumn = (c: CellData): c is ColumnData => Array.isArray((c as ColumnData).tiers)

export const PAGE_FORMATS: Record<PageFormat, { label: string; aspect: number | null; margin: { x: number; y: number } }> = {
  pocket: { label: "Pocket volume", aspect: 0.66, margin: { x: 6.5, y: 7.5 } },
  magazine: { label: "Magazine", aspect: 0.71, margin: { x: 5.5, y: 6 } },
  square: { label: "Square", aspect: 1, margin: { x: 5, y: 5 } },
  strip: { label: "Free strip", aspect: null, margin: { x: 4, y: 4 } },
}

export const DEFAULT_GUTTER = { x: 1.6, y: 3.4 }
export const DEFAULT_LINE = 0.55
/** In a strip, a tier of height 1 is this share of the inner width. */
const STRIP_UNIT = 0.55
const BLEED = 1.5

export type PageTemplate =
  | "three-tiers"
  | "big-plus-two"
  | "l-shape"
  | "diagonal"
  | "four-koma"
  | "spread"
  | "grid-six"
  | "splash"
  | "inset"
  | "columns"
  | "shock"
  | "flashback"

export const PAGE_TEMPLATES: Record<PageTemplate, { label: string; page: Omit<PageData, "format" | "reading"> }> = {
  "three-tiers": {
    label: "Three tiers",
    page: { tiers: [{ panels: [{ width: 1.25 }, {}] }, { panels: [{}] }, { panels: [{}, { width: 1.4 }] }] },
  },
  "big-plus-two": {
    label: "Big panel + 2",
    page: { tiers: [{ height: 2, panels: [{}] }, { panels: [{}, {}] }] },
  },
  "l-shape": {
    label: "L shape",
    page: {
      tiers: [
        { panels: [{}] },
        { height: 2, panels: [{ width: 1.1 }, { tiers: [{ panels: [{}] }, { panels: [{}] }] }] },
      ],
    },
  },
  diagonal: {
    label: "Action diagonal",
    page: {
      tiers: [
        { slant: 7, panels: [{ width: 1.3, slant: -6 }, {}] },
        { height: 1.3, slant: -7, panels: [{ slant: 9 }, { width: 1.2 }] },
        { panels: [{ slant: -6 }, { width: 1.3 }] },
      ],
    },
  },
  "four-koma": {
    label: "Four-panel strip",
    page: { tiers: [{ panels: [{}] }, { panels: [{}] }, { panels: [{}] }, { panels: [{}] }], gutter: { y: 2.6 } },
  },
  spread: {
    label: "Double page",
    page: {
      spread: true,
      tiers: [
        { panels: [{}, {}, {}, {}] },
        { height: 1.7, panels: [{ bleed: true }] },
        { panels: [{ width: 1.5 }, {}, {}, { width: 1.5 }] },
      ],
    },
  },
  "grid-six": {
    label: "Six panels",
    page: { tiers: [{ panels: [{}, {}] }, { panels: [{}, {}] }, { panels: [{}, {}] }] },
  },
  splash: {
    label: "Splash",
    page: { tiers: [{ panels: [{ bleed: true }, { inset: { x: 6, y: 66, w: 40, h: 26 } }] }] },
  },
  inset: {
    label: "Inset panels",
    page: {
      tiers: [
        { height: 2.2, panels: [{ bleed: true }, { inset: { x: 58, y: 7, w: 36, h: 30 } }] },
        { panels: [{}, { width: 1.3 }] },
      ],
    },
  },
  columns: {
    label: "Columns",
    page: { tiers: [{ panels: [{ slant: 5 }, { slant: -5 }, {}] }] },
  },
  shock: {
    label: "Shock",
    page: {
      tiers: [
        { panels: [{}, { width: 1.3 }] },
        { height: 1.6, panels: [{ shape: "jagged" }] },
        { panels: [{ width: 1.4 }, {}] },
      ],
    },
  },
  flashback: {
    label: "Flashback",
    page: {
      tiers: [
        { panels: [{ shape: "memory", ink: false }] },
        { height: 1.3, panels: [{ shape: "cloud" }, { shape: "memory" }] },
        { panels: [{}] },
      ],
    },
  },
}

/* ---------- geometry ---------- */

export type Pt = { x: number; y: number }
type Line = readonly [Pt, Pt]
type Outer = { top: boolean; bottom: boolean; left: boolean; right: boolean }
type Region = { top: Line; bottom: Line; left: Line; right: Line; outer: Outer }

export type Box = { x: number; y: number; w: number; h: number }

export type PanelGeometry = {
  /** Reading order (0 = first). */
  index: number
  /** Where the panel sits in the data: [tier, cell] or deeper through columns. */
  path: number[]
  /** The four corners (top-left, top-right, bottom-right, bottom-left before mirroring), in page units. */
  quad: Pt[]
  /** The outline drawn and clipped (follows the shape), in page units. */
  outline: Pt[]
  /** Bounding box of the quad, in page units. */
  box: Box
  /** The same box in percent of the page (what a zoom-by-panel reader needs). */
  rect: Box
  inset: boolean
  /** For an inset panel: the index of the panel it lies on. */
  host?: number
  data: PanelData
}
export type CutGeometry = {
  /** "tier": the cut below tier `path`; "cell": the cut after cell `path`. */
  kind: "tier" | "cell"
  path: number[]
  line: [Pt, Pt]
}
export type PageGeometry = {
  /** Page size in page units (width 100 per page). */
  width: number
  height: number
  line: number
  reading: "ltr" | "rtl"
  panels: PanelGeometry[]
  cuts: CutGeometry[]
}

const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y })
const mul = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k })
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
const len = (a: Pt) => Math.hypot(a.x, a.y)
const norm = (a: Pt): Pt => {
  const l = len(a) || 1
  return { x: a.x / l, y: a.y / l }
}
const pos = (v: number | undefined, d: number) => (typeof v === "number" && v > 0 && Number.isFinite(v) ? v : d)
const num = (v: number | undefined) => (typeof v === "number" && Number.isFinite(v) ? v : 0)

function intersect(l1: Line, l2: Line): Pt {
  const [p, p2] = l1
  const [q, q2] = l2
  const r = sub(p2, p)
  const s = sub(q2, q)
  const d = r.x * s.y - r.y * s.x
  if (Math.abs(d) < 1e-9) return p
  const t = ((q.x - p.x) * s.y - (q.y - p.y) * s.x) / d
  return { x: p.x + r.x * t, y: p.y + r.y * t }
}
const atY = ([a, b]: Line, y: number): Pt => (Math.abs(b.y - a.y) < 1e-9 ? { x: a.x, y } : { x: a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y), y })
const atX = ([a, b]: Line, x: number): Pt => (Math.abs(b.x - a.x) < 1e-9 ? { x, y: a.y } : { x, y: a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x) })
/** Moves a mostly horizontal line down by d, measured square to the line. */
function shiftY([a, b]: Line, d: number): Line {
  const dx = b.x - a.x
  const k = (d * Math.hypot(dx, b.y - a.y)) / (Math.abs(dx) || 1e-9)
  return [{ x: a.x, y: a.y + k }, { x: b.x, y: b.y + k }]
}
/** Moves a mostly vertical line right by d, measured square to the line. */
function shiftX([a, b]: Line, d: number): Line {
  const dy = b.y - a.y
  const k = (d * Math.hypot(b.x - a.x, dy)) / (Math.abs(dy) || 1e-9)
  return [{ x: a.x + k, y: a.y }, { x: b.x + k, y: b.y }]
}
function corners(r: Region) {
  return {
    tl: intersect(r.top, r.left),
    tr: intersect(r.top, r.right),
    br: intersect(r.bottom, r.right),
    bl: intersect(r.bottom, r.left),
  }
}
const centroid = (q: Pt[]) => mul(q.reduce(add, { x: 0, y: 0 }), 1 / q.length)

/** The polygon moved inward by d on every side (convex polygons). */
export function insetPolygon(q: Pt[], d: number): Pt[] {
  const c = centroid(q)
  const n = q.length
  const lines = q.map((a, i): Line => {
    const b = q[(i + 1) % n]
    const e = sub(b, a)
    let nn = norm({ x: -e.y, y: e.x })
    if ((c.x - (a.x + b.x) / 2) * nn.x + (c.y - (a.y + b.y) / 2) * nn.y < 0) nn = mul(nn, -1)
    return [add(a, mul(nn, d)), add(b, mul(nn, d))]
  })
  return q.map((_, i) => intersect(lines[(i - 1 + n) % n], lines[i]))
}

function rng(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

function outlineOf(p: PanelData, quad: Pt[], seed: number): Pt[] {
  switch (p.shape) {
    case "tilted": {
      const c = centroid(quad)
      const a = ((p.tilt ?? -2.5) * Math.PI) / 180
      const cos = Math.cos(a)
      const sin = Math.sin(a)
      return quad.map((v) => {
        const d = mul(sub(v, c), 0.93)
        return add(c, { x: d.x * cos - d.y * sin, y: d.x * sin + d.y * cos })
      })
    }
    case "jagged": {
      const rand = rng(seed + 1)
      const inner = insetPolygon(quad, 1.4)
      const out: Pt[] = []
      for (let i = 0; i < 4; i++) {
        const P = quad[i]
        const Q = quad[(i + 1) % 4]
        const P2 = inner[i]
        const Q2 = inner[(i + 1) % 4]
        const n = Math.max(3, Math.round(len(sub(Q, P)) / 2.8))
        for (let j = 0; j < n; j++) {
          out.push(lerp(P2, Q2, j / n))
          const t = (j + 0.5) / n
          out.push(lerp(lerp(P2, Q2, t), lerp(P, Q, t), 0.55 + rand() * 0.45))
        }
      }
      return out
    }
    case "cloud": {
      const a = 1.3
      const inner = insetPolygon(quad, a)
      const c = centroid(inner)
      const out: Pt[] = []
      for (let i = 0; i < 4; i++) {
        const P = inner[i]
        const Q = inner[(i + 1) % 4]
        const e = sub(Q, P)
        let nn = norm({ x: -e.y, y: e.x })
        if ((c.x - (P.x + Q.x) / 2) * nn.x + (c.y - (P.y + Q.y) / 2) * nn.y > 0) nn = mul(nn, -1)
        const n = Math.max(2, Math.round(len(e) / 5.5))
        for (let j = 0; j < n; j++)
          for (let s = 0; s < 8; s++) {
            const u = s / 8
            out.push(add(lerp(P, Q, (j + u) / n), mul(nn, a * Math.sin(Math.PI * u))))
          }
      }
      return out
    }
    default:
      return quad
  }
}

const bbox = (pts: Pt[]): Box => {
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

type Ctx = { W: number; H: number; gx: number; gy: number; panels: PanelGeometry[]; cuts: CutGeometry[] }

function emit(p: PanelData, quad: Pt[], path: number[], ctx: Ctx, inset: boolean, host?: number) {
  const g: PanelGeometry = {
    index: ctx.panels.length,
    path,
    quad,
    outline: outlineOf(p, quad, ctx.panels.length),
    box: bbox(quad),
    rect: { x: 0, y: 0, w: 0, h: 0 },
    inset,
    host,
    data: p,
  }
  ctx.panels.push(g)
  return g
}

function layoutTiers(tiers: TierData[], region: Region, ctx: Ctx, path: number[]) {
  const n = tiers.length
  if (!n) return
  const { tl, tr, br, bl } = corners(region)
  const hs = tiers.map((t) => pos(t.height, 1))
  const sum = hs.reduce((a, b) => a + b, 0)
  const { gy } = ctx
  const bounds: Line[] = []
  let acc = 0
  for (let k = 0; k < n - 1; k++) {
    acc += hs[k]
    const F = acc / sum
    const yl = tl.y + F * (bl.y - tl.y - (n - 1) * gy) + k * gy + gy / 2
    const yr = tr.y + F * (br.y - tr.y - (n - 1) * gy) + k * gy + gy / 2
    const s = num(tiers[k].slant)
    const line: Line = [atY(region.left, yl - s / 2), atY(region.right, yr + s / 2)]
    bounds.push(line)
    ctx.cuts.push({ kind: "tier", path: [...path, k], line: [line[0], line[1]] })
  }
  tiers.forEach((tier, k) => {
    const r: Region = {
      top: k === 0 ? region.top : shiftY(bounds[k - 1], gy / 2),
      bottom: k === n - 1 ? region.bottom : shiftY(bounds[k], -gy / 2),
      left: region.left,
      right: region.right,
      outer: { ...region.outer, top: k === 0 && region.outer.top, bottom: k === n - 1 && region.outer.bottom },
    }
    layoutCells(tier.panels ?? [], r, ctx, [...path, k])
  })
}

function layoutCells(cells: CellData[], region: Region, ctx: Ctx, path: number[]) {
  const flow = cells.map((c, i) => ({ c, i })).filter(({ c }) => isColumn(c) || !(c as PanelData).inset)
  const m = flow.length
  if (!m) return
  const { tl, tr, br, bl } = corners(region)
  const ws = flow.map(({ c }) => pos(c.width, 1))
  const sum = ws.reduce((a, b) => a + b, 0)
  const { gx } = ctx
  const bounds: Line[] = []
  let acc = 0
  for (let j = 0; j < m - 1; j++) {
    acc += ws[j]
    const F = acc / sum
    const xt = tl.x + F * (tr.x - tl.x - (m - 1) * gx) + j * gx + gx / 2
    const xb = bl.x + F * (br.x - bl.x - (m - 1) * gx) + j * gx + gx / 2
    const s = num(flow[j].c.slant)
    const line: Line = [atX(region.top, xt + s / 2), atX(region.bottom, xb - s / 2)]
    bounds.push(line)
    ctx.cuts.push({ kind: "cell", path: [...path, flow[j].i], line: [line[0], line[1]] })
  }
  const regionOf = (j: number): Region => ({
    top: region.top,
    bottom: region.bottom,
    left: j === 0 ? region.left : shiftX(bounds[j - 1], gx / 2),
    right: j === m - 1 ? region.right : shiftX(bounds[j], -gx / 2),
    outer: { ...region.outer, left: j === 0 && region.outer.left, right: j === m - 1 && region.outer.right },
  })
  let host: PanelGeometry | null = null
  let j = 0
  cells.forEach((c, i) => {
    if (isColumn(c)) {
      layoutTiers(c.tiers, regionOf(j++), ctx, [...path, i])
      host = ctx.panels[ctx.panels.length - 1] ?? null
      return
    }
    if (c.inset) {
      if (!host) return
      const b = host.box
      const { x, y, w, h } = c.inset
      const x0 = b.x + (b.w * num(x)) / 100
      const y0 = b.y + (b.h * num(y)) / 100
      const x1 = x0 + (b.w * pos(w, 30)) / 100
      const y1 = y0 + (b.h * pos(h, 30)) / 100
      emit(c, [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }], [...path, i], ctx, true, host.index)
      return
    }
    let r = regionOf(j++)
    if (c.bleed) {
      const { W, H } = ctx
      r = {
        ...r,
        top: r.outer.top ? [{ x: 0, y: -BLEED }, { x: 1, y: -BLEED }] : r.top,
        bottom: r.outer.bottom ? [{ x: 0, y: H + BLEED }, { x: 1, y: H + BLEED }] : r.bottom,
        left: r.outer.left ? [{ x: -BLEED, y: 0 }, { x: -BLEED, y: 1 }] : r.left,
        right: r.outer.right ? [{ x: W + BLEED, y: 0 }, { x: W + BLEED, y: 1 }] : r.right,
      }
    }
    const q = corners(r)
    host = emit(c, [q.tl, q.tr, q.br, q.bl], [...path, i], ctx, false)
  })
}

/** Page size in page units. */
export function pageSize(page: PageData) {
  const f = PAGE_FORMATS[page.format ?? "pocket"] ?? PAGE_FORMATS.pocket
  const W = page.spread ? 200 : 100
  const mx = page.margin ?? f.margin.x
  const my = page.margin ?? f.margin.y
  const gy = page.gutter?.y ?? DEFAULT_GUTTER.y
  let H: number
  if (f.aspect) H = 100 / f.aspect
  else {
    const tiers = page.tiers ?? []
    const inner = (W - 2 * mx) * STRIP_UNIT
    H = 2 * my + tiers.reduce((a, t) => a + pos(t.height, 1) * inner, 0) + Math.max(0, tiers.length - 1) * gy
  }
  return { W, H, mx, my }
}

/** Computes every panel and cut of a page, in page units, in reading order. */
export function pageGeometry(page: PageData): PageGeometry {
  const { W, H, mx, my } = pageSize(page)
  const ctx: Ctx = {
    W,
    H,
    gx: page.gutter?.x ?? DEFAULT_GUTTER.x,
    gy: page.gutter?.y ?? DEFAULT_GUTTER.y,
    panels: [],
    cuts: [],
  }
  const root: Region = {
    top: [{ x: mx, y: my }, { x: W - mx, y: my }],
    bottom: [{ x: mx, y: H - my }, { x: W - mx, y: H - my }],
    left: [{ x: mx, y: my }, { x: mx, y: H - my }],
    right: [{ x: W - mx, y: my }, { x: W - mx, y: H - my }],
    outer: { top: true, bottom: true, left: true, right: true },
  }
  layoutTiers(page.tiers ?? [], root, ctx, [])
  const reading = page.reading === "rtl" ? "rtl" : "ltr"
  const flip = (p: Pt): Pt => (reading === "rtl" ? { x: W - p.x, y: p.y } : p)
  for (const g of ctx.panels) {
    g.quad = g.quad.map(flip)
    g.outline = g.outline.map(flip)
    g.box = bbox(g.quad)
    g.rect = { x: (g.box.x / W) * 100, y: (g.box.y / H) * 100, w: (g.box.w / W) * 100, h: (g.box.h / H) * 100 }
  }
  for (const c of ctx.cuts) c.line = [flip(c.line[0]), flip(c.line[1])]
  return { width: W, height: H, line: page.line ?? DEFAULT_LINE, reading, panels: ctx.panels, cuts: ctx.cuts }
}

/** The page data of a template (a fresh copy you can edit). */
export function templatePage(name: PageTemplate, extra?: Partial<PageData>): PageData {
  const t = PAGE_TEMPLATES[name] ?? PAGE_TEMPLATES["three-tiers"]
  return { version: 1, format: "pocket", ...structuredClone(t.page), ...extra }
}

/** Every panel of a page in reading order, with its path (columns walked through). */
export function pagePanels(page: PageData): { panel: PanelData; path: number[] }[] {
  const out: { panel: PanelData; path: number[] }[] = []
  const walk = (tiers: TierData[], path: number[]) =>
    tiers.forEach((t, ti) =>
      (t.panels ?? []).forEach((c, ci) => (isColumn(c) ? walk(c.tiers, [...path, ti, ci]) : out.push({ panel: c, path: [...path, ti, ci] }))),
    )
  walk(page.tiers ?? [], [])
  return out
}
