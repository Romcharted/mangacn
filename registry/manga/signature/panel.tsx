"use client"

import * as React from "react"
import { cn } from "cn"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { Sfx } from "@/components/manga/sfx"
import { TonedImage } from "@/components/manga/toned-image"
import {
  PAGE_FORMATS,
  PAGE_TEMPLATES,
  insetPolygon,
  pageGeometry,
  pagePanels,
  templatePage,
  type Anchor,
  type Box,
  type CellData,
  type ColumnData,
  type FrameShape,
  type PageData,
  type PageFormat,
  type PageGeometry,
  type PageItem,
  type PageTemplate,
  type PanelArtData,
  type PanelData,
  type PanelGeometry,
  type Pt,
  type TierData,
  type TonedArtOptions,
} from "@/components/manga/page-geometry"

/*
 * The manga page.
 *
 * Page is a book page: a fixed format that keeps its proportions and scales as one block, like a picture.
 * It is made of Tiers (bands), each of Panels (or Columns of tiers); every cut can slant. Everything
 * inside (lines, gutters, bubbles, sound effects) is sized in container units of the page, so a page
 * reads the same at any width. Under 480px the page folds into a vertical strip, one panel per row.
 *
 * The same page can be written in JSX or given as data (the `page` prop, PageData): see page-geometry.
 * The order of panels in the code is the reading order; in manga order (reading="rtl") they are laid
 * out right to left. Text stays real text.
 */

export type {
  Anchor,
  CellData,
  ColumnData,
  FrameShape,
  PageData,
  PageFormat,
  PageGeometry,
  PageItem,
  PageTemplate,
  PanelArtData,
  PanelData,
  PanelGeometry,
  TierData,
}
export { PAGE_FORMATS, PAGE_TEMPLATES, pageGeometry, pagePanels, templatePage }

const f = (n: number) => Math.round(n * 1000) / 1000
const pc = (v: number, of: number) => `${f((v / (of || 1)) * 100)}%`
const css = (v: number | string | undefined, d: string) => (v === undefined ? d : typeof v === "number" ? `${v}%` : v)

const bboxOf = (pts: Pt[]): Box => {
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}
const union = (a: Box, b: Box): Box => {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y }
}
const grow = (b: Box, d: number): Box => ({ x: b.x - d, y: b.y - d, w: b.w + 2 * d, h: b.h + 2 * d })

/** Sizes inside a page, all from one page unit (1/100 of a page width). */
function unitVars(pu: string, fold: boolean, lettering = 1): React.CSSProperties {
  // Folded on a phone, lettering keeps a readable floor.
  const at = (n: number, min: string) => {
    const k = Math.round(n * lettering * 1000) / 1000
    return fold ? `max(${min}, calc(${pu} * ${k}))` : `calc(${pu} * ${k})`
  }
  return {
    "--pu": pu,
    "--bubble-size": at(2.3, "0.875rem"),
    "--caption-size": at(1.9, "0.75rem"),
    "--sfx-sm": at(4.5, "1.25rem"),
    "--sfx-md": at(6.5, "1.75rem"),
    "--sfx-lg": at(9, "2.25rem"),
    "--sfx-xl": at(13, "3rem"),
    "--page-fine": `max(1px, calc(${pu} * 0.3))`,
    // folded, a placed bubble may grow wider than its share of a small panel
    ...(fold ? { "--place-min": "9.5rem" } : {}),
  } as React.CSSProperties
}

/* ---------- descriptors: Tier, Column, Panel ---------- */

export type TierProps = {
  /** Share of the page height (default 1). */
  height?: number
  /** Slant of the cut below this tier, in page units. */
  slant?: number
  children?: React.ReactNode
}
/** A band of panels. Only meaningful inside a Page. */
function Tier({ children }: TierProps) {
  return <>{children}</>
}

