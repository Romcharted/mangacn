import * as React from "react"
import { cn } from "cn"

export type StatProps = React.ComponentProps<"div"> & {
  label: React.ReactNode
  value: React.ReactNode
  /** Change since last period, e.g. "+12%". Its direction draws a brush arrow. */
  delta?: React.ReactNode
  trend?: "up" | "down" | "flat"
  /** Focus lines around the case (never under the number) for a figure that matters. */
  emphasis?: boolean
}

/*
 * A key figure in a case (G1): label in lettering, the number in the SFX face, a brush arrow for the trend
 * (G8). With emphasis, concentration lines burst around the case.
 */
function Stat({ label, value, delta, trend = "flat", emphasis = false, className, ...props }: StatProps) {
  return (
    <div data-manga="stat" className={cn("relative isolate", emphasis && "p-5", className)} {...props}>
      {emphasis && <span aria-hidden className="absolute inset-0 -z-10 focus-lines [--focus-hole:40%_42%] animate-pop" />}
      <div className="relative ink-case grid gap-1 px-4 py-3">
        <span className="font-letter text-base tracking-wide uppercase">{label}</span>
        <span className="font-sfx text-4xl leading-none">{value}</span>
        {delta && (
          <span className="inline-flex items-center gap-1.5 text-sm">
            {trend !== "flat" && (
              <span aria-hidden className={cn("mark-arrow text-base", trend === "down" && "rotate-180")} />
            )}
            <span className="sr-only">{trend === "up" ? "Up" : trend === "down" ? "Down" : "Unchanged"}:</span>
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}

export { Stat }
