"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "cn"
import { Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "@/components/ui/manga/button"
import { ReaderPage, type ReaderStripPage } from "@/components/manga/reader-strip"
import { ReadingProgress } from "@/components/manga/reading-progress"

/*
 * Page reader: a manga read page by page, one page or a two-page spread, in manga (right to left) or western
 * order. Turn with the page edges, the arrow keys, a swipe or the toolbar; zoom (buttons, + / -, double
 * click) and pan; full screen (the Fullscreen API, or a fixed immersive mode when it is missing or refused).
 * The pages around the current one are fetched ahead.
 * Gestures: G1 the stage is a 3px panel, each page keeps ReaderPage's ink frame, loading and error panels ·
 * G5 a turned page slides in from the side it comes from (animate-slide-in, three steps) · G3 a page edge
 * shows a paper plate with a brush arrow on hover · G7 ReadingProgress under the stage. While a finger drags
 * the page, it follows the finger with no steps; letting go snaps back or turns.
 */

export type PageReaderPage = ReaderStripPage
export type PageReaderSpread = "single" | "double" | "auto"
export type PageReaderDirection = "rtl" | "ltr"
export type PageReaderFit = "contain" | "width" | "height"
export type PageReaderBackground = "paper" | "ink" | "tone"

export type PageReaderProps = Omit<React.ComponentProps<"section">, "children" | "onChange"> & {
  pages: PageReaderPage[]
  /** Index of the first page shown (0-based); `pages.length` is the end view when `end` is set. */
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  /** single · double (two-page spreads) · auto: double when the stage is wide and landscape. */
  spread?: PageReaderSpread
  /** In spreads, the first page (the cover) stands alone. */
  coverAlone?: boolean
  /** rtl: manga order, the next page is on the left · ltr: western order. */
  direction?: PageReaderDirection
  /** contain: whole page in view · width: fill the width (scrolls down) · height: fill the height. */
  fit?: PageReaderFit
  /** What shows around the pages. */
  background?: PageReaderBackground
  /** Pages fetched ahead of (and behind) the current one. */
  preload?: number
  /** Shown after the last page, as one more view (e.g. a ChapterEnd). */
  end?: React.ReactNode
  /** Called when the reader reaches the end view, or asks past the last page when there is none. */
  onEnd?: () => void
  /** Extra buttons in the toolbar (settings, thumbnails…). */
  toolbar?: React.ReactNode
}

const ZOOMS = [1, 1.5, 2, 3]
const SWIPE = 56
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** Pages grouped into views: [[0], [1, 2], [3, 4]…] in spreads with the cover alone. */
function buildViews(count: number, double: boolean, coverAlone: boolean) {
  const views: number[][] = []
  let i = 0
  if (double && coverAlone && count > 0) views.push([i++])
  while (i < count) {
    if (double && i + 1 < count) views.push([i, i + 1])
    else views.push([i])
    i += double ? 2 : 1
  }
  return views
}

/** A brush arrow (the base `mark-arrow` points up). */
function Arrow({ to }: { to: "left" | "right" }) {
  return <span aria-hidden className={cn("mark-arrow shrink-0 text-lg", to === "left" ? "-rotate-90" : "rotate-90")} />
}

type Screen = "off" | "immersive" | "native"

function PageReader({
  pages,
  page: pageProp,
  defaultPage = 0,
  onPageChange,
  spread = "auto",
  coverAlone = true,
  direction = "rtl",
  fit = "contain",
  background = "paper",
  preload = 2,
  end,
  onEnd,
  toolbar,
  className,
  onKeyDown: onKeyDownProp,
  "aria-label": ariaLabel = "Pages",
  ...props
}: PageReaderProps) {
  const rtl = direction === "rtl"
  const [inner, setInner] = React.useState(defaultPage)
  const page = clamp(pageProp ?? inner, 0, end ? pages.length : Math.max(0, pages.length - 1))
  const [screen, setScreen] = React.useState<Screen>("off")
  const full = screen !== "off"

  /* Stage size: decides auto spreads and the page size. */
  const stageRef = React.useRef<HTMLDivElement>(null)
  const [stage, setStage] = React.useState({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => setStage({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
    // full screen moves the reader into a portal: a new stage element to watch
  }, [full])

  const double = spread === "double" || (spread === "auto" && stage.w >= 720 && stage.w > stage.h)
  const views = React.useMemo(() => {
    const v = buildViews(pages.length, double, coverAlone)
    if (end) v.push([pages.length])
    return v
  }, [pages.length, double, coverAlone, end])
  const viewIndex = Math.max(0, views.findIndex((v) => v.includes(page)))
  const view = views[viewIndex] ?? [0]
  const atEnd = Boolean(end) && view[0] === pages.length

  /* Turning. `turn` remembers the way we went, for the side the page slides in from. */
  const turn = React.useRef(0)
  const [turned, setTurned] = React.useState(0)
  const callbacks = React.useRef({ onPageChange, onEnd })
  React.useEffect(() => {
    callbacks.current = { onPageChange, onEnd }
  })
  const [zoom, setZoom] = React.useState(1)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })

  const goView = (to: number) => {
    if (to >= views.length) {
      if (!end) callbacks.current.onEnd?.()
      return
    }
    if (to < 0 || to === viewIndex) return
    turn.current = to > viewIndex ? 1 : -1
    setTurned((n) => n + 1)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    const first = views[to][0]
    if (pageProp === undefined) setInner(first)
    callbacks.current.onPageChange?.(first)
    if (end && first === pages.length) callbacks.current.onEnd?.()
  }
  const next = () => goView(viewIndex + 1)
  const prev = () => goView(viewIndex - 1)
  const hasPrev = viewIndex > 0
  const hasNext = viewIndex < views.length - 1

  /* Preloading: the pages around the view; a page known to be loaded shows at once (no loading panel). */
  const [loaded, setLoaded] = React.useState<ReadonlySet<string>>(() => new Set())
  React.useEffect(() => {
    const from = Math.max(0, view[0] - preload)
    const to = Math.min(pages.length - 1, view[view.length - 1] + preload)
    const imgs: HTMLImageElement[] = []
    for (let i = from; i <= to; i++) {
      const src = pages[i]?.src
      if (!src || loaded.has(src)) continue
      const img = new Image()
      img.decoding = "async"
      img.onload = () => setLoaded((s) => (s.has(src) ? s : new Set(s).add(src)))
      img.src = src
      imgs.push(img)
    }
    return () => imgs.forEach((img) => (img.onload = null))
  }, [view, pages, preload, loaded])

  /* Page size from the fit. `chrome` is what ReaderPage adds around the art (its frame, the dark mat). */
  const [chrome, setChrome] = React.useState(4)
  const spreadRef = React.useRef<HTMLDivElement>(null)
  React.useLayoutEffect(() => {
    const fig = spreadRef.current?.querySelector<HTMLElement>("[data-slot=reader-page]")
    const art = fig?.querySelector<HTMLElement>("[style*=aspect-ratio]")
    if (fig && art) {
      const c = fig.offsetWidth - art.clientWidth
      if (c >= 0 && c !== chrome) setChrome(c)
    }
  })
  const shown = atEnd ? [] : view.map((i) => pages[i]).filter(Boolean)
  const pad = 24
  const aw = Math.max(0, stage.w - pad - shown.length * chrome)
  const ah = Math.max(0, stage.h - pad - chrome)
  const ratio = shown.reduce((s, p) => s + p.width / p.height, 0) || 1
  const artH = fit === "width" ? aw / ratio : fit === "height" ? ah : Math.min(ah, aw / ratio)
  const widthOf = (p: PageReaderPage) => Math.max(0, Math.floor(artH * (p.width / p.height) + chrome))

  /* Pointer: a swipe turns (the page follows the finger), a drag pans when zoomed, a double click zooms. */
  const [drag, setDrag] = React.useState(0)
  const [moving, setMoving] = React.useState(false)
  const pointer = React.useRef<{ id: number; x: number; y: number; pan: { x: number; y: number }; moved: boolean } | null>(null)
  const swallowClick = React.useRef(false)
  const maxPan = (z: number) => ({ x: (stage.w * (z - 1)) / 2, y: (stage.h * (z - 1)) / 2 })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, pan, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    if (!p || p.id !== e.pointerId) return
    const dx = e.clientX - p.x
    const dy = e.clientY - p.y
    if (!p.moved) {
      if (Math.hypot(dx, dy) < 8) return
      // a mostly vertical move at zoom 1 is a scroll: leave it to the browser
      if (zoom === 1 && Math.abs(dy) > Math.abs(dx)) {
        pointer.current = null
        return
      }
      p.moved = true
      setMoving(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (zoom > 1) {
      const m = maxPan(zoom)
      setPan({ x: clamp(p.pan.x + dx, -m.x, m.x), y: clamp(p.pan.y + dy, -m.y, m.y) })
    } else {
      // at the first or last view the page resists (a third of the move)
      const forward = rtl ? dx > 0 : dx < 0
      setDrag((forward ? hasNext : hasPrev) ? dx : dx / 3)
    }
  }
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    pointer.current = null
    if (!p || p.id !== e.pointerId || !p.moved) return
    setMoving(false)
    swallowClick.current = true
    window.setTimeout(() => (swallowClick.current = false), 0)
    if (zoom === 1) {
      const dx = e.clientX - p.x
      setDrag(0)
      if (Math.abs(dx) >= SWIPE) {
        const forward = rtl ? dx > 0 : dx < 0
        if (forward) next()
        else prev()
      }
    }
  }
  const onPointerCancel = () => {
    pointer.current = null
    setMoving(false)
    setDrag(0)
  }
  const zoomTo = (z: number, at?: { x: number; y: number }) => {
    const nz = clamp(z, ZOOMS[0], ZOOMS[ZOOMS.length - 1])
    if (nz === 1) {
      setZoom(1)
      setPan({ x: 0, y: 0 })
      return
    }
    const el = stageRef.current
    let nx = (pan.x * nz) / zoom
    let ny = (pan.y * nz) / zoom
    if (at && el) {
      // keep the point under the pointer where it is
      const box = el.getBoundingClientRect()
      const cx = at.x - box.left - box.width / 2
      const cy = at.y - box.top - box.height / 2
      nx = cx - ((cx - pan.x) * nz) / zoom
      ny = cy - ((cy - pan.y) * nz) / zoom
    }
    const m = maxPan(nz)
    setZoom(nz)
    setPan({ x: clamp(nx, -m.x, m.x), y: clamp(ny, -m.y, m.y) })
  }
  const zoomStep = (dir: 1 | -1) => {
    const at = ZOOMS.findIndex((z) => z >= zoom)
    zoomTo(ZOOMS[clamp((at < 0 ? ZOOMS.length - 1 : at) + dir, 0, ZOOMS.length - 1)])
  }

  /* Keyboard: arrows follow the reading direction; Page Up / Down, Home / End; + / - / 0 zoom. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onKeyDownProp?.(e as React.KeyboardEvent<HTMLElement> as never)
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    const t = e.target as HTMLElement
    if (t.closest("input, textarea, select, [contenteditable=true], [role=slider], [role=menu], [role=listbox], [role=dialog]")) return
    const act: Record<string, () => void> = {
      ArrowLeft: rtl ? next : prev,
      ArrowRight: rtl ? prev : next,
      PageDown: next,
      PageUp: prev,
      Home: () => goView(0),
      End: () => goView(views.length - 1),
      "+": () => zoomStep(1),
      "=": () => zoomStep(1),
      "-": () => zoomStep(-1),
      "0": () => zoomTo(1),
    }
    const run = act[e.key]
    if (!run) return
    e.preventDefault()
    run()
  }

  /* Full screen: the immersive layout at once (the fallback), then the browser's full screen if it agrees. */
  const wantFull = React.useRef(false)
  const enterFull = () => {
    wantFull.current = true
    setScreen("immersive")
    const doc = document.documentElement
    if (!document.fullscreenEnabled || typeof doc.requestFullscreen !== "function") return
    doc.requestFullscreen().then(
      () => {
        if (wantFull.current) setScreen("native")
        else void document.exitFullscreen().catch(() => {})
      },
      () => {},
    )
  }
  const exitFull = () => {
    wantFull.current = false
    setScreen("off")
    if (document.fullscreenElement === document.documentElement) void document.exitFullscreen().catch(() => {})
  }
  React.useEffect(() => {
    if (screen !== "native") return
    const onChange = () => {
      if (!document.fullscreenElement) {
        wantFull.current = false
        setScreen("off")
      }
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [screen])
  React.useEffect(() => {
    if (screen !== "immersive") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      // Escape inside a sheet or dialog opened from the toolbar closes that, not the full screen
      if ((document.activeElement as HTMLElement | null)?.closest("[role=dialog], [role=alertdialog]")) return
      wantFull.current = false
      setScreen("off")
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [screen])
  React.useEffect(
    () => () => {
      if (wantFull.current && document.fullscreenElement === document.documentElement) void document.exitFullscreen().catch(() => {})
    },
    [],
  )
  // the move into (or out of) the portal drops the focus: give it back to the stage
  const firstScreen = React.useRef(true)
  React.useEffect(() => {
    if (firstScreen.current) {
      firstScreen.current = false
      return
    }
    stageRef.current?.focus({ preventScroll: !full })
    if (!full) stageRef.current?.scrollIntoView({ block: "nearest" })
  }, [full])

  const n = pages.length
  const label = atEnd ? "End" : view.length > 1 ? `${view[0] + 1}–${view[1] + 1} / ${n}` : `${view[0] + 1} / ${n}`
  const spoken = atEnd ? "End of the chapter." : view.length > 1 ? `Pages ${view[0] + 1} and ${view[1] + 1} of ${n}` : `Page ${view[0] + 1} of ${n}`
  const progress = atEnd ? 100 : n ? ((view[view.length - 1] + 1) / n) * 100 : 0
  const slideDir = turn.current * (rtl ? -1 : 1)

  const edge = (side: "left" | "right") => {
    const isNext = rtl ? side === "left" : side === "right"
    if (isNext ? !hasNext && !!end : !hasPrev) return null
    return (
      <button
        type="button"
        data-slot="page-reader-edge"
        aria-label={isNext ? "Next page" : "Previous page"}
        tabIndex={-1}
        onClick={() => {
          if (swallowClick.current) return
          if (isNext) next()
          else prev()
        }}
        className={cn(
          "group/edge absolute inset-y-0 z-10 flex w-[28%] cursor-pointer items-center bg-transparent outline-none",
          side === "left" ? "left-0 justify-start ps-2" : "right-0 justify-end pe-2",
        )}
      >
        {/* G3: the plate shows on hover (never on touch screens, which have no hover) */}
        <span
          aria-hidden
          className="invisible grid size-11 place-items-center border-ink bg-background text-foreground tone-shadow group-hover/edge:visible group-active/edge:ink-fill"
        >
          <Arrow to={side} />
        </span>
      </button>
    )
  }

  const prevButton = (
    <Button key="prev" variant="outline" size="icon" aria-label="Previous page" disabled={!hasPrev} onClick={prev} className="max-sm:size-11">
      <Arrow to={rtl ? "right" : "left"} />
    </Button>
  )
  const nextButton = (
    <Button key="next" variant="outline" size="icon" aria-label="Next page" disabled={!hasNext && !!end} onClick={next} className="max-sm:size-11">
      <Arrow to={rtl ? "left" : "right"} />
    </Button>
  )

  const reader = (
    <section
      data-manga="page-reader"
      data-reading={direction}
      data-spread={double ? "double" : "single"}
      data-fit={fit}
      data-fullscreen={full ? screen : undefined}
      aria-label={ariaLabel}
      aria-roledescription="page reader"
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex w-full flex-col gap-2 bg-background text-foreground",
        full ? "fixed inset-0 z-50 h-dvh p-2 sm:p-3" : "h-[min(48rem,88svh)] min-h-[26rem]",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={spoken}
        data-slot="page-reader-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-slot=page-reader-edge], button, a")) return
          zoomTo(zoom > 1 ? 1 : 2, { x: e.clientX, y: e.clientY })
        }}
        style={{ touchAction: zoom > 1 ? "none" : "pan-y pinch-zoom" }}
        className={cn(
          "relative min-h-0 flex-1 overflow-hidden border-ink-panel select-none",
          background === "ink" ? "bg-foreground" : background === "tone" ? "bg-background tone-20" : "bg-background",
          "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-7px] focus-visible:outline-ring",
          zoom > 1 && "cursor-grab active:cursor-grabbing",
        )}
      >
        <div
          className={cn(
            "absolute inset-0",
            // the end view (a card taller than a short stage) and fit width scroll down
            atEnd || (fit === "width" && zoom === 1) ? "overflow-x-hidden overflow-y-auto" : fit === "height" && zoom === 1 ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden",
          )}
        >
          <div
            key={viewIndex}
            className={cn("flex min-h-full w-max min-w-full items-center justify-center p-3", turned > 0 && "animate-slide-in")}
            style={{ "--slide-dir": slideDir || 1 } as React.CSSProperties}
          >
            {atEnd ? (
              <div data-slot="page-reader-end" className="mx-auto w-full max-w-lg">
                {end}
              </div>
            ) : (
              <div
                ref={spreadRef}
                data-slot="page-reader-spread"
                className={cn(
                  // pages in visual order, whatever the writing direction: the reading order decides the side
                  "flex items-center [direction:ltr] [&_img]:animate-none!",
                  !moving && "transition-transform duration-[166ms] ease-[steps(2)] motion-reduce:transition-none",
                )}
                style={{ transform: `translate(${pan.x + drag}px, ${pan.y}px) scale(${zoom})` }}
              >
                {(rtl ? [...shown].reverse() : shown).map((p) => {
                  const i = pages.indexOf(p)
                  return (
                    <div key={i} style={{ width: widthOf(p) }} className="shrink-0">
                      <ReaderPage page={p} index={i} count={n} status={loaded.has(p.src) ? "loaded" : undefined} className="max-w-none!" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        {zoom === 1 && edge("left")}
        {zoom === 1 && edge("right")}
        {zoom > 1 && (
          <span aria-hidden className="pointer-events-none absolute start-2 top-2 z-10 border-ink bg-background px-2 py-1 font-mono text-xs">
            {Math.round(zoom * 100)} %
          </span>
        )}
      </div>

      <div data-slot="page-reader-toolbar" className="grid gap-2">
        <ReadingProgress value={progress} showValue valueText={label} label="Pages read" />
        <div className="flex items-center justify-between gap-1 [direction:ltr]">
          {rtl ? nextButton : prevButton}
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1 [direction:initial]">
            <Button variant="outline" size="icon" aria-label="Zoom out" disabled={zoom <= ZOOMS[0]} onClick={() => zoomStep(-1)} className="max-sm:size-11">
              <ZoomOut />
            </Button>
            <Button variant="outline" size="icon" aria-label="Zoom in" disabled={zoom >= ZOOMS[ZOOMS.length - 1]} onClick={() => zoomStep(1)} className="max-sm:size-11">
              <ZoomIn />
            </Button>
            {toolbar}
            <Button
              variant={full ? "default" : "outline"}
              size="icon"
              aria-label="Full screen"
              aria-pressed={full}
              onClick={full ? exitFull : enterFull}
              className="max-sm:size-11"
            >
              {full ? <Minimize /> : <Maximize />}
            </Button>
          </div>
          {rtl ? prevButton : nextButton}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {spoken}
      </p>
    </section>
  )
  // Full screen: the reader moves to the end of <body>, so no ancestor's stacking context (a transform, an
  // isolate, a sticky header) can sit above it. A Sheet opened from the toolbar still portals after it.
  return full && typeof document !== "undefined" ? createPortal(reader, document.body) : reader
}

export { PageReader }