export type ColumnProps = {
  /** Share of the tier width (default 1). */
  width?: number
  /** Slant of the cut after this column, in page units. */
  slant?: number
  /** Tiers stacked inside the column. */
  children?: React.ReactNode
}
/** A cell of a tier that holds tiers of its own (a tall panel beside two stacked ones). */
function Column({ children }: ColumnProps) {
  return <>{children}</>
}

export type PanelProps = React.ComponentProps<"div"> &
  Omit<PanelData, "items" | "art"> & {
    /** Old grid (PanelGrid): cells covered. */
    colSpan?: number
    rowSpan?: number
    /**
     * Old grid (PanelGrid): cuts one side on a slant (size in px, default 32). In a Page, use `slant`.
     */
    cut?: { side: "start" | "end"; size?: number }
    /** Picture of the panel, as data (or put a PanelArt inside). */
    art?: PanelArtData
    /** Bubbles, sound effects and captions, as data (or put Place elements inside). */
    items?: PageItem[]
  }

type PanelNode = PanelData & { content?: React.ReactNode; className?: string; style?: React.CSSProperties }
type ColumnNode = ColumnData & { tiers: TierNode[] }
type TierNode = TierData & { panels: (PanelNode | ColumnNode)[] }
type CellLike = PanelNode | ColumnNode

function flatten(children: React.ReactNode): React.ReactElement[] {
  return React.Children.toArray(children).flatMap((c) =>
    React.isValidElement(c)
      ? c.type === React.Fragment
        ? flatten((c.props as { children?: React.ReactNode }).children)
        : [c]
      : [],
  )
}

const PANEL_KEYS = ["width", "slant", "shape", "tilt", "bleed", "frameless", "overflow", "ink", "inset", "foldRatio", "art", "items", "label"] as const

function panelNode(props: PanelProps): PanelNode {
  const node: PanelNode = { content: props.children, className: props.className, style: props.style }
  for (const k of PANEL_KEYS) if (props[k] !== undefined) (node as Record<string, unknown>)[k] = props[k]
  return node
}

function parseCells(children: React.ReactNode): (PanelNode | ColumnNode)[] {
  return flatten(children).flatMap((el): CellLike[] => {
    if (el.type === Panel) return [panelNode(el.props as PanelProps)]
    if (el.type === Column) {
      const p = el.props as ColumnProps
      return [{ width: p.width, slant: p.slant, tiers: parseTiers(p.children) }]
    }
    return []
  })
}

function parseTiers(children: React.ReactNode): TierNode[] {
  return flatten(children).flatMap((el): TierNode[] => {
    if (el.type === Tier) {
      const p = el.props as TierProps
      return [{ height: p.height, slant: p.slant, panels: parseCells(p.children) }]
    }
    if (el.type === Panel) return [{ panels: [panelNode(el.props as PanelProps)] }]
    return []
  })
}

/** Fills the panels of `base` in reading order with the given panels (their props win). */
function fillSlots(base: PageData, panels: PanelNode[]): PageData {
  const page = structuredClone(base) as PageData
  const slots = pagePanels(page)
  panels.forEach((p, i) => {
    if (slots[i]) Object.assign(slots[i].panel, p)
    else page.tiers.push({ panels: [p] })
  })
  return page
}

/* ---------- Page ---------- */

export type PageProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The page as data (same structure as the JSX). Panels given as children fill its panels in order. */
  page?: PageData
  /** A ready layout; panels given as children fill it in order. */
  template?: PageTemplate
  /** pocket (default) · magazine · square · strip (free height). */
  format?: PageFormat
  /** Panel order. Defaults to the page data, then to data-reading on an ancestor. */
  reading?: "ltr" | "rtl"
  /** A double-page spread. */
  spread?: boolean
  /** Gutters in page units (a page is 100 units wide). */
  gutter?: { x?: number; y?: number }
  /** Page margin in page units. */
  margin?: number
  /** Width of the frame lines in page units (default 0.55). */
  line?: number
  /** Scale of the lettering (bubbles, captions, sound effects); 1 by default. */
  lettering?: number
  /** Fold into a vertical strip: under 480px (auto, default), always or never. */
  fold?: "auto" | "always" | "never"
  /** Called with the geometry of every panel (position and size, in page units and in percent). */
  onGeometry?: (geometry: PageGeometry) => void
  /** Accessible name of the page. */
  label?: string
  children?: React.ReactNode
}

