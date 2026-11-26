"use client"

import * as React from "react"
import { cn } from "cn"

import { prefersReducedMotion } from "@/lib/manga/gestures"

/*
 * Scene transition: a wipe that sweeps across the screen (or a container) between two sections or two
 * pages, in steps. Four frames to cover, a hold, four frames to uncover, at 12 fps; the new scene is
 * swapped in while the screen is covered (`onCovered`). It sweeps in the reading direction (right to left
 * with data-reading="rtl") or downward. During the hold an optional caption (a narration box: "Meanwhile…")
 * pops in the middle.
 * Variants: ink (an ink flat), tone (a 50% screentone on paper, edged with ink), panels (four ink panels
 * with paper gutters, dropped one per frame).
 * Reduced motion: no wipe; the scene is swapped at once (`onCovered`, then `onDone`).
 * The overlay is aria-hidden and catches clicks while it plays; move focus to the new scene yourself.
 */

/** One frame at 12 fps. */
const FRAME = 83
/** Frames to cover, and to uncover. */
const STEPS = 4

export type SceneTransitionVariant = "ink" | "tone" | "panels"

export type SceneTransitionOptions = {
  variant?: SceneTransitionVariant
  /** reading: across, in the reading order · down: from top to bottom. */
  direction?: "reading" | "down"
  /** screen: fixed over the viewport · container: over the nearest positioned ancestor. */
  scope?: "screen" | "container"
  /** Frames the screen stays covered (default 2). */
  hold?: number
  /** A caption shown in the middle while covered (a narration box). */
  caption?: React.ReactNode
  className?: string
}

type Range = { lo: number; hi: number }

/** Covered part of the sweep, in quarters, for a frame (1-based). */
function rangeAt(frame: number, hold: number): Range {
  if (frame <= STEPS) return { lo: 0, hi: frame }
  if (frame <= STEPS + hold) return { lo: 0, hi: STEPS }
  return { lo: Math.min(STEPS, frame - STEPS - hold), hi: STEPS }
}

function Wipe({ frame, hold, variant = "ink", direction = "reading", scope = "screen", caption, className }: SceneTransitionOptions & { frame: number; hold: number }) {
  const { lo, hi } = rangeAt(frame, hold)
  const across = direction === "reading"
  const covered = lo === 0 && hi === STEPS
  const pct = (q: number) => `${(q / STEPS) * 100}%`
  const span = (from: number, to: number): React.CSSProperties =>
    across ? { left: pct(from), width: pct(to - from), top: 0, bottom: 0 } : { top: pct(from), height: pct(to - from), left: 0, right: 0 }

  return (
    <div
      aria-hidden
      data-manga="scene-transition"
      data-variant={variant}
      data-frame={frame}
      className={cn("pointer-events-auto isolate overflow-hidden", scope === "screen" ? "fixed inset-0 z-[100]" : "absolute inset-0 z-30", className)}
    >
      {/* mirrored for the manga reading order (or a right-to-left page) */}
      <div className={cn("absolute inset-0", across && "reading-rtl:-scale-x-100 rtl:-scale-x-100")}>
        {variant === "panels" ? (
          Array.from({ length: STEPS }, (_, i) =>
            i >= lo && i < hi ? (
              <span
                key={i}
                className={cn(
                  "absolute block bg-foreground",
                  across ? "border-x-[3px] border-background" : "border-y-[3px] border-background",
                )}
                style={span(i, i + 1)}
              />
            ) : null,
          )
        ) : hi > lo ? (
          <span
            className={cn(
              "absolute block",
              variant === "tone" ? "bg-background tone-50 [--tone-ink:var(--foreground)]" : "bg-foreground",
              variant === "tone" && (across ? "border-x-[3px] border-foreground" : "border-y-[3px] border-foreground"),
            )}
            style={span(lo, hi)}
          />
        ) : null}
      </div>
      {caption != null && covered && (
        <div className="absolute inset-0 grid place-items-center p-6">
          <span className="max-w-[min(32rem,100%)] animate-pop border-ink-panel bg-background px-4 py-2 text-center font-letter text-2xl tracking-wide text-foreground uppercase sm:text-3xl">
            {caption}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * The wipe as a hook: `play(swap)` runs the transition, calls `swap` once the screen is covered and
 * resolves when it is uncovered. Render `transition` somewhere (inside the container for scope="container").
 */
function useSceneTransition(options: SceneTransitionOptions = {}) {
  const hold = Math.max(0, options.hold ?? 2)
  const [frame, setFrame] = React.useState<number | null>(null)
  const job = React.useRef<{ swap?: () => void; done: () => void } | null>(null)

  const play = React.useCallback((swap?: () => void) => {
    return new Promise<void>((resolve) => {
      if (prefersReducedMotion()) {
        swap?.()
        resolve()
        return
      }
      job.current?.done()
      job.current = { swap, done: resolve }
      setFrame(1)
    })
  }, [])

  React.useEffect(() => {
    if (frame === null) return
    if (frame === STEPS) {
      job.current?.swap?.()
      if (job.current) job.current.swap = undefined
    }
    if (frame >= STEPS * 2 + hold) {
      const id = window.setTimeout(() => {
        setFrame(null)
        job.current?.done()
        job.current = null
      }, FRAME)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setFrame((f) => (f === null ? null : f + 1)), FRAME)
    return () => window.clearTimeout(id)
  }, [frame, hold])

  React.useEffect(() => () => job.current?.done(), [])

  const transition = frame !== null ? <Wipe {...options} frame={frame} hold={hold} /> : null
  return { play, transition, playing: frame !== null }
}

export type SceneTransitionProps = SceneTransitionOptions & {
  /** Plays once each time it turns true. */
  playing: boolean
  /** The screen is covered: swap the scene now. */
  onCovered?: () => void
  /** The new scene is uncovered. */
  onDone?: () => void
  /** Freezes the wipe on one frame (1–10 with the default hold): for previews and state grids. */
  frame?: number
}

/** The wipe as a component: it plays when `playing` turns true. */
function SceneTransition({ playing, onCovered, onDone, frame, ...options }: SceneTransitionProps) {
  const { play, transition } = useSceneTransition(options)
  const handlers = React.useRef({ onCovered, onDone })
  React.useEffect(() => {
    handlers.current = { onCovered, onDone }
  })
  React.useEffect(() => {
    if (!playing || frame !== undefined) return
    void play(() => handlers.current.onCovered?.()).then(() => handlers.current.onDone?.())
  }, [playing, frame, play])
  if (frame !== undefined) return <Wipe {...options} frame={frame} hold={Math.max(0, options.hold ?? 2)} />
  return transition
}

export { SceneTransition, useSceneTransition }
