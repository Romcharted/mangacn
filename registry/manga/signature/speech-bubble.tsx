"use client"

import * as React from "react"
import { cn } from "cn"

export type BubbleVariant = "speech" | "thought" | "shout" | "whisper" | "narration" | "electronic" | "wobbly"
export type BubbleTail = "top" | "bottom" | "start" | "end" | "none"
export type BubbleTailAlign = "start" | "center" | "end"

export type SpeechBubbleProps = React.ComponentProps<"div"> & {
  /** speech · thought (cloud) · shout (spikes) · whisper (dashed) · narration (box) · electronic (zigzag) · wobbly (trembling) */
  variant?: BubbleVariant
  /** Side the tail points to. Logical sides follow `dir`. Ignored when `pointAt` is set. */
  tail?: BubbleTail
  /** Where the tail sits along that side. */
  tailAlign?: BubbleTailAlign
  /**
   * A point to aim at, in percent of the panel (the nearest Place frame, else the offset parent): the tail
   * turns toward it and grows to reach it.
   */
  pointAt?: { x: number | string; y: number | string }
  /** Text alignment (default centre; narration starts at the start). */
  align?: "start" | "center" | "end"
  /** Maximum width (CSS length, default 24rem). In a Place, a percentage is a share of the panel. */
  maxWidth?: string
  /** Seed for the hand-drawn irregularities (shout, wobbly, thought). */
  seed?: number
}

type Pt = [number, number]

/** Tail length at the variant's own size; the same room is reserved as margin so the tail counts in the layout. */
const TAIL = 22
/** The font size each variant is drawn for: geometry scales with the real size (k = size / base). */
const BASE: Record<BubbleVariant, number> = {
  speech: 18,
  thought: 18,
  shout: 20,
  whisper: 16,
  narration: 16,
  electronic: 18,
  wobbly: 18,
}

const toPct = (v: number | string) => (typeof v === "number" ? v : parseFloat(v)) / 100

function useSize<T extends HTMLElement>(pointAt: SpeechBubbleProps["pointAt"]) {
  const ref = React.useRef<T>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0, rtl: false, fs: 0, tx: 0, ty: 0, page: false })
  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const cs = getComputedStyle(el)
    let tx = 0
    let ty = 0
    if (pointAt) {
      // the frame the target is measured in: the Place frame (the panel), else the offset parent
      const frame = (el.closest("[data-place-frame]") as HTMLElement | null) ?? (el.offsetParent as HTMLElement | null)
      if (frame) {
        const fr = frame.getBoundingClientRect()
        const br = el.getBoundingClientRect()
        const ratio = br.width / (el.offsetWidth || 1) || 1
        tx = (fr.left + fr.width * toPct(pointAt.x) - br.left) / ratio
        ty = (fr.top + fr.height * toPct(pointAt.y) - br.top) / ratio
      }
    }
    const page = !!el.closest("[data-manga=page]")
    const next = { w: el.offsetWidth, h: el.offsetHeight, rtl: cs.direction === "rtl", fs: parseFloat(cs.fontSize) || 18, tx, ty, page }
    setSize((s) =>
      s.w === next.w && s.h === next.h && s.rtl === next.rtl && s.fs === next.fs && s.page === page && Math.abs(s.tx - tx) < 0.5 && Math.abs(s.ty - ty) < 0.5 ? s : next,
    )
  }, [pointAt?.x, pointAt?.y]) // eslint-disable-line react-hooks/exhaustive-deps
  // re-measured after every render: a bubble that moves (Place, an editor) re-aims its tail
  React.useLayoutEffect(measure)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const frame = el.closest("[data-place-frame]")
    if (frame) ro.observe(frame)
    // a Place that nudges the bubble back inside its panel tells it to re-aim
    frame?.addEventListener("mg-place", measure)
    return () => {
      ro.disconnect()
      frame?.removeEventListener("mg-place", measure)
    }
  }, [measure])
  return [ref, size] as const
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

