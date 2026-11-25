"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/manga/button"
import { Spinner } from "@/components/ui/manga/spinner"
import { Sfx } from "@/components/manga/sfx"

/*
 * Reader strip: a vertical strip of pages for scroll (webtoon) reading. It follows the page scroll (or the
 * nearest scroll parent): no inner scroll box.
 * Gestures: G1 frames (2px ink line per page, 3px end panel) · G7 waiting (Spinner on paper, tone frame
 * around it) · G8 error (accent edge-jagged panel, "!") and done (mark-check on the end panel) · G5 the
 * page art pops in when it arrives.
 */

export type ReaderStripPage = { src: string; alt: string; width: number; height: number }
export type ReaderPageStatus = "loading" | "loaded" | "error"
export type ReaderStripGap = "none" | "sm" | "md"

const gaps: Record<ReaderStripGap, string> = { none: "gap-0", sm: "gap-3", md: "gap-8" }
const endGaps: Record<ReaderStripGap, string> = { none: "pt-0", sm: "pt-3", md: "pt-8" }

export type ReaderPageProps = {
  page: ReaderStripPage
  /** Position in the strip (0-based) and number of pages, for the labels. */
  index: number
  count: number
  /** 2px ink frame around the page. */
  framed?: boolean
  /** Freezes a state (static previews). Leave out: the image drives it. */
  status?: ReaderPageStatus
  /** Called by Retry, after the image is asked again. */
  onRetry?: (index: number) => void
  className?: string
}

/** One page: space reserved from width / height, loading and error panels, the art pops in once loaded. */
function ReaderPage({ page, index, count, framed = true, status: forced, onRetry, className }: ReaderPageProps) {
  const [status, setStatus] = React.useState<ReaderPageStatus>("loading")
  const [attempt, setAttempt] = React.useState(0)
  const img = React.useRef<HTMLImageElement>(null)
  // an image already in the cache may finish before React listens
  React.useEffect(() => {
    const el = img.current
    if (el?.complete) setStatus(el.naturalWidth > 0 ? "loaded" : "error")
  }, [attempt])
  const s = forced ?? status
  const n = index + 1
  const retry = () => {
    setStatus("loading")
    setAttempt((a) => a + 1)
    onRetry?.(index)
  }
  return (
    <figure
      data-slot="reader-page"
      data-status={s}
      className={cn("relative mx-auto w-full", className)}
      style={{ maxWidth: page.width }}
    >
      <div
        className={cn("relative w-full overflow-hidden bg-background", framed && "border-ink")}
        style={{ aspectRatio: `${page.width} / ${page.height}` }}
      >
        {s !== "error" && (
          <img
            key={attempt}
            ref={img}
            src={page.src}
            alt={page.alt}
            width={page.width}
            height={page.height}
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn("absolute inset-0 block size-full object-cover", s === "loaded" && "animate-pop")}
          />
        )}
        {s === "loading" && (
          <div className="absolute inset-0 grid place-items-center bg-background text-foreground tone-frame [--frame-w:12px]">
            <div className="flex flex-col items-center gap-2 bg-background p-2">
              <Spinner className="size-8" aria-label={`Loading page ${n}`} />
              <span aria-hidden className="font-letter text-sm tracking-wide uppercase">
                Page {n}
              </span>
            </div>
          </div>
        )}
        {s === "error" && (
          <div className="absolute inset-0 isolate grid place-items-center p-4 text-center text-primary-foreground before:absolute before:inset-0 before:-z-10 before:bg-destructive before:content-[''] before:edge-jagged">
            <div className="flex flex-col items-center gap-2">
              <span aria-hidden className="font-sfx text-5xl leading-none">
                !
              </span>
              <p className="font-letter text-base tracking-wide uppercase">Page {n} did not load</p>
              <Button variant="outline" size="sm" onClick={retry} className="max-sm:min-h-11">
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>
      <figcaption className="sr-only">
        Page {n} of {count}
      </figcaption>
    </figure>
  )
}

export type ReaderEndProps = {
  /** The SFX word. */
  title?: string
  /** The line under it. */
  children?: React.ReactNode
  className?: string
}

/** The end panel: a 3px panel, the SFX word, a brush check and a closing line. */
function ReaderEnd({ title = "END", children = "To be continued", className }: ReaderEndProps) {
  return (
    <div
      data-slot="reader-end"
      className={cn(
        "relative grid w-full place-items-center gap-3 overflow-hidden border-ink-panel bg-background px-4 py-10 text-center text-foreground",
        className,
      )}
    >
      <Sfx size="lg" rotate={-6} label={title}>
        {title}
      </Sfx>
      <p className="flex items-center gap-2 font-letter text-xl tracking-wide uppercase">
        <span aria-hidden className="mark-check shrink-0 text-2xl" />
        {children}
      </p>
    </div>
  )
}

/** The nearest ancestor that scrolls vertically, or null for the window. */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let p = el?.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY
    if (o === "auto" || o === "scroll" || o === "overlay") return p
  }
  return null
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export type ReaderStripProps = Omit<React.ComponentProps<"section">, "children" | "onProgress"> & {
  pages: ReaderStripPage[]
  /** Space between pages; with "none" the pages touch and lose their frame. */
  gap?: ReaderStripGap
  /** Scroll progress through the strip (0–1) and the page in the middle of the view (0-based). */
  onProgress?: (ratio: number, pageIndex: number) => void
  /** Called each time the end panel comes into view. */
  onEnd?: () => void
  /** Called when the reader asks a failed page again (e.g. to switch to another source). */
  onRetry?: (pageIndex: number) => void
  /** Shown after the last page. Default: the END panel. */
  end?: React.ReactNode
}

