import * as React from "react"
import { cn } from "cn"

export type SpeedLinesProps = React.ComponentProps<"div"> & {
  /** focus: radial concentration lines · motion: parallel speed lines */
  variant?: "focus" | "motion"
  /** Focus origin in % of the box. */
  originX?: number
  originY?: number
  /** Empty centre for focus lines, as a fraction of the half-size (0–0.9). */
  hole?: number
  /** Direction of motion lines in degrees (0 = horizontal). */
  direction?: number
  /** Amount of lines (0.1–1). */
  density?: number
  /** Redraws the lines in steps: true ≈ 6 fps, "slow" ≈ 2 fps (for backgrounds). Off when the user prefers reduced motion. */
  animated?: boolean | "slow"
  seed?: number
}

function useSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

function useFrame(animated: boolean | "slow") {
  const [frame, setFrame] = React.useState(0)
  React.useEffect(() => {
    if (!animated || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setFrame((x) => (x + 1) % 3), animated === "slow" ? 500 : 166)
    return () => clearInterval(id)
  }, [animated])
  return frame
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const f = (n: number) => Math.round(n * 10) / 10

function focusPath(w: number, h: number, ox: number, oy: number, hole: number, density: number, seed: number) {
  const rand = rng(seed)
  const cx = (w * ox) / 100
  const cy = (h * oy) / 100
  const R = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 4
  const n = Math.round(60 + density * 200)
  let d = ""
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (rand() - 0.5) * ((Math.PI * 2) / n)
    const spread = (0.004 + rand() * 0.012) * (0.6 + density)
    const inner = hole * (0.85 + rand() * 0.7)
    const tip: [number, number] = [cx + Math.cos(a) * (w / 2) * inner, cy + Math.sin(a) * (h / 2) * inner]
    const p1: [number, number] = [cx + Math.cos(a - spread) * R, cy + Math.sin(a - spread) * R]
    const p2: [number, number] = [cx + Math.cos(a + spread) * R, cy + Math.sin(a + spread) * R]
    d += `M${f(tip[0])} ${f(tip[1])}L${f(p1[0])} ${f(p1[1])}L${f(p2[0])} ${f(p2[1])}Z`
  }
  return d
}

function motionPath(w: number, h: number, direction: number, density: number, seed: number) {
  const rand = rng(seed)
  const a = (direction * Math.PI) / 180
  // extent of the box along the lines (D) and across them (span), in the rotated frame
  const D = Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a))
  const span = Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))
  const n = Math.round(span / (9 - density * 6))
  let d = ""
  for (let i = 0; i < n; i++) {
    const y = h / 2 - span / 2 + rand() * span
    const len = D * (0.25 + rand() * 0.6)
    const x0 = w / 2 - D / 2 + rand() * (D - len)
    const x1 = x0 + len
    const t = 0.6 + rand() * 2.6 * (0.5 + density)
    const xm = x0 + len * (0.3 + rand() * 0.4)
    d += `M${f(x0)} ${f(y)}L${f(xm)} ${f(y - t / 2)}L${f(x1)} ${f(y)}L${f(xm)} ${f(y + t / 2)}Z`
  }
  return d
}

/**
 * Emphasis lines drawn in SVG at the real size: radial focus lines with an empty
 * centre, or tapered parallel motion lines. Children sit on top with a paper knockout.
 */
function SpeedLines({
  variant = "focus",
  originX = 50,
  originY = 50,
  hole = 0.35,
  direction = 0,
  density = 0.6,
  animated = false,
  seed = 11,
  className,
  children,
  ...props
}: SpeedLinesProps) {
  const [ref, { w, h }] = useSize<HTMLDivElement>()
  const frame = useFrame(animated)
  const s = seed + frame * 101
  const d =
    w > 0
      ? variant === "focus"
        ? focusPath(w, h, originX, originY, hole, density, s)
        : motionPath(w, h, direction, density, s)
      : ""
  return (
    <div
      ref={ref}
      data-manga="speed-lines"
      data-variant={variant}
      data-animated={animated || undefined}
      className={cn("relative isolate overflow-hidden bg-[var(--tone-paper,var(--background))]", className)}
      {...props}
    >
      {w > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full">
          <path
            d={d}
            transform={variant === "motion" ? `rotate(${direction} ${w / 2} ${h / 2})` : undefined}
            style={{ fill: "var(--lines-ink, var(--tone-ink, currentColor))" }}
          />
        </svg>
      )}
      {children !== undefined && <div className="contents knockout">{children}</div>}
    </div>
  )
}

export { SpeedLines }
