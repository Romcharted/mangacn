import * as React from "react"
import { cn } from "cn"

export type BurstProps = React.ComponentProps<"div"> & {
  /** ink: ink flat, paper text · paper: paper flat with an ink outline · accent: accent flat */
  variant?: "ink" | "paper" | "accent"
  /** Number of spikes. */
  points?: number
  /** Fidgets in steps on hover (G3 for a burst); always with "always". Off with reduced motion. */
  animated?: boolean | "always"
  seed?: number
}

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

function starPath(points: number, seed: number) {
  const rand = rng(seed)
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? 47 + rand() * 3 : 31 + rand() * 6
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`)
  }
  return `M${pts.join("L")}Z`
}

/** A starburst (G8 "new", or any shout) with its content centred on a flat, never on a tone (rule A). */
function Burst({ variant = "ink", points = 14, animated = true, seed = 5, className, children, ...props }: BurstProps) {
  const d = React.useMemo(() => starPath(points, seed), [points, seed])
  const fill = variant === "ink" ? "var(--foreground)" : variant === "accent" ? "var(--mg-accent)" : "var(--background)"
  return (
    <div
      data-manga="burst"
      data-variant={variant}
      className={cn(
        "group/burst relative isolate inline-grid min-h-24 min-w-24 place-items-center px-10 py-8 text-center font-sfx leading-tight animate-pop",
        variant === "paper" ? "text-foreground" : "text-background",
        variant === "accent" && "text-primary-foreground dark:text-foreground",
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn(
          "absolute inset-0 -z-10 size-full overflow-visible",
          animated === "always" && "animate-jitter",
          animated === true && "group-hover/burst:animate-jitter",
        )}
      >
        <path d={d} fill={fill} stroke="var(--foreground)" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="miter" />
      </svg>
      <span className="relative">{children}</span>
    </div>
  )
}

export { Burst }
