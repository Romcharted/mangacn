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

/*
 * The reading line. A reader counts the page being read, not the page that happens to cross the middle of the
 * view: the current page is the last page whose top has crossed a line a third of the way down the visible
 * part of the view, under the sticky header. Page 1 until page 2 crosses that line; the last page once the
 * bottom of the last page is in view. Used by ReaderStrip, the Manga reader and Author site blocks, and any
 * page counter shown in a ReadingProgress (useReadingPage).
 */

export type ReadingArea = { top: number; bottom: number }

/** The nearest ancestor that scrolls vertically, or null for the window. */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let p = el?.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY
    if (o === "auto" || o === "scroll" || o === "overlay") return p
  }
  return null
}

/** The sticky or fixed element `hit` sits in (below `stop`), if it is not an ancestor of `el`. */
function stuckBar(hit: Element | null, el: HTMLElement, stop: HTMLElement | null): HTMLElement | null {
  for (let n = hit; n && n !== stop && n !== document.body; n = n.parentElement) {
    if (n === el || n.contains(el)) return null
    const p = getComputedStyle(n).position
    if (p === "sticky" || p === "fixed") return n as HTMLElement
  }
  return null
}

/**
 * The visible part of the view `el` scrolls in (its nearest scrolling ancestor, or the window), cut to the
 * window, under the sticky or fixed bars that cover its top edge (a site header, a reader toolbar).
 */
function readingArea(el: HTMLElement): ReadingArea {
  const parent = scrollParent(el)
  const winH = document.documentElement.clientHeight
  const winW = document.documentElement.clientWidth
  const box = parent?.getBoundingClientRect()
  let top = Math.max(0, box ? box.top + parent!.clientTop : 0)
  const bottom = Math.min(winH, box ? box.top + parent!.clientTop + parent!.clientHeight : winH)
  const own = el.getBoundingClientRect()
  const x = Math.min(winW - 1, Math.max(0, own.left + own.width / 2))
  // stacked bars (a site header, then a reader toolbar): a few steps at most; a bar that would hide half the
  // view is an overlay (a dialog, a sheet), not a header
  for (let i = 0; i < 4 && bottom - top > 2; i++) {
    const bar = stuckBar(document.elementFromPoint(x, top + 1), el, parent)
    const r = bar?.getBoundingClientRect()
    if (!r || r.bottom <= top || r.bottom - top > (bottom - top) / 2) break
    top = r.bottom
  }
  return { top, bottom }
}

/** The page being read (0-based) among `pages`, in order, by the reading line of `area`. */
function readingPage(pages: ArrayLike<Element>, area: ReadingArea): number {
  const n = pages.length
  if (n === 0) return 0
  if (pages[n - 1].getBoundingClientRect().bottom <= area.bottom + 0.5) return n - 1
  const line = area.top + (area.bottom - area.top) / 3
  let index = 0
  for (let i = 1; i < n; i++) {
    if (pages[i].getBoundingClientRect().top <= line) index = i
    else break
  }
  return index
}

/**
 * The page being read (0-based) in a list, kept up to date on scroll and resize, for the page counter of a
 * ReadingProgress. Returns the index and a ref for the list, whose first `count` children are the pages (all
 * of them when left out): `const [page, ref] = useReadingPage(pages.length)`.
 */
function useReadingPage<T extends HTMLElement = HTMLElement>(count?: number) {
  const [el, setEl] = React.useState<T | null>(null)
  const [index, setIndex] = React.useState(0)
  React.useEffect(() => {
    if (!el) return
    let frame = 0
    const measure = () => {
      frame = 0
      const pages = Array.from(el.children).slice(0, count ?? el.children.length)
      setIndex(readingPage(pages, readingArea(el)))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    const opts = { capture: true, passive: true } as const
    document.addEventListener("scroll", schedule, opts)
    window.addEventListener("resize", schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("scroll", schedule, opts)
      window.removeEventListener("resize", schedule)
      ro.disconnect()
    }
  }, [el, count])
  return [index, setEl] as const
}


export { ReadingProgress, readingArea, readingPage, scrollParent, useReadingPage, useScrollProgress }
