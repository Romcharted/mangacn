import * as React from "react"
import { cn } from "cn"

export type ScreentonePattern = "dots" | "lines" | "cross" | "noise"
export type ScreentoneFade = "none" | "top" | "bottom" | "start" | "end"

export type ScreentoneProps = React.ComponentProps<"div"> & {
  pattern?: ScreentonePattern
  /** Ink coverage in percent (5–60). Common tones: 10, 20, 35, 50. */
  density?: number
  /** Screen angle in degrees. Dots default to the classic 45°. */
  angle?: number
  /** Cell size in px (smaller = finer screen). */
  size?: number
  /** Stepped fade toward a side. Logical sides follow `dir`. */
  fade?: ScreentoneFade
  /** background: tone behind the children (put labels on a plate) · layer: overlay on top of the parent */
  as?: "background" | "layer"
  /** Seed for the noise pattern. */
  seed?: number
}

const BANDS = 5
const INK = { fill: "var(--tone-ink, currentColor)" }

/** One SVG <pattern> tile, rotated with patternTransform (no oversized rotated layers). */
function Tile({ id, pattern, density, angle, size, seed }: { id: string } & Required<Pick<ScreentoneProps, "pattern" | "density" | "angle" | "size" | "seed">>) {
  const d = Math.min(0.6, Math.max(0.02, density / 100))
  if (pattern === "noise") {
    const tile = size * 10
    let s = seed >>> 0 || 1
    const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
    const r = size * 0.18
    const count = Math.round((d * tile * tile) / (Math.PI * r * r))
    return (
      <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
        {Array.from({ length: count }, (_, i) => (
          <circle key={i} cx={rand() * tile} cy={rand() * tile} r={r * (0.6 + rand() * 0.8)} style={INK} />
        ))}
      </pattern>
    )
  }
  if (pattern === "dots") {
    // two dots per cell (diamond lattice) at 45°; patternTransform turns the lattice
    const r = size * Math.sqrt(d / (2 * Math.PI))
    return (
      <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle - 45})`}>
        <circle cx={size / 4} cy={size / 4} r={r} style={INK} />
        <circle cx={(size * 3) / 4} cy={(size * 3) / 4} r={r} style={INK} />
      </pattern>
    )
  }
  const t = pattern === "lines" ? Math.max(0.6, size * d) : Math.max(0.6, size * (1 - Math.sqrt(1 - d)))
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <rect width={size} height={t} style={INK} />
      {pattern === "cross" && <rect width={t} height={size} style={INK} />}
    </pattern>
  )
}

/**
 * Screentone as a component: any pattern, density, angle and cell size, with a
 * stepped (never smooth) fade. One small SVG pattern per band, coloured by --tone-ink.
 */
function Screentone({
  pattern = "dots",
  density = 20,
  angle = 45,
  size = 6,
  fade = "none",
  as = "background",
  seed = 3,
  className,
  children,
  ...props
}: ScreentoneProps) {
  const uid = React.useId().replace(/:/g, "")
  const bands =
    fade === "none"
      ? [{ x: "0", y: "0", w: "100%", h: "100%", density }]
      : Array.from({ length: BANDS }, (_, i) => {
          const from = (i / BANDS) * 100
          const len = 100 / BANDS
          // start/end are logical: the SVG is mirrored in RTL (see className below)
          const vertical = fade === "top" || fade === "bottom"
          const pos = fade === "bottom" || fade === "end" ? from : 100 - from - len
          return vertical
            ? { x: "0", y: `${pos}%`, w: "100%", h: `${len}%`, density: density * (1 - i / BANDS) }
            : { x: `${pos}%`, y: "0", w: `${len}%`, h: "100%", density: density * (1 - i / BANDS) }
        })
  return (
    <div
      data-manga="screentone"
      data-pattern={pattern}
      className={cn(as === "layer" ? "pointer-events-none absolute inset-0" : "relative isolate", className)}
      {...props}
    >
      <svg
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 size-full",
          as === "background" && "-z-10",
          (fade === "start" || fade === "end") && "rtl:-scale-x-100",
        )}
      >
        <defs>
          {bands.map((b, i) => (
            <Tile key={i} id={`${uid}-${i}`} pattern={pattern} density={b.density} angle={angle} size={size} seed={seed} />
          ))}
        </defs>
        {bands.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={`url(#${uid}-${i})`} />
        ))}
      </svg>
      {as === "background" && children}
    </div>
  )
}

export { Screentone }
