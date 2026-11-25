"use client"

/*
 * mangacn gestures — the small JavaScript half of the grammar (the CSS half lives in base).
 * G4 Impact needs a trigger that outlives :active (keyboard included); G5 Pop gets a flash of
 * concentration lines behind important windows. Everything is skipped with reduced motion.
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
 * G4 Impact: short speed lines on both sides, outside the element, shown while an ancestor has
 * `data-impact`. The parent must be positioned. `offset` pushes them further out (e.g. for bursts).
 */
export function ImpactLines({ className, offset = "normal" }: { className?: string; offset?: "normal" | "far" }) {
  const side =
    "pointer-events-none invisible absolute top-1/2 h-6 w-4 -translate-y-1/2 text-foreground in-data-[impact]:animate-hit-lines"
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
 * G5 Pop, important windows: concentration lines behind the window for the first frames after it
 * opens. Place it first inside a positioned window. The box reaches past the screen and its middle
 * (the window) is masked out, so the lines never cover the content. Hidden with reduced motion.
 */
export function FocusFlash({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-manga="focus-flash"
      className={cn(
        "pointer-events-none invisible absolute -inset-[100vmax] -z-10 p-[100vmax] text-foreground focus-lines [--focus-hole:1px_1px]",
        "[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] animate-burst-lines",
        className,
      )}
    />
  )
}
