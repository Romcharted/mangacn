"use client"

import * as React from "react"
import { cn } from "cn"

export type BubbleVariant = "speech" | "thought" | "shout" | "whisper" | "narration" | "electronic" | "wobbly"
export type BubbleTail = "top" | "bottom" | "start" | "end" | "none"
export type BubbleTailAlign = "start" | "center" | "end"

export type SpeechBubbleProps = React.ComponentProps<"div"> & {
  /** speech · thought (cloud) · shout (spikes) · whisper (dashed) · narration (box) · electronic (zigzag) · wobbly (trembling) */
  variant?: BubbleVariant
  /** Side the tail points to. Logical sides follow `dir`. */
  tail?: BubbleTail
  /** Where the tail sits along that side. */
  tailAlign?: BubbleTailAlign
  /** Seed for the hand-drawn irregularities (shout, wobbly, thought). */
  seed?: number
}

type Pt = [number, number]

/** Tail length; the same room is reserved as margin so the tail counts in the layout. */
const TAIL = 22

function useSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0, rtl: false })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight, rtl: getComputedStyle(el).direction === "rtl" })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
}

const f = (n: number) => Math.round(n * 10) / 10
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`

/** Every shape is inscribed in the box (inset by the stroke), so nothing spills over neighbours. */
function radii(w: number, h: number) {
  return { cx: w / 2, cy: h / 2, rx: w / 2 - 2, ry: h / 2 - 2 }
}

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, n: number, jitter = 0, rand = Math.random) {
  return Array.from({ length: n }, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2
    const k = 1 - rand() * jitter
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
}

function bodyPath(variant: BubbleVariant, w: number, h: number, seed: number) {
  const { cx, cy, rx, ry } = radii(w, h)
  const rand = rng(seed)
  switch (variant) {
    case "narration":
      return poly([[1.5, 1.5], [w - 1.5, 1.5], [w - 1.5, h - 1.5], [1.5, h - 1.5]])
    case "electronic": {
      const pts: Pt[] = []
      const m = 4
      const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
        const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 10))
        for (let i = 0; i < n; i++) {
          const t = i / n
          const o = i % 2 ? 3 : -3
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
      const n = Math.max(14, Math.round((Math.PI * (rx + ry)) / 26))
      const pts: Pt[] = []
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * Math.PI * 2
        const k = i % 2 === 0 ? 0.9 + rand() * 0.1 : 0.72
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
      }
      return poly(pts)
    }
    case "wobbly": {
      const pts = ellipsePoints(cx, cy, rx, ry, 36, 0.06, rand)
      return `M${f(pts[0][0])} ${f(pts[0][1])} ${pts
        .map((p, i) => {
          const q = pts[(i + 1) % pts.length]
          return `Q${f(p[0])} ${f(p[1])} ${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`
        })
        .join(" ")} Z`
    }
    case "thought": {
      const n = Math.max(9, Math.round((Math.PI * (rx + ry)) / 34))
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
      return `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)} Z`
  }
}

type PhysSide = "top" | "bottom" | "left" | "right"

/** Point on the body edge for a tail on `side` at fraction `t` (0..1) along it. */
function edgePoint(variant: BubbleVariant, w: number, h: number, side: PhysSide, t: number): Pt {
  const boxy = variant === "narration" || variant === "electronic"
  const { cx, cy, rx, ry } = radii(w, h)
  if (side === "top" || side === "bottom") {
    const x = w * t
    if (boxy) return [x, side === "top" ? 2 : h - 2]
    const dy = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))
    return [x, side === "top" ? cy - dy : cy + dy]
  }
  const y = h * t
  if (boxy) return [side === "left" ? 2 : w - 2, y]
  const dx = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2))
  return [side === "left" ? cx - dx : cx + dx, y]
}

function physicalSide(tail: Exclude<BubbleTail, "none">, rtl: boolean): PhysSide {
  if (tail === "start") return rtl ? "right" : "left"
  if (tail === "end") return rtl ? "left" : "right"
  return tail
}

function tailGeometry(variant: BubbleVariant, w: number, h: number, tail: BubbleTail, align: BubbleTailAlign, rtl: boolean) {
  if (tail === "none") return null
  const side = physicalSide(tail, rtl)
  const along = side === "top" || side === "bottom"
  let t = align === "start" ? 0.3 : align === "end" ? 0.7 : 0.5
  if (along && rtl) t = 1 - t
  const span = (along ? w : h) || 1
  const half = Math.min(11, span / 6)
  const n: Pt = side === "top" ? [0, -1] : side === "bottom" ? [0, 1] : side === "left" ? [-1, 0] : [1, 0]
  const tg: Pt = along ? [1, 0] : [0, 1]
  const base = edgePoint(variant, w, h, side, t)
  const b1 = edgePoint(variant, w, h, side, t - half / span)
  const b2 = edgePoint(variant, w, h, side, t + half / span)
  // pull base points inside so the tail fill hides the body outline under it
  const inset = (p: Pt): Pt => [p[0] - n[0] * 5, p[1] - n[1] * 5]
  const lean = (t < 0.5 ? -1 : t > 0.5 ? 1 : 0) * 7
  // the tip ends exactly at the box edge + TAIL, inside the reserved margin
  const edge = side === "top" ? 0 : side === "bottom" ? h : side === "left" ? 0 : w
  const along0 = along ? base[0] : base[1]
  const tipAlong = along0 + lean
  const tipAcross = edge + (side === "top" || side === "left" ? -TAIL + 2 : TAIL - 2)
  const tip: Pt = along ? [tipAlong, tipAcross] : [tipAcross, tipAlong]
  return { b1: inset(b1), b2: inset(b2), tip, n, tg, base, side }
}

function tailPath(variant: BubbleVariant, g: NonNullable<ReturnType<typeof tailGeometry>>) {
  const { b1, b2, tip, n, tg } = g
  const P = (p: Pt) => `${f(p[0])} ${f(p[1])}`
  if (variant === "shout") {
    const m1: Pt = [(b1[0] + tip[0]) / 2 + tg[0] * 5, (b1[1] + tip[1]) / 2 + tg[1] * 5]
    const k: Pt = [m1[0] - tg[0] * 7, m1[1] - tg[1] * 7]
    const m2: Pt = [(b2[0] + tip[0]) / 2 - tg[0] * 1, (b2[1] + tip[1]) / 2 - tg[1] * 1]
    return `M${P(b1)} L${P(m1)} L${P(k)} L${P(tip)} L${P(m2)} L${P(b2)}`
  }
  if (variant === "electronic") {
    const k1: Pt = [b1[0] + n[0] * 12 + tg[0] * 6, b1[1] + n[1] * 12 + tg[1] * 6]
    const k2: Pt = [k1[0] - tg[0] * 4, k1[1] - tg[1] * 4]
    const k3: Pt = [k1[0] + tg[0] * 8, k1[1] + tg[1] * 8]
    return `M${P(b1)} L${P(k1)} L${P(k2)} L${P(tip)} L${P(k3)} L${P(b2)}`
  }
  const c1: Pt = [(b1[0] + tip[0]) / 2 + n[0] * 2, (b1[1] + tip[1]) / 2 + n[1] * 2]
  const c2: Pt = [(b2[0] + tip[0]) / 2 - n[0] * 2, (b2[1] + tip[1]) / 2 - n[1] * 2]
  return `M${P(b1)} Q${P(c1)} ${P(tip)} Q${P(c2)} ${P(b2)}`
}

const MARGIN: Record<Exclude<BubbleTail, "none">, keyof React.CSSProperties> = {
  top: "marginTop",
  bottom: "marginBottom",
  start: "marginInlineStart",
  end: "marginInlineEnd",
}

/**
 * Manga speech bubble. The outline is drawn in SVG at the bubble's real size,
 * inscribed in its box; the tail gets its own margin. Text stays real text.
 */
function SpeechBubble({
  variant = "speech",
  tail = "bottom",
  tailAlign = "start",
  seed = 7,
  className,
  children,
  style,
  ...props
}: SpeechBubbleProps) {
  const [ref, { w, h, rtl }] = useSize<HTMLDivElement>()
  const g = w > 0 ? tailGeometry(variant, w, h, tail, tailAlign, rtl) : null
  const stroke = {
    fill: "var(--bubble-fill, var(--background))",
    stroke: "var(--bubble-stroke, currentColor)",
    strokeWidth: variant === "shout" ? 3 : 2.5,
    strokeLinejoin: "round" as const,
    strokeDasharray: variant === "whisper" ? "7 5" : undefined,
  }
  const reserved = tail === "none" ? {} : { [MARGIN[tail]]: TAIL }
  return (
    <div
      ref={ref}
      data-manga="speech-bubble"
      data-variant={variant}
      data-tail={tail}
      className={cn(
        "relative isolate inline-block max-w-sm px-9 py-6 text-center font-letter text-lg leading-snug text-foreground",
        variant === "narration" && "px-4 py-3 text-start font-sans text-base",
        variant === "electronic" && "px-6 py-4",
        variant === "shout" && "px-14 py-10 text-xl uppercase",
        variant === "thought" && "px-11 py-8",
        variant === "whisper" && "text-base",
        className,
      )}
      style={{ ...reserved, ...style }}
      {...props}
    >
      {w > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible">
          <path d={bodyPath(variant, w, h, seed)} style={stroke} />
          {g && variant !== "thought" && <path d={tailPath(variant, g)} style={stroke} />}
          {g && variant === "thought" && (
            <>
              <circle cx={g.base[0] + g.n[0] * 9} cy={g.base[1] + g.n[1] * 9} r={5.5} style={stroke} />
              <circle cx={g.base[0] + g.n[0] * (TAIL - 4) + g.tg[0] * 4} cy={g.base[1] + g.n[1] * (TAIL - 4) + g.tg[1] * 4} r={3} style={stroke} />
            </>
          )}
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