const FOLD_BELOW = 480

function useReading(ref: React.RefObject<HTMLElement | null>, own: "ltr" | "rtl" | undefined) {
  const [found, setFound] = React.useState<"ltr" | "rtl">("ltr")
  React.useLayoutEffect(() => {
    if (own) return
    const read = () => setFound(ref.current?.closest("[data-reading]")?.getAttribute("data-reading") === "rtl" ? "rtl" : "ltr")
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-reading"] })
    return () => mo.disconnect()
  }, [own, ref])
  return own ?? found
}

function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return w
}

/**
 * A manga page: tiers of panels in a fixed format. Write it in JSX (Tier, Panel, Column) or pass the
 * same structure as data (`page`), or pick a `template` and fill its panels.
 */
function Page({
  page,
  template,
  format,
  reading,
  spread,
  gutter,
  margin,
  line,
  lettering,
  fold = "auto",
  onGeometry,
  label,
  className,
  style,
  children,
  ...props
}: PageProps) {
  const outer = React.useRef<HTMLDivElement>(null)
  const width = useWidth(outer)
  const base = page ?? (template ? templatePage(template) : null)
  const tiers = base ? null : parseTiers(children)
  const data: PageData = base
    ? fillSlots(base, flatten(children).filter((el) => el.type === Panel).map((el) => panelNode(el.props as PanelProps)))
    : { tiers: tiers ?? [] }
  const dir = useReading(outer, reading ?? (data.reading as "ltr" | "rtl" | undefined))
  const resolved: PageData = {
    ...data,
    format: format ?? data.format,
    spread: spread ?? data.spread,
    gutter: gutter ?? data.gutter,
    margin: margin ?? data.margin,
    line: line ?? data.line,
    lettering: lettering ?? data.lettering,
    reading: dir,
  }
  const geometry = pageGeometry(resolved)
  const key = JSON.stringify(resolved, (k, v) => (k === "content" || k === "className" || k === "style" ? undefined : v))
  const report = React.useRef(onGeometry)
  report.current = onGeometry
  React.useEffect(() => {
    report.current?.(geometry)
    // the geometry only changes with the page structure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const folded = fold === "always" || (fold === "auto" && width > 0 && width < FOLD_BELOW)
  const { width: W, height: H } = geometry
  return (
    <div
      ref={outer}
      data-manga="page"
      data-format={resolved.format ?? "pocket"}
      data-page-reading={dir}
      data-folded={folded || undefined}
      role="group"
      aria-roledescription="manga page"
      aria-label={label ?? "Manga page"}
      className={cn("relative w-full [container-type:inline-size]", className)}
      style={style}
      {...props}
    >
      {folded ? (
        <Folded.Provider value>
        <div className="grid gap-3">
          {geometry.panels
            .filter((g) => g.host === undefined)
            .map((g) => {
              // an inset panel stays on its host, in the host's own frame
              const st = standalone(g)
              const k = st.box.h / g.box.h
              const insets = geometry.panels.filter((i) => i.host === g.index).map((i) => stretch(i, g.box.y, k))
              const space = grow(union(st.box, bboxOf(st.outline)), 1.2)
              return (
                <div key={g.index} className="[container-type:inline-size]">
                  <div
                    className="relative isolate w-full overflow-hidden bg-background text-foreground"
                    style={{ aspectRatio: `${f(space.w)} / ${f(space.h)}`, ...unitVars(`calc(100cqw / ${f(space.w)})`, true, resolved.lettering) }}
                  >
                    <PanelView g={st} space={space} line={geometry.line} />
                    {insets.map((i) => (
                      <PanelView key={i.index} g={i} space={space} line={geometry.line} />
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
        </Folded.Provider>
      ) : (
        <div
          className="relative isolate w-full overflow-hidden bg-background text-foreground"
          style={{ aspectRatio: `${f(W)} / ${f(H)}`, ...unitVars(`calc(100cqw / ${W})`, false, resolved.lettering) }}
        >
          {geometry.panels.map((g) => (
            <PanelView key={g.index} g={g} space={{ x: 0, y: 0, w: W, h: H }} line={geometry.line} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Folded: a very wide panel gets taller (its art is re-cropped), so its lettering stays readable. */
function standalone(g: PanelGeometry): PanelGeometry {
  const ratio = g.box.w / g.box.h
  const most = (g.data as PanelNode).foldRatio ?? 1.7
  return ratio > most ? stretch(g, g.box.y, ratio / most) : g
}

/** True inside a page folded into a strip: Place then uses its `fold` placement when it has one. */
const Folded = React.createContext(false)
function stretch(g: PanelGeometry, y0: number, k: number): PanelGeometry {
  if (k === 1) return g
  const s = (p: Pt): Pt => ({ x: p.x, y: y0 + (p.y - y0) * k })
  return { ...g, quad: g.quad.map(s), outline: g.outline.map(s), box: { ...g.box, y: y0 + (g.box.y - y0) * k, h: g.box.h * k } }
}

const PanelBox = React.createContext<{ units: number } | null>(null)

/** One panel: a paper fill clipped to its outline, the content, the frame, then what floats over it. */
function PanelView({ g, space, line }: { g: PanelGeometry; space: Box; line: number }) {
  const p = g.data as PanelNode
  const fill = union(g.box, bboxOf(g.outline))
  const inBox = (b: Box) => ({ left: pc(b.x - g.box.x, g.box.w), top: pc(b.y - g.box.y, g.box.h), width: pc(b.w, g.box.w), height: pc(b.h, g.box.h) })
  const inFill = (b: Box) => ({ left: pc(b.x - fill.x, fill.w), top: pc(b.y - fill.y, fill.h), width: pc(b.w, fill.w), height: pc(b.h, fill.h) })
  const clip = `polygon(${g.outline.map((v) => `${pc(v.x - fill.x, fill.w)} ${pc(v.y - fill.y, fill.h)}`).join(", ")})`
  const z = g.inset ? 4 : 1
  const free: React.ReactNode[] = []
  const held: React.ReactNode[] = []
  for (const c of React.Children.toArray(p.content)) {
    if (React.isValidElement(c) && c.type === Place && !(c.props as PlaceProps).clip) free.push(c)
    else held.push(c)
  }
  const inkVars = p.ink ? "bg-foreground text-background [--tone-ink:var(--background)] [--tone-paper:var(--foreground)]" : "bg-background text-foreground"
  const points = (pts: Pt[]) => pts.map((v) => `${f(v.x)},${f(v.y)}`).join(" ")
  const shape = p.shape ?? "straight"
  return (
    <div
      role="group"
      aria-roledescription="panel"
      aria-label={p.label ?? `Panel ${g.index + 1}`}
      data-manga="panel"
      data-panel-index={g.index}
      data-shape={shape}
      data-inset={g.inset || undefined}
      className="absolute"
      style={{ left: pc(g.box.x - space.x, space.w), top: pc(g.box.y - space.y, space.h), width: pc(g.box.w, space.w), height: pc(g.box.h, space.h) }}
    >
      <PanelBox.Provider value={{ units: g.box.w }}>
        {/* paper (or ink) inside the outline */}
        <div aria-hidden className={cn("absolute", inkVars)} style={{ ...inBox(fill), clipPath: clip, zIndex: z }} />
        {/* the art and anything held inside the frame */}
        <div
          data-panel-content
          className={cn("absolute", p.ink && "text-background [--tone-ink:var(--background)] [--tone-paper:var(--foreground)]")}
          style={{ ...inBox(fill), clipPath: p.overflow ? undefined : clip, zIndex: p.overflow ? z + 2 : z }}
        >
          <div className={cn("absolute", p.className)} style={{ ...inFill(g.box), ...p.style }}>
            {p.art && <PanelArt {...p.art} />}
            {held}
          </div>
        </div>
        {/* the frame, drawn over the art */}
        {!p.frameless && (
          <svg
            aria-hidden
            viewBox={`${f(fill.x)} ${f(fill.y)} ${f(fill.w)} ${f(fill.h)}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute overflow-visible"
            style={{ ...inBox(fill), zIndex: z + 1 }}
          >
            {shape === "memory" ? (
              <path
                d={`M${points(g.outline).replaceAll(" ", " L")} Z M${points(insetPolygon(g.outline, 1.6)).replaceAll(" ", " L")} Z`}
                fillRule="evenodd"
                fill="var(--foreground)"
                stroke="var(--foreground)"
                strokeWidth={line}
              />
            ) : (
              <polygon
                points={points(g.outline)}
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={line}
                strokeLinejoin={shape === "cloud" ? "round" : "miter"}
              />
            )}
          </svg>
        )}
        {/* bubbles, sound effects and captions may cross the frame */}
        {(free.length > 0 || (p.items?.length ?? 0) > 0) && (
          <div data-panel-over className="pointer-events-none absolute inset-0" style={{ zIndex: 10 }}>
            {free}
            {p.items?.map((item, i) => <PageItemView key={i} item={item} />)}
          </div>
        )}
      </PanelBox.Provider>
    </div>
  )
}

function PageItemView({ item }: { item: PageItem }) {
  const folded = React.useContext(Folded)
  const fold = item.fold && { ...item.fold, maxWidth: item.fold.maxWidth === undefined ? undefined : `${item.fold.maxWidth}%` }
  const at = { x: item.x, y: item.y, anchor: item.anchor ?? ("center" as Anchor), fold }
  if (item.type === "bubble")
    return (
      <Place {...at} maxWidth={`${item.maxWidth ?? 46}%`}>
        <SpeechBubble
          variant={item.variant}
          pointAt={(folded && item.fold?.pointAt) || item.pointAt}
          tail={item.pointAt ? undefined : "none"} align={item.align} seed={item.seed}>
          <span className="whitespace-pre-line">{item.text}</span>
        </SpeechBubble>
      </Place>
    )
  if (item.type === "sfx")
    return (
      <Place {...at} maxWidth="none">
        <Sfx size={item.size} rotate={item.rotate} variant={item.variant} label={item.label}>
          {item.text}
        </Sfx>
      </Place>
    )
  return (
    <Place {...at} maxWidth={`${item.maxWidth ?? 60}%`}>
      <PanelCaption position="free">
        <span className="whitespace-pre-line">{item.text}</span>
      </PanelCaption>
    </Place>
  )
}

/* ---------- Place ---------- */

export type PlaceProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Horizontal position in the panel (number = percent). */
  x?: number | string
  /** Vertical position in the panel (number = percent). */
  y?: number | string
  /** Which point of the element sits at (x, y). */
  anchor?: Anchor
  /** Maximum width (number = percent of the panel). Defaults to the child's `maxWidth`, then 60%. */
  maxWidth?: number | string
  /** Keep it inside the frame (clipped). By default a placed element may cross the frame. */
  clip?: boolean
  /** Nudge it back inside the panel when it would stick out (default true). */
  contain?: boolean
  /** Tilt in degrees. */
  rotate?: number
  /** Another place once the page folds into a strip on a phone (same units as x, y and maxWidth). */
  fold?: { x?: number | string; y?: number | string; anchor?: Anchor; maxWidth?: number | string }
  children?: React.ReactNode
}

const ANCHORS: Record<Anchor, [number, number]> = {
  "top-left": [0, 0],
  top: [50, 0],
  "top-right": [100, 0],
  left: [0, 50],
  center: [50, 50],
  right: [100, 50],
  "bottom-left": [0, 100],
  bottom: [50, 100],
  "bottom-right": [100, 100],
}

const pct = (v: number | string) => (typeof v === "number" ? v : /%$/.test(v.trim()) ? parseFloat(v) : NaN)

/** Places one element in a panel, in percent, from an anchor point: x="72%" y="12%" anchor="top-right". */
function Place({ x: x0 = 50, y: y0 = 50, anchor: anchor0 = "center", maxWidth: maxWidth0, fold, clip, contain = true, rotate, className, style, children, ...props }: PlaceProps) {
  const alt = React.useContext(Folded) ? fold : undefined
  const x = alt?.x ?? x0
  const y = alt?.y ?? y0
  const anchor = alt?.anchor ?? anchor0
  const maxWidth = alt?.maxWidth ?? maxWidth0
  const [ax, ay] = ANCHORS[anchor] ?? ANCHORS.center
  const own = React.isValidElement(children) ? (children.props as { maxWidth?: number | string }).maxWidth : undefined
  const frame = React.useRef<HTMLDivElement>(null)
  const box = React.useRef<HTMLDivElement>(null)
  const [nudge, setNudge] = React.useState<[number, number]>([0, 0])
  // Keeps the element inside the panel: measured after every render and when either box resizes.
  React.useLayoutEffect(() => {
    const fr = frame.current
    const el = box.current
    if (!fr || !el) return
    const update = () => {
      const px = pct(x)
      const py = pct(y)
      if (!contain || Number.isNaN(px) || Number.isNaN(py)) return setNudge((n) => (n[0] || n[1] ? [0, 0] : n))
      const fw = fr.clientWidth
      const fh = fr.clientHeight
      const w = el.offsetWidth
      const h = el.offsetHeight
      const left = (px * fw) / 100 - (ax * w) / 100
      const top = (py * fh) / 100 - (ay * h) / 100
      const fit = (start: number, size: number, room: number) => (size >= room || start < 0 ? -start : start + size > room ? room - start - size : 0)
      const dx = Math.round(fit(left, w, fw))
      const dy = Math.round(fit(top, h, fh))
      setNudge((n) => (n[0] === dx && n[1] === dy ? n : [dx, dy]))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(fr)
    ro.observe(el)
    return () => ro.disconnect()
  })
  // a bubble inside re-aims its tail once the element has moved
  React.useEffect(() => {
    frame.current?.dispatchEvent(new Event("mg-place"))
  }, [nudge])
  return (
    <div ref={frame} data-manga="place" data-place-frame data-clip={clip || undefined} className="pointer-events-none absolute inset-0">
      <div
        ref={box}
        className={cn("pointer-events-auto absolute w-max [--place-fill:100%]", className)}
        style={{
          left: css(x, "50%"),
          top: css(y, "50%"),
          translate: nudge[0] || nudge[1] ? `calc(${-ax}% + ${nudge[0]}px) calc(${-ay}% + ${nudge[1]}px)` : `${-ax}% ${-ay}%`,
          maxWidth: `min(100%, max(${css(maxWidth ?? own, "60%")}, var(--place-min, 0px)))`,
          rotate: rotate ? `${rotate}deg` : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- PanelArt ---------- */

export type PanelArtProps = {
  src: string
  alt: string
  /** Focal point in percent of the picture (50 = centre). */
  x?: number
  y?: number
  /** 1 = the picture just covers the panel; 2 = twice as close. */
  zoom?: number
  /** Turn the picture into a screentone (TonedImage); pass options to tune it. */
  toned?: boolean | TonedArtOptions
  className?: string
}

/** A picture filling its panel, framed by a focal point and a zoom; `toned` turns it into a screentone. */
function PanelArt({ src, alt, x = 50, y = 50, zoom = 1, toned, className }: PanelArtProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const box = React.useContext(PanelBox)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const [natural, setNatural] = React.useState<{ src: string; w: number; h: number } | null>(null)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  React.useEffect(() => {
    let live = true
    const img = new Image()
    img.onload = () => live && setNatural({ src, w: img.naturalWidth, h: img.naturalHeight })
    img.src = src
    return () => {
      live = false
    }
  }, [src])
  const known = natural?.src === src && size.w > 0 && size.h > 0 && natural.w > 0
  let frame: React.CSSProperties = { inset: 0 }
  if (known) {
    const s = Math.max(size.w / natural.w, size.h / natural.h) * Math.max(1, zoom)
    const W = natural.w * s
    const H = natural.h * s
    const cx = Math.min(100, Math.max(0, x)) / 100
    const cy = Math.min(100, Math.max(0, y)) / 100
    frame = {
      left: pc(-(W - size.w) * cx, size.w),
      top: pc(-(H - size.h) * cy, size.h),
      width: pc(W, size.w),
      height: pc(H, size.h),
    }
  }
  const opts = typeof toned === "object" ? toned : {}
  // The screen follows the page: about one dot per page unit.
  const density = opts.density ?? (box && size.w ? Math.max(3, Math.round((size.w / box.units) * 0.9)) : 6)
  return (
    <div ref={ref} data-manga="panel-art" className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute" style={frame}>
        {toned ? (
          <TonedImage src={src} alt={alt} {...opts} density={density} className="size-full" />
        ) : (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="block size-full object-cover"
            style={{ objectPosition: `${x}% ${y}%` }}
          />
        )}
      </div>
    </div>
  )
}

/* ---------- Panel (also the old grid cell) ---------- */

function useSize() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

/**
 * A panel. Inside a Page (or a Tier) it is a description the page lays out; on its own or in the old
 * PanelGrid it is a framed case placed on the grid.
 */
function Panel({
  colSpan,
  rowSpan,
  cut,
  ink = false,
  className,
  style,
  children,
  // page-only props, not used by the grid cell
  width: _w,
  slant: _s,
  shape: _sh,
  tilt: _t,
  bleed: _b,
  frameless: _fl,
  overflow: _o,
  inset: _i,
  art,
  items: _it,
  label,
  ...props
}: PanelProps) {
  const [ref, { w, h }] = useSize()
  const c = cut?.size ?? 32
  // outline in px, left-to-right; mirrored for manga reading order
  const pts =
    cut?.side === "end"
      ? [[0, 0], [w, 0], [w - c, h], [0, h]]
      : cut?.side === "start"
        ? [[c, 0], [w, 0], [w, h], [0, h]]
        : [[0, 0], [w, 0], [w, h], [0, h]]
  const poly = (mirror: boolean) => `polygon(${pts.map(([x, y]) => `${mirror ? w - x : x}px ${y}px`).join(", ")})`
  const measured = w > 0
  const outline = pts.map(([x, y]) => `${x},${y}`).join(" ")
  return (
    <div
      ref={ref}
      data-manga="panel"
      data-cut={cut?.side}
      aria-label={label}
      className={cn(
        "relative isolate min-h-24 overflow-hidden",
        ink ? "bg-foreground text-background [--tone-ink:var(--background)] [--tone-paper:var(--foreground)]" : "bg-background text-foreground",
        measured ? "[clip-path:var(--panel-clip)] reading-rtl:[clip-path:var(--panel-clip-rtl)]" : "border-ink-panel",
        className,
      )}
      style={
        {
          gridColumn: colSpan ? `span ${colSpan}` : undefined,
          gridRow: rowSpan ? `span ${rowSpan}` : undefined,
          "--panel-clip": measured ? poly(false) : undefined,
          "--panel-clip-rtl": measured ? poly(true) : undefined,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {art && <PanelArt {...art} />}
      {children}
      {/* The frame: a 3px ink line along the (possibly slanted) outline, drawn over the art. An ink panel
          keeps its ink line and gets a 2px paper gap inside it, so it reads framed in both themes. */}
      {measured && (
        <svg aria-hidden viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 z-20 size-full reading-rtl:-scale-x-100">
          {ink && <polygon points={outline} fill="none" stroke="var(--background)" strokeWidth="10" />}
          <polygon points={outline} fill="none" stroke="var(--foreground)" strokeWidth="6" />
        </svg>
      )}
    </div>
  )
}

/* ---------- PanelGrid (the old page) ---------- */

export type PanelGridProps = React.ComponentProps<"div"> & {
  /** Columns of the page grid. */
  cols?: number
  /** Rows of the page grid (equal heights). Leave out for rows sized by content. */
  rows?: number
  /** Gutter between panels (any CSS length). */
  gap?: string
  /** Space around the panels (any CSS length, default 0.75rem). */
  padding?: string
  /** Panel order: left to right, or right to left (manga). Defaults to the page setting. */
  reading?: "ltr" | "rtl"
} & Pick<PageProps, "page" | "template" | "format" | "fold" | "onGeometry">

/**
 * The first page layout, kept for existing code: a CSS grid of panels (cols, rows, colSpan, rowSpan).
 * Given a `page`, a `template`, a `format` or Tier children, it is the same as Page.
 */
function PanelGrid({ cols = 3, rows, gap = "0.6rem", padding = "0.75rem", reading, className, style, ...props }: PanelGridProps) {
  const pageLike = props.page || props.template || props.format || flatten(props.children).some((el) => el.type === Tier)
  if (pageLike) return <Page reading={reading} className={className} style={style} {...(props as PageProps)} />
  const { page: _p, template: _t, format: _f, fold: _fo, onGeometry: _g, ...rest } = props
  return (
    <div
      data-manga="panel-grid"
      data-reading={reading}
      className={cn("grid bg-background [direction:ltr] reading-rtl:[direction:rtl] *:[direction:ltr]", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
        gap,
        padding,
        ...style,
      }}
      {...rest}
    />
  )
}

/* ---------- PanelCaption ---------- */

export type PanelCaptionProps = React.ComponentProps<"div"> & {
  /** Corner of the panel the narration box sits in; "free" leaves the placing to you (or to Place). */
  position?: "top-start" | "top-end" | "bottom-start" | "bottom-end" | "free"
}

const positions = {
  "top-start": "absolute top-[0.5714em] start-[0.5714em] max-w-[70%]",
  "top-end": "absolute top-[0.5714em] end-[0.5714em] max-w-[70%]",
  "bottom-start": "absolute bottom-[0.5714em] start-[0.5714em] max-w-[70%]",
  "bottom-end": "absolute bottom-[0.5714em] end-[0.5714em] max-w-[70%]",
  free: "relative",
}

/** Narration box (récitatif): a case inside the panel, 2px and without a shadow (G1). */
function PanelCaption({ position = "top-start", className, ...props }: PanelCaptionProps) {
  return (
    <div
      data-manga="panel-caption"
      className={cn(
        "z-10 border-[length:var(--mg-bw)] border-foreground bg-background px-[0.5714em] py-[0.2857em] font-letter text-sm leading-tight tracking-wide text-foreground uppercase",
        "[[data-manga=page]_&]:border-[length:var(--page-fine)] [[data-manga=page]_&]:text-[length:var(--caption-size)]",
        positions[position] ?? positions["top-start"],
        className,
      )}
      {...props}
    />
  )
}

export { Column, Page, Panel, PanelArt, PanelCaption, PanelGrid, Place, Tier }
