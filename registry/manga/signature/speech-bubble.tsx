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

function useSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0, rtl: false })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height, rtl: getComputedStyle(el).direction === "rtl" })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const f = (n: number) => Math.round(n * 10) / 10
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L")} Z`

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, n: number, jitter = 0, rand = Math.random) {
  return Array.from({ length: n }, (_, i): Pt => {
    const a = (i / n) * Math.PI * 2
    const k = 1 + (rand() - 0.5) * jitter
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]
  })
}

function bodyPath(variant: BubbleVariant, w: number, h: number, seed: number) {
  const cx = w / 2
  const cy = h / 2
  const rx = (w / 2) * 1.1
  const ry = (h / 2) * 1.18
  const rand = rng(seed)
  switch (variant) {
    case "narration":
      return poly([[0, 0], [w, 0], [w, h], [0, h]])
    case "electronic": {
      const pts: Pt[] = []
      const step = 10
      const edge = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
        const len = Math.hypot(x1 - x0, y1 - y0)
        const n = Math.max(2, Math.round(len / step))
        for (let i = 0; i < n; i++) {
          const t = i / n
          const o = i % 2 ? 3 : -3
          pts.push([x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o])
        }
      }
      edge(0, 0, w, 0, 0, -1)
      edge(w, 0, w, h, 1, 0)
      edge(w, h, 0, h, 0, 1)
      edge(0, h, 0, 0, -1, 0)
      return poly(pts)
    }
    case "shout": {
      const n = Math.max(14, Math.round((Math.PI * (rx + ry)) / 26))
      const pts: Pt[] = []
      for (let i = 0; i < n * 2; i++) {
        const a = (i / (n * 2)) * Math.PI * 2
        const out = i % 2 === 0
        const k = out ? 1.12 + rand() * 0.14 : 0.96
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
      }
      return poly(pts)
    }
    case "wobbly": {
      const pts = ellipsePoints(cx, cy, rx, ry, 36, 0.05, rand)
      return `M${f(pts[0][0])} ${f(pts[0][1])} ${pts
        .map((p, i) => {
          const q = pts[(i + 1) % pts.length]
          return `Q${f(p[0])} ${f(p[1])} ${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`
        })
        .join(" ")} Z`
    }
    case "thought": {
      const n = Math.max(9, Math.round((Math.PI * (rx + ry)) / 34))
      const pts = ellipsePoints(cx, cy, rx * 0.97, ry * 0.95, n, 0.06, rand)
      return `M${f(pts[0][0])} ${f(pts[0][1])} ${pts
        .map((_, i) => {
          const q = pts[(i + 1) % n]
          const r = (Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]) / 2) * 1.15
          return `A${f(r)} ${f(r)} 0 0 1 ${f(q[0])} ${f(q[1])}`
        })
        .join(" ")} Z`
    }
    default:
      return `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)} Z`
  }
}

/** Point on the body edge for a tail on `side` at fraction `t` (0..1) along it. */
function edgePoint(variant: BubbleVariant, w: number, h: number, side: Exclude<BubbleTail, "none" | "start" | "end"> | "left" | "right", t: number): Pt {
  const boxy = variant === "narration" || variant === "electronic"
  const cx = w / 2
  const cy = h / 2
  const rx = (w / 2) * 1.1
  const ry = (h / 2) * 1.18
  if (side === "top" || side === "bottom") {
    const x = w * t
    if (boxy) return [x, side === "top" ? 0 : h]
    const dy = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))
    return [x, side === "top" ? cy - dy : cy + dy]
  }
  const y = h * t
  if (boxy) return [side === "left" ? 0 : w, y]
  const dx = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2))
  return [side === "left" ? cx - dx : cx + dx, y]
}

function tailGeometry(variant: BubbleVariant, w: number, h: number, tail: BubbleTail, align: BubbleTailAlign, rtl: boolean) {
  if (tail === "none") return null
  const side = tail === "start" ? (rtl ? "right" : "left") : tail === "end" ? (rtl ? "left" : "right") : tail
  const along = side === "top" || side === "bottom"
  let t = align === "start" ? 0.28 : align === "end" ? 0.72 : 0.5
  if (along && rtl) t = 1 - t
  const half = Math.min(11, (along ? w : h) / 6)
  const len = 22
  // outward normal and tangent
  const n: Pt = side === "top" ? [0, -1] : side === "bottom" ? [0, 1] : side === "left" ? [-1, 0] : [1, 0]
  const tg: Pt = along ? [1, 0] : [0, 1]
  const base = edgePoint(variant, w, h, side, t)
  const span = (along ? w : h) || 1
  const b1 = edgePoint(variant, w, h, side, t - half / span)
  const b2 = edgePoint(variant, w, h, side, t + half / span)
  // pull base points inside so the tail fill hides the body outline under it
  const inset = (p: Pt): Pt => [p[0] - n[0] * 4, p[1] - n[1] * 4]
  const lean = (t < 0.5 ? -1 : t > 0.5 ? 1 : 0) * 8
  const tip: Pt = [base[0] + n[0] * len + tg[0] * lean, base[1] + n[1] * len + tg[1] * lean]
  return { b1: inset(b1), b2: inset(b2), tip, n, tg, base }
}