const f = (n: number) => Math.round(n * 10) / 10
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`

/** Every shape is inscribed in the box (inset by the stroke), so nothing spills over neighbours. */
function radii(w: number, h: number, k = 1) {
  return { cx: w / 2, cy: h / 2, rx: w / 2 - 2 * k, ry: h / 2 - 2 * k }
}

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, n: number, jitter = 0, rand = Math.random) {
  return Array.from({ length: n }, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2
    const k = 1 - rand() * jitter
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
}

/** Points of a superellipse (n = 2 is an ellipse; above 2 it squares up and holds a block of text). */
function superPoints(cx: number, cy: number, rx: number, ry: number, n: number, count = 72): Pt[] {
  return Array.from({ length: count }, (_, i): Pt => {
    const a = (i / count) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    return [cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n), cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n)]
  })
}

function bodyPath(variant: BubbleVariant, w: number, h: number, seed: number, k = 1, n = 2) {
  const { cx, cy, rx, ry } = radii(w, h, k)
  const rand = rng(seed)
  switch (variant) {
    case "narration": {
      const m = 1.5 * k
      return poly([[m, m], [w - m, m], [w - m, h - m], [m, h - m]])
    }
    case "electronic": {
      const pts: Pt[] = []
      const m = 4 * k
      const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
        const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / (10 * k)))
        for (let i = 0; i < n; i++) {
          const t = i / n
          const o = (i % 2 ? 3 : -3) * k
          pts.push([x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o])
        }
      }
      edge(m, m, w - m, m, 0, -1)
      edge(w - m, m, w - m, h - m, 1, 0)
      edge(w - m, h - m, m, h - m, 0, 1)
      edge(m, h - m, m, m, -1, 0)
      return poly(pts)
    }
    case "shout": {
      const n = Math.max(14, Math.round((Math.PI * (rx + ry)) / (26 * k)))
      const pts: Pt[] = []
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * Math.PI * 2
        const k = i % 2 === 0 ? 0.9 + rand() * 0.1 : 0.72
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
      }
      return poly(pts)
    }
    case "wobbly": {
      const pts =
        n > 2
          ? superPoints(cx, cy, rx, ry, n, 36).map(([x, y]): Pt => {
              const j = 1 - rand() * 0.06
              return [cx + (x - cx) * j, cy + (y - cy) * j]
            })
          : ellipsePoints(cx, cy, rx, ry, 36, 0.06, rand)
      return `M${f(pts[0][0])} ${f(pts[0][1])} ${pts
        .map((p, i) => {
          const q = pts[(i + 1) % pts.length]
          return `Q${f(p[0])} ${f(p[1])} ${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`
        })
        .join(" ")} Z`
    }
    case "thought": {
      const n = Math.max(9, Math.round((Math.PI * (rx + ry)) / (34 * k)))
      const pts = ellipsePoints(cx, cy, rx * 0.84, ry * 0.8, n, 0.05, rand)
      return `M${f(pts[0][0])} ${f(pts[0][1])} ${pts
        .map((_, i) => {
          const q = pts[(i + 1) % n]
          const r = (Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]) / 2) * 1.12
          return `A${f(r)} ${f(r)} 0 0 1 ${f(q[0])} ${f(q[1])}`
        })
        .join(" ")} Z`
    }
    default:
      if (n > 2) return poly(superPoints(cx, cy, rx, ry, n))
      return `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)} Z`
  }
}

type PhysSide = "top" | "bottom" | "left" | "right"

/** Point on the body edge for a tail on `side` at fraction `t` (0..1) along it. */
function edgePoint(variant: BubbleVariant, w: number, h: number, side: PhysSide, t: number, k: number, n = 2): Pt {
  const boxy = variant === "narration" || variant === "electronic"
  const { cx, cy, rx, ry } = radii(w, h, k)
  if (side === "top" || side === "bottom") {
    const x = w * t
    if (boxy) return [x, side === "top" ? 2 * k : h - 2 * k]
    const dy = ry * Math.max(0, 1 - Math.abs((x - cx) / rx) ** n) ** (1 / n)
    return [x, side === "top" ? cy - dy : cy + dy]
  }
  const y = h * t
  if (boxy) return [side === "left" ? 2 * k : w - 2 * k, y]
  const dx = rx * Math.max(0, 1 - Math.abs((y - cy) / ry) ** n) ** (1 / n)
  return [side === "left" ? cx - dx : cx + dx, y]
}

function physicalSide(tail: Exclude<BubbleTail, "none">, rtl: boolean): PhysSide {
  if (tail === "start") return rtl ? "right" : "left"
  if (tail === "end") return rtl ? "left" : "right"
  return tail
}

type TailGeometry = { b1: Pt; b2: Pt; tip: Pt; n: Pt; tg: Pt; base: Pt; bend: number }

function tailGeometry(variant: BubbleVariant, w: number, h: number, tail: BubbleTail, align: BubbleTailAlign, rtl: boolean, k: number, sq = 2): TailGeometry | null {
  if (tail === "none") return null
  const side = physicalSide(tail, rtl)
  const along = side === "top" || side === "bottom"
  let t = align === "start" ? 0.3 : align === "end" ? 0.7 : 0.5
  if (along && rtl) t = 1 - t
  const span = (along ? w : h) || 1
  const half = Math.min(11 * k, span / 6)
  const n: Pt = side === "top" ? [0, -1] : side === "bottom" ? [0, 1] : side === "left" ? [-1, 0] : [1, 0]
  const tg: Pt = along ? [1, 0] : [0, 1]
  const base = edgePoint(variant, w, h, side, t, k, sq)
  const b1 = edgePoint(variant, w, h, side, t - half / span, k, sq)
  const b2 = edgePoint(variant, w, h, side, t + half / span, k, sq)
  // pull base points inside so the tail fill hides the body outline under it
  const inset = (p: Pt): Pt => [p[0] - n[0] * 5 * k, p[1] - n[1] * 5 * k]
  const lean = (t < 0.5 ? -1 : t > 0.5 ? 1 : 0) * 7 * k
  // the tip ends exactly at the box edge + TAIL, inside the reserved margin
  const edge = side === "top" ? 0 : side === "bottom" ? h : side === "left" ? 0 : w
  const along0 = along ? base[0] : base[1]
  const tipAlong = along0 + lean
  const tipAcross = edge + (side === "top" || side === "left" ? -TAIL * k + 2 * k : TAIL * k - 2 * k)
  const tip: Pt = along ? [tipAlong, tipAcross] : [tipAcross, tipAlong]
  return { b1: inset(b1), b2: inset(b2), tip, n, tg, base, bend: 0 }
}

/** A tail aimed at a point (bubble coordinates): it leaves the body toward the point and stops just short of it. */
function aimedTail(variant: BubbleVariant, w: number, h: number, target: Pt, k: number, sq = 2): TailGeometry | null {
  const { cx, cy, rx, ry } = radii(w, h, k)
  const dx = target[0] - cx
  const dy = target[1] - cy
  const boxy = variant === "narration" || variant === "electronic"
  // distance from the centre to the body edge along the direction (in units of the direction length)
  const reach = boxy
    ? Math.min(rx / Math.abs(dx || 1e-9), ry / Math.abs(dy || 1e-9))
    : 1 / (Math.abs(dx / rx) ** sq + Math.abs(dy / ry) ** sq) ** (1 / sq)
  if (reach >= 1) return null // the point is inside the bubble: no tail
  const d = Math.hypot(dx, dy)
  const n: Pt = [dx / d, dy / d]
  const tg: Pt = [-n[1], n[0]]
  const sink = variant === "shout" ? 0.8 : 1
  const base: Pt = [cx + dx * reach * sink, cy + dy * reach * sink]
  const half = Math.min(11 * k, Math.min(w, h) / 5)
  const b1: Pt = [base[0] - tg[0] * half - n[0] * 5 * k, base[1] - tg[1] * half - n[1] * 5 * k]
  const b2: Pt = [base[0] + tg[0] * half - n[0] * 5 * k, base[1] + tg[1] * half - n[1] * 5 * k]
  const room = d * (1 - reach * sink)
  const gap = Math.min(5 * k, room / 4)
  const length = Math.max(10 * k, room - gap)
  const tip: Pt = [base[0] + n[0] * length, base[1] + n[1] * length]
  // a long tail bends a little, like a brush stroke
  return { b1, b2, tip, n, tg, base, bend: Math.min(length * 0.12, 14 * k) }
}

function tailPath(variant: BubbleVariant, g: TailGeometry, k: number) {
  const { b1, b2, tip, n, tg, bend } = g
  const P = (p: Pt) => `${f(p[0])} ${f(p[1])}`
  if (variant === "shout") {
    const m1: Pt = [(b1[0] + tip[0]) / 2 + tg[0] * 5 * k, (b1[1] + tip[1]) / 2 + tg[1] * 5 * k]
    const kk: Pt = [m1[0] - tg[0] * 7 * k, m1[1] - tg[1] * 7 * k]
    const m2: Pt = [(b2[0] + tip[0]) / 2 - tg[0] * k, (b2[1] + tip[1]) / 2 - tg[1] * k]
    return `M${P(b1)} L${P(m1)} L${P(kk)} L${P(tip)} L${P(m2)} L${P(b2)}`
  }
  if (variant === "electronic") {
    const run = Math.hypot(tip[0] - b1[0], tip[1] - b1[1])
    const a = Math.min(12 * k, run * 0.45)
    const k1: Pt = [b1[0] + n[0] * a + tg[0] * 6 * k, b1[1] + n[1] * a + tg[1] * 6 * k]
    const k2: Pt = [k1[0] - tg[0] * 4 * k, k1[1] - tg[1] * 4 * k]
    const k3: Pt = [k1[0] + tg[0] * 8 * k, k1[1] + tg[1] * 8 * k]
    return `M${P(b1)} L${P(k1)} L${P(k2)} L${P(tip)} L${P(k3)} L${P(b2)}`
  }
  const c1: Pt = [(b1[0] + tip[0]) / 2 + n[0] * 2 * k + tg[0] * bend, (b1[1] + tip[1]) / 2 + n[1] * 2 * k + tg[1] * bend]
  const c2: Pt = [(b2[0] + tip[0]) / 2 - n[0] * 2 * k + tg[0] * bend, (b2[1] + tip[1]) / 2 - n[1] * 2 * k + tg[1] * bend]
  return `M${P(b1)} Q${P(c1)} ${P(tip)} Q${P(c2)} ${P(b2)}`
}

const MARGIN: Record<Exclude<BubbleTail, "none">, keyof React.CSSProperties> = {
  top: "marginTop",
  bottom: "marginBottom",
  start: "marginInlineStart",
  end: "marginInlineEnd",
}

const ALIGN = { start: "text-start", center: "text-center", end: "text-end" }

/**
 * Manga speech bubble. The outline is drawn in SVG at the bubble's real size, inscribed in its box; the
 * tail gets its own margin, or aims at a point (`pointAt`). Every length follows the font size, so a
 * bubble on a Page scales with the page. Text stays real text.
 */
function SpeechBubble({
  variant = "speech",
  tail = "bottom",
  tailAlign = "start",
  pointAt,
  align,
  maxWidth,
  seed = 7,
  className,
  children,
  style,
  ...props
}: SpeechBubbleProps) {
  const [ref, { w, h, rtl, fs, tx, ty, page }] = useSize<HTMLDivElement>(pointAt)
  const k = fs / BASE[variant]
  // on a page, round bubbles square up a little so a dense block of text stays inside
  const n = page && (variant === "speech" || variant === "whisper" || variant === "wobbly") ? 3 : 2
  const g = w > 0 ? (pointAt ? aimedTail(variant, w, h, [tx, ty], k, n) : tailGeometry(variant, w, h, tail, tailAlign, rtl, k, n)) : null
  const stroke = {
    fill: "var(--bubble-fill, var(--background))",
    stroke: "var(--bubble-stroke, currentColor)",
    strokeWidth: (variant === "shout" ? 3 : 2.5) * k,
    strokeLinejoin: "round" as const,
    strokeDasharray: variant === "whisper" ? `${7 * k} ${5 * k}` : undefined,
  }
  const reserved = tail === "none" || pointAt ? {} : { [MARGIN[tail]]: `${f(TAIL / BASE[variant])}em` }
  const thought = g && variant === "thought"
  const dots = thought
    ? pointAt
      ? [0.3, 0.62, 0.9].map((t, i) => {
          const L = Math.hypot(g.tip[0] - g.base[0], g.tip[1] - g.base[1])
          return { cx: g.base[0] + g.n[0] * L * t, cy: g.base[1] + g.n[1] * L * t, r: [5.5, 4, 2.6][i] * k }
        })
      : [
          { cx: g.base[0] + g.n[0] * 9 * k, cy: g.base[1] + g.n[1] * 9 * k, r: 5.5 * k },
          { cx: g.base[0] + g.n[0] * (TAIL - 4) * k + g.tg[0] * 4 * k, cy: g.base[1] + g.n[1] * (TAIL - 4) * k + g.tg[1] * 4 * k, r: 3 * k },
        ]
    : []
  return (
    <div
      ref={ref}
      data-manga="speech-bubble"
      data-variant={variant}
      data-tail={pointAt ? "aimed" : tail}
      className={cn(
        "relative isolate inline-block max-w-[var(--place-fill,24rem)] font-letter leading-snug text-foreground",
        variant === "narration"
          ? "px-[1em] py-[0.75em] font-sans text-base [[data-manga=page]_&]:text-[length:calc(var(--bubble-size)*0.8889)]"
          : variant === "electronic"
            ? "px-[1.3333em] py-[0.8889em] text-lg [[data-manga=page]_&]:text-[length:var(--bubble-size)] [[data-manga=page]_&]:px-[1em] [[data-manga=page]_&]:py-[0.7em]"
            : variant === "shout"
              ? "px-[2.8em] py-[2em] text-xl uppercase [[data-manga=page]_&]:text-[length:calc(var(--bubble-size)*1.1111)] [[data-manga=page]_&]:px-[1.9em] [[data-manga=page]_&]:py-[1.4em]"
              : variant === "thought"
                ? "px-[2.4444em] py-[1.7778em] text-lg [[data-manga=page]_&]:text-[length:var(--bubble-size)] [[data-manga=page]_&]:px-[1.5em] [[data-manga=page]_&]:py-[1.15em]"
                : variant === "whisper"
                  ? "px-[2.25em] py-[1.5em] text-base [[data-manga=page]_&]:text-[length:calc(var(--bubble-size)*0.8889)] [[data-manga=page]_&]:px-[1.25em] [[data-manga=page]_&]:py-[0.95em]"
                  : "px-[2em] py-[1.3333em] text-lg [[data-manga=page]_&]:text-[length:var(--bubble-size)] [[data-manga=page]_&]:px-[1.15em] [[data-manga=page]_&]:py-[0.9em]",
        ALIGN[align ?? (variant === "narration" ? "start" : "center")],
        className,
      )}
      style={{ ...reserved, maxWidth: maxWidth ? `var(--place-fill, ${maxWidth})` : undefined, ...style }}
      {...props}
    >
      {w > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible">
          <path d={bodyPath(variant, w, h, seed, k, n)} style={stroke} />
          {g && variant !== "thought" && <path d={tailPath(variant, g, k)} style={stroke} />}
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} style={stroke} />
          ))}
        </svg>
      )}
      {children}
    </div>
  )
}

/** Chains bubbles spoken in one breath: centred bubbles joined by a neck that hides both outlines. */
function BubbleGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  const items = React.Children.toArray(children)
  return (
    <div data-manga="bubble-group" className={cn("inline-flex flex-col items-center", className)} {...props}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < items.length - 1 && (
            // paper over the full height hides both outlines; the two strokes only span the gap
            <svg aria-hidden width="16" height="48" className="relative z-10 -my-5 block overflow-visible">
              <rect x="0" y="0" width="16" height="48" style={{ fill: "var(--bubble-fill, var(--background))" }} />
              <path d="M1.25 18V30M14.75 18V30" style={{ stroke: "var(--bubble-stroke, currentColor)", strokeWidth: 2.5 }} />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export { BubbleGroup, SpeechBubble }
