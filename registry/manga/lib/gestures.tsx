"use client"

/*
 * mangacn gestures — the small JavaScript half of the grammar (the CSS half lives in base).
 * G4 Impact needs a trigger that outlives :active (keyboard included); G5 Pop gets a flash of
 * halo of concentration lines around a window, on request. Everything is skipped with reduced motion.
 */
import * as React from "react"
import { cn } from "cn"

export function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
}

const timers = new WeakMap<Element, number>()

/**
 * G4 Impact: (re)starts the three-frame hit on an element by setting `data-impact` for ~250 ms.
 * Pair the element with `data-[impact]:animate-hit` and put an <ImpactLines /> inside it.
 */
export function punch(el: Element | null | undefined) {
  if (!el || prefersReducedMotion()) return
  el.removeAttribute("data-impact")
  void (el as HTMLElement).offsetWidth // restart on quick repeats
  el.setAttribute("data-impact", "")
  window.clearTimeout(timers.get(el))
  timers.set(el, window.setTimeout(() => el.removeAttribute("data-impact"), 260))
}

/** Wraps a click handler so it also plays the impact on the clicked element. */
export function withImpact<E extends React.SyntheticEvent>(handler?: (event: E) => void) {
  return (event: E) => {
    handler?.(event)
    punch(event.currentTarget as Element)
  }
}

function lines(flip: boolean) {
  return (
    <svg
      viewBox="0 0 16 24"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("size-full", flip ? "-scale-x-100 rtl:scale-x-100" : "rtl:-scale-x-100")}
    >
      <path d="M2 4h12M7 9h7M0 14h14M8 19h6" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  )
}

/**
 * G4 Impact: short speed lines on both sides, outside the element, shown while their parent has
 * `data-impact` or is pressed. Put them directly inside the element that hits, which must be positioned. `offset` pushes them further out (e.g. for bursts).
 * `press={false}` for an element that is not a control (a counter): the lines then only follow `data-impact`.
 */
export function ImpactLines({
  className,
  offset = "normal",
  press = true,
}: {
  className?: string
  offset?: "normal" | "far"
  press?: boolean
}) {
  const side = cn(
    // Out of the layout at rest (hidden, not only invisible): lines that stick out of a full-width button
    // would otherwise widen the page and scroll it sideways on a phone.
    "pointer-events-none invisible hidden absolute top-1/2 h-6 w-4 -translate-y-1/2 text-foreground [[data-impact]>&]:block [[data-impact]>&]:animate-hit-lines",
    // Parent only, never in-*: :active matches every ancestor up to <html>, so a click anywhere on the
    // page would show the lines of every button. [:active>&]: the lines also show while the element
    // itself is pressed, so the click keeps an impact without JavaScript.
    press && "[:active>&]:block [:active>&]:visible",
  )
  return (
    <>
      <span
        aria-hidden
        data-manga="impact-lines"
        className={cn(side, "origin-right rtl:origin-left", offset === "far" ? "-start-10" : "-start-6", className)}
      >
        {lines(false)}
      </span>
      <span
        aria-hidden
        data-manga="impact-lines"
        className={cn(side, "origin-left rtl:origin-right", offset === "far" ? "-end-10" : "-end-6", className)}
      >
        {lines(true)}
      </span>
    </>
  )
}

/**
 * G5 Pop, optional: a halo of concentration lines in a 24px band around a window, for its first frames.
 * Never full screen, never on by default (Dialog and Alert Dialog take `flash`). Place it first inside
 * the positioned window; the window itself is masked out, so the lines never cover the content.
 */
export function FocusFlash({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-manga="focus-flash"
      className={cn(
        "pointer-events-none invisible absolute -inset-6 -z-10 p-6 text-foreground focus-lines [--focus-hole:1px_1px]",
        "[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] animate-halo",
        className,
      )}
    />
  )
}

/**
 * G6 Bubble: the tail of a floating bubble (tooltip, popover, hover card), pointing at the trigger.
 * Placed from its parent's data-side (Radix and Base UI both set it on the popup): put it directly inside. Its fill hides the
 * bubble outline under it. `weight` matches the bubble's line (2 or 3 px).
 */
export function BubbleTail({ variant = "speech", weight = 2 }: { variant?: "speech" | "thought"; weight?: 2 | 3 }) {
  // Direct parent only ([[data-side=…]>&]), so a bubble nested in another popup keeps its own side.
  const pos = cn(
    "pointer-events-none absolute overflow-visible",
    "[[data-side=top]>&]:top-full [[data-side=top]>&]:start-5",
    "[[data-side=bottom]>&]:bottom-full [[data-side=bottom]>&]:start-5 [[data-side=bottom]>&]:-scale-y-100",
    "[[data-side=left]>&]:left-full [[data-side=left]>&]:top-1/2 [[data-side=left]>&]:-translate-y-1/2 [[data-side=left]>&]:-rotate-90",
    "[[data-side=right]>&]:right-full [[data-side=right]>&]:top-1/2 [[data-side=right]>&]:-translate-y-1/2 [[data-side=right]>&]:rotate-90",
    weight === 3
      ? "[[data-side=top]>&]:-mt-[4px] [[data-side=bottom]>&]:-mb-[4px] [[data-side=left]>&]:-ml-[4px] [[data-side=right]>&]:-mr-[4px]"
      : "[[data-side=top]>&]:-mt-[3px] [[data-side=bottom]>&]:-mb-[3px] [[data-side=left]>&]:-ml-[3px] [[data-side=right]>&]:-mr-[3px]",
  )
  const style = { fill: "var(--background)", stroke: "var(--foreground)", strokeWidth: weight, strokeLinejoin: "round" as const }
  return variant === "speech" ? (
    <svg aria-hidden data-manga="bubble-tail" width="16" height="12" viewBox="0 0 16 12" className={pos}>
      <path d="M1 0 Q4 6 3 11 Q9 7 13 0" style={style} vectorEffect="non-scaling-stroke" />
    </svg>
  ) : (
    <svg aria-hidden data-manga="bubble-tail" width="16" height="20" viewBox="0 0 16 20" className={pos}>
      <circle cx="6" cy="7" r="4" style={style} />
      <circle cx="3" cy="16" r="2.2" style={style} />
    </svg>
  )
}
