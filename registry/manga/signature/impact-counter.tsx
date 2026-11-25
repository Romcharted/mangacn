"use client"

import * as React from "react"
import { cn } from "cn"

import { ImpactLines, prefersReducedMotion, punch } from "@/lib/manga/gestures"

export type ImpactCounterSize = "sm" | "default" | "lg"

export type ImpactCounterProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number
  /** Lettering after the number: likes, hits, points. */
  label?: React.ReactNode
  size?: ImpactCounterSize
  /** How the number is written (default: en-US thousands). */
  format?: (value: number) => string
  /** A small mark before the number. */
  icon?: React.ReactNode
}

const NUMBER: Record<ImpactCounterSize, string> = {
  sm: "text-2xl",
  default: "text-4xl",
  lg: "text-5xl sm:text-6xl",
}

/*
 * A number that changes with an impact (G4): when `value` changes, the number takes the three-frame hit
 * with speed lines on both sides. Going up also flashes a "+n" burst (G8), which leaves after ~0.6 s.
 * Reduced motion: only the new number. The number is a live output for screen readers.
 */
function ImpactCounter({ value, label, size = "default", format, icon, className, ...props }: ImpactCounterProps) {
  const numberRef = React.useRef<HTMLOutputElement>(null)
  const previous = React.useRef(value)
  const [mark, setMark] = React.useState<{ id: number; delta: number } | null>(null)

  React.useEffect(() => {
    const before = previous.current
    previous.current = value
    if (before === value) return
    punch(numberRef.current)
    if (value > before && !prefersReducedMotion()) {
      const id = Date.now()
      setMark({ id, delta: value - before })
      const timer = window.setTimeout(() => setMark((m) => (m && m.id === id ? null : m)), 600)
      return () => window.clearTimeout(timer)
    }
  }, [value])

  const text = format ? format(value) : value.toLocaleString("en-US")

  return (
    <span data-manga="impact-counter" data-size={size} className={cn("inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1", className)} {...props}>
      {icon && (
        <span aria-hidden className="inline-grid size-9 place-items-center">
          {icon}
        </span>
      )}
      <span className="relative inline-block">
        <output
          ref={numberRef}
          aria-live="polite"
          className={cn("relative inline-block font-sfx leading-none tabular-nums data-[impact]:animate-hit", NUMBER[size])}
        >
          {text}
          <ImpactLines press={false} />
        </output>
        {mark && (
          <span
            key={mark.id}
            aria-hidden
            className="pointer-events-none absolute -end-5 -top-4 grid size-10 animate-pop place-items-center bg-primary font-sfx text-sm leading-none text-primary-foreground shape-burst"
          >
            +{mark.delta}
          </span>
        )}
      </span>
      {label && <span className="font-letter text-base uppercase">{label}</span>}
    </span>
  )
}

export { ImpactCounter }
