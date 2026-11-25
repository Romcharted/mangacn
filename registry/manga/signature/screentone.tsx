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
  /** background: tone behind the children · layer: absolute overlay on top of the parent */
  as?: "background" | "layer"
  /** Seed for the noise pattern. */
  seed?: number
}

const BANDS = 5

function toneColor(density: number) {
  const k = density <= 12 ? 10 : density <= 25 ? 20 : density <= 42 ? 35 : 50
  return `var(--tone-ink-${k}, var(--tone-ink, currentColor))`
}

function patternStyle(pattern: ScreentonePattern, density: number, size: number): React.CSSProperties {
  const d = Math.min(0.6, Math.max(0.02, density / 100))
  const c = toneColor(density)
  if (pattern === "dots") {
    const r = `calc(${size}px * max(${(Math.sqrt(d / (2 * Math.PI))).toFixed(3)}, var(--tone-solid, 0)))`
    const dot = `radial-gradient(circle, ${c} ${r}, #0000 calc(${r} + 0.5px))`
    return {
      backgroundImage: `${dot}, ${dot}`,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `0 0, ${size / 2}px ${size / 2}px`,
    }
  }
  if (pattern === "lines") {
    const t = Math.max(0.6, size * d).toFixed(2)
    return { backgroundImage: `repeating-linear-gradient(0deg, ${c} 0 ${t}px, #0000 ${t}px ${size}px)` }
  }
  if (pattern === "cross") {
    const t = Math.max(0.6, size * (1 - Math.sqrt(1 - d))).toFixed(2)
    return {
      backgroundImage: `repeating-linear-gradient(0deg, ${c} 0 ${t}px, #0000 ${t}px ${size}px), repeating-linear-gradient(90deg, ${c} 0 ${t}px, #0000 ${t}px ${size}px)`,
    }
  }
  return {}
}

function Noise({ density, size, seed }: { density: number; size: number; seed: number }) {
  const id = React.useId()
  const tile = size * 10
  let s = seed >>> 0 || 1
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
  const r = size * 0.18
  const count = Math.round(((density / 100) * tile * tile) / (Math.PI * r * r))
  return (
    <svg className="absolute inset-0 size-full">
      <defs>
        <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
          {Array.from({ length: count }, (_, i) => (
            <circle key={i} cx={rand() * tile} cy={rand() * tile} r={r * (0.6 + rand() * 0.8)} style={{ fill: toneColor(density) }} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

function Layer({ pattern, density, angle, size, seed }: Required<Pick<ScreentoneProps, "pattern" | "density" | "angle" | "size" | "seed">>) {
  const rotate = pattern === "dots" ? angle - 45 : angle
  return (
    <div
      className="absolute start-1/2 top-1/2 size-[250vmax] -translate-1/2 rtl:translate-x-1/2"
      style={{ rotate: `${rotate}deg`, ...patternStyle(pattern, density, size) }}
    >
      {pattern === "noise" && <Noise density={density} size={size} seed={seed} />}
    </div>
  )
}

/**
 * Screentone as a component: any pattern, density, angle and cell size, with a
 * stepped (never smooth) fade. Coloured by --tone-ink; soft flats in the webtoon theme.
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
  const layer = { pattern, density, angle, size, seed }
  const bands =
    fade === "none"
      ? null
      : Array.from({ length: BANDS }, (_, i) => {
          const from = `${(i / BANDS) * 100}%`
          const to = `${100 - ((i + 1) / BANDS) * 100}%`
          const inset: React.CSSProperties =
            fade === "bottom"
              ? { top: from, bottom: to, insetInline: 0 }
              : fade === "top"
                ? { bottom: from, top: to, insetInline: 0 }
                : fade === "end"
                  ? { insetInlineStart: from, insetInlineEnd: to, insetBlock: 0 }
                  : { insetInlineEnd: from, insetInlineStart: to, insetBlock: 0 }
          return { inset, density: density * (1 - i / BANDS) }
        })
  return (
    <div
      data-manga="screentone"
      data-pattern={pattern}
      className={cn(
        as === "layer" ? "pointer-events-none absolute inset-0" : "relative isolate",
        className,
      )}
      {...props}
    >
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", as === "background" && "-z-10")}>
        {bands
          ? bands.map((b, i) => (
              <div key={i} className="absolute overflow-hidden" style={b.inset}>
                <Layer {...layer} density={b.density} />
              </div>
            ))
          : <Layer {...layer} />}
      </div>
      {as === "background" && children !== undefined && <div className="contents knockout">{children}</div>}
    </div>
  )
}

export { Screentone }