function tailPath(variant: BubbleVariant, g: NonNullable<ReturnType<typeof tailGeometry>>) {
  const { b1, b2, tip, n, tg } = g
  if (variant === "shout") {
    const m1: Pt = [(b1[0] + tip[0]) / 2 + tg[0] * 6, (b1[1] + tip[1]) / 2 + tg[1] * 6]
    const m2: Pt = [(b2[0] + tip[0]) / 2 - tg[0] * 2, (b2[1] + tip[1]) / 2 - tg[1] * 2]
    return `M${f(b1[0])} ${f(b1[1])} L${f(m1[0])} ${f(m1[1])} L${f(m1[0] - tg[0] * 8)} ${f(m1[1] - tg[1] * 8)} L${f(tip[0])} ${f(tip[1])} L${f(m2[0])} ${f(m2[1])} L${f(b2[0])} ${f(b2[1])}`
  }
  if (variant === "electronic") {
    const k1: Pt = [b1[0] + n[0] * 10 + tg[0] * 6, b1[1] + n[1] * 10 + tg[1] * 6]
    return `M${f(b1[0])} ${f(b1[1])} L${f(k1[0])} ${f(k1[1])} L${f(k1[0] - tg[0] * 4)} ${f(k1[1] - tg[1] * 4)} L${f(tip[0])} ${f(tip[1])} L${f(k1[0] + tg[0] * 8)} ${f(k1[1] + tg[1] * 8)} L${f(b2[0])} ${f(b2[1])}`
  }
  const c1: Pt = [(b1[0] + tip[0]) / 2 + n[0] * 2, (b1[1] + tip[1]) / 2 + n[1] * 2]
  const c2: Pt = [(b2[0] + tip[0]) / 2 - n[0] * 2, (b2[1] + tip[1]) / 2 - n[1] * 2]
  return `M${f(b1[0])} ${f(b1[1])} Q${f(c1[0])} ${f(c1[1])} ${f(tip[0])} ${f(tip[1])} Q${f(c2[0])} ${f(c2[1])} ${f(b2[0])} ${f(b2[1])}`
}

/**
 * Manga speech bubble. The outline is drawn in SVG at the bubble's real size,
 * so spikes, clouds and zigzags keep their proportions. Text stays real text.
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
  return (
    <div
      ref={ref}
      data-manga="speech-bubble"
      data-variant={variant}
      data-tail={tail}
      className={cn(
        "relative isolate inline-block max-w-sm px-7 py-5 text-center font-letter text-lg leading-snug text-foreground",
        variant === "narration" && "px-4 py-3 text-start font-sans text-base",
        variant === "electronic" && "px-5 py-3",
        variant === "shout" && "px-9 py-7 text-xl uppercase",
        variant === "whisper" && "text-base",
        className,
      )}
      style={style}
      {...props}
    >
      {w > 0 && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible"
          style={{ filter: "var(--bubble-shadow, none)" }}
        >
          <path d={bodyPath(variant, w, h, seed)} style={stroke} />
          {g && variant !== "thought" && <path d={tailPath(variant, g)} style={stroke} />}
          {g && variant === "thought" && (
            <>
              <circle cx={g.base[0] + g.n[0] * 12} cy={g.base[1] + g.n[1] * 12} r={6} style={stroke} />
              <circle cx={g.tip[0] + g.n[0] * 4} cy={g.tip[1] + g.n[1] * 4} r={3.5} style={stroke} />
            </>
          )}
        </svg>
      )}
      {children}
    </div>
  )
}

/** Chains bubbles spoken in one breath: each pair is joined by a narrow neck. */
function BubbleGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  const items = React.Children.toArray(children)
  return (
    <div data-manga="bubble-group" className={cn("flex flex-col items-start", className)} {...props}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          <div className={cn("relative", i % 2 === 1 && "ms-10")}>{child}</div>
          {i < items.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "relative z-10 -my-3 block h-7 w-3.5 border-x-[2.5px] border-[var(--bubble-stroke,currentColor)] bg-[var(--bubble-fill,var(--background))]",
                i % 2 === 0 ? "ms-16" : "ms-14",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export { BubbleGroup, SpeechBubble }
