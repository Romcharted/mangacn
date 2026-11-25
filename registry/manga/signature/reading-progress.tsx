"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Reading progress: a 2px ink baseline with a fill-lines bar sitting on it (G7). The bar shares the outer
 * edge of the baseline and grows inward, in whole pixels: 4px at rest, 6px while the reader scrolls.
 * Manga reading order (reading-rtl) fills from the right. Measured with requestAnimationFrame, or
 * controlled with `value` (then the width moves in steps; reduced motion keeps the value, not the motion).
 */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/**
 * Scroll progress in percent (0–100, one decimal) of `target` — its own scroll if it scrolls, else how far
 * the window has moved through it — or of the window. `active` is true while scrolling.
 */
function useScrollProgress(target?: React.RefObject<HTMLElement | null>, enabled = true) {
  const [value, setValue] = React.useState(0)
  const [active, setActive] = React.useState(false)
  React.useEffect(() => {
    if (!enabled) return
    const el = target?.current ?? null
    let frame = 0
    let idle = 0
    let moving = false
    const measure = () => {
      frame = 0
      let r: number
      if (el && el.scrollHeight - el.clientHeight > 1) {
        r = el.scrollTop / (el.scrollHeight - el.clientHeight)
      } else if (el) {
        const box = el.getBoundingClientRect()
        const total = box.height - window.innerHeight
        r = total > 0 ? -box.top / total : box.bottom <= window.innerHeight ? 1 : 0
      } else {
        const total = document.documentElement.scrollHeight - window.innerHeight
        r = total > 0 ? window.scrollY / total : 1
      }
      setValue(Math.round(clamp(r, 0, 1) * 1000) / 10)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    const onScroll = () => {
      schedule()
      if (!moving) {
        moving = true
        setActive(true)
      }
      clearTimeout(idle)
      idle = window.setTimeout(() => {
        moving = false
        setActive(false)
      }, 333)
    }
    measure()
    el?.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", schedule)
    const ro = el ? new ResizeObserver(schedule) : null
    if (el) ro?.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(idle)
      el?.removeEventListener("scroll", onScroll)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", schedule)
      ro?.disconnect()
    }
  }, [target, enabled])
  return { value, active }
}

export type ReadingProgressPosition = "top" | "bottom" | "inline"

export type ReadingProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 0–100. Leave out to measure the scroll of `target` (or the window). */
  value?: number
  /** Element whose scroll progress is measured. Default: the window. */
  target?: React.RefObject<HTMLElement | null>
  /** top / bottom: fixed to that edge of the viewport · inline: in the flow. */
  position?: ReadingProgressPosition
  /** Accessible name. */
  label?: string
  /** Shows the value as a small text (valueText, or "42 %"). */
  showValue?: boolean
  /** Text for the value, e.g. "Page 3 / 8". Also read by screen readers. */
  valueText?: string
}

const outer: Record<ReadingProgressPosition, string> = {
  top: "fixed inset-x-0 top-0 z-50",
  bottom: "fixed inset-x-0 bottom-0 z-50",
  inline: "relative flex w-full min-w-0 items-center gap-3",
}

function ReadingProgress({
  value,
  target,
  position = "inline",
  label = "Reading progress",
  showValue = false,
  valueText,
  className,
  ...props
}: ReadingProgressProps) {
  const controlled = value !== undefined
  const measured = useScrollProgress(target, !controlled)
  const pct = clamp(controlled ? value : measured.value, 0, 100)
  // a controlled value that changes also runs the line for a moment (4 frames)
  const [bump, setBump] = React.useState(false)
  const first = React.useRef(true)
  React.useEffect(() => {
    if (!controlled) return
    if (first.current) {
      first.current = false
      return
    }
    setBump(true)
    const t = window.setTimeout(() => setBump(false), 333)
    return () => window.clearTimeout(t)
  }, [controlled, value])
  const moving = controlled ? bump : measured.active
  const text = valueText ?? `${Math.round(pct)} %`
  const bottom = position === "bottom"
  return (
    <div
      data-manga="reading-progress"
      data-position={position}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-valuetext={text}
      className={cn(outer[position], className)}
      {...props}
    >
      <div className="relative h-1.5 w-full min-w-0 flex-1 bg-background reading-rtl:[direction:rtl]">
        {/* the 2px baseline, on the edge facing the content */}
        <span aria-hidden className={cn("absolute inset-x-0 h-0.5 bg-foreground", bottom ? "top-0" : "bottom-0")} />
        {/* the bar shares the baseline's outer edge and grows inward: 4px, 6px while scrolling */}
        <span
          aria-hidden
          data-moving={moving || undefined}
          className={cn(
            // at rest the 4px window of fill-lines is solid ink; at 6px a paper speed line runs through it
            "absolute start-0 h-1 fill-lines [background-position:0_-8px] data-[moving]:h-1.5 data-[moving]:[background-position:0_-1px]",
            bottom ? "top-0" : "bottom-0",
            controlled && "transition-[width] duration-[333ms] ease-[steps(4)]",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <span
          aria-hidden
          className={cn(
            "font-mono text-xs leading-none whitespace-nowrap text-foreground tabular-nums",
            position === "inline"
              ? "shrink-0 text-sm"
              : cn("absolute end-2 border-ink-fine bg-background px-1.5 py-1", bottom ? "bottom-full mb-1" : "top-full mt-1"),
          )}
        >
          {text}
        </span>
      )}
    </div>
  )
}

export { ReadingProgress, useScrollProgress }