function ReaderStrip({
  pages,
  gap = "sm",
  onProgress,
  onEnd,
  onRetry,
  end,
  className,
  style,
  "aria-label": ariaLabel = "Pages",
  ...props
}: ReaderStripProps) {
  const list = React.useRef<HTMLOListElement>(null)
  const endRef = React.useRef<HTMLDivElement>(null)
  const [reached, setReached] = React.useState(false)
  const callbacks = React.useRef({ onProgress, onEnd })
  React.useEffect(() => {
    callbacks.current = { onProgress, onEnd }
  })

  React.useEffect(() => {
    const ol = list.current
    if (!ol) return
    const parent = scrollParent(ol)
    const last = { ratio: -1, index: -1, atEnd: false }
    let frame = 0
    const measure = () => {
      frame = 0
      const vTop = parent ? parent.getBoundingClientRect().top + parent.clientTop : 0
      const vH = parent ? parent.clientHeight : window.innerHeight
      const box = ol.getBoundingClientRect()
      const total = box.height - vH
      const ratio = total > 0 ? clamp01((vTop - box.top) / total) : box.bottom <= vTop + vH ? 1 : 0
      const mid = vTop + vH / 2
      const figures = ol.querySelectorAll<HTMLElement>("[data-slot=reader-page]")
      let index = 0
      figures.forEach((f, i) => {
        if (f.getBoundingClientRect().top <= mid) index = i
      })
      if (ratio >= 1) index = Math.max(0, figures.length - 1)
      if (Math.abs(ratio - last.ratio) >= 0.001 || index !== last.index) {
        last.ratio = ratio
        last.index = index
        callbacks.current.onProgress?.(ratio, index)
      }
      const endTop = endRef.current?.getBoundingClientRect().top ?? Infinity
      const atEnd = endTop < vTop + vH
      if (atEnd && !last.atEnd) {
        setReached(true)
        callbacks.current.onEnd?.()
      }
      last.atEnd = atEnd
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    const scroller: HTMLElement | Window = parent ?? window
    scroller.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(ol)
    return () => {
      cancelAnimationFrame(frame)
      scroller.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      ro.disconnect()
    }
  }, [pages.length])

  const widest = pages.reduce((w, p) => Math.max(w, p.width), 0)
  return (
    <section
      data-manga="reader-strip"
      data-gap={gap}
      aria-label={ariaLabel}
      className={cn("mx-auto w-full", className)}
      style={{ maxWidth: widest ? `min(45rem, ${widest}px)` : "45rem", ...style }}
      {...props}
    >
      <ol ref={list} className={cn("m-0 flex list-none flex-col overflow-x-clip p-0", gaps[gap])}>
        {pages.map((page, i) => (
          <li key={`${i}-${page.src}`}>
            <ReaderPage page={page} index={i} count={pages.length} framed={gap !== "none"} onRetry={onRetry} />
          </li>
        ))}
      </ol>
      <div ref={endRef} className={endGaps[gap]}>
        {end ?? <ReaderEnd key={reached ? "reached" : "waiting"} />}
      </div>
      <p aria-live="polite" className="sr-only">
        {reached ? "End of the pages." : ""}
      </p>
    </section>
  )
}

export { ReaderEnd, ReaderPage, ReaderStrip }
