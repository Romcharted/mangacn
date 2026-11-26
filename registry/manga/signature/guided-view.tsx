"use client"

import * as React from "react"
import { cn } from "cn"
import { Scan } from "lucide-react"

import { Button } from "@/components/ui/manga/button"
import { Page } from "@/components/manga/panel"
import { pageGeometry, type PageData } from "@/components/manga/page-geometry"
import type { ReaderStripPage } from "@/components/manga/reader-strip"
import { ReadingProgress } from "@/components/manga/reading-progress"

/*
 * Guided view: a manga read panel by panel, made for phones. The screen zooms from one panel to the next,
 * following the panel geometry of the page model (pageGeometry: every panel's box, in reading order).
 * Pages are page data (PageData, drawn by Page) or scans with their panel boxes. The panels around the one
 * being read hide under a paper veil with wide dots; "Whole page" shows the page with every panel to tap.
 * Gestures: G1 the stage is a 3px panel · G5 the camera moves in four steps (333 ms), a new page slides in
 * from the side it comes from · G3 the page edges show a paper plate with a brush arrow on hover; in the
 * whole page a panel's line thickens on hover · G7 a ReadingProgress counts the panels. A finger drag follows
 * the finger, then turns or snaps back. Reduced motion: the camera jumps, every state stays.
 */

/** A box in percent of the page (0–100). */
export type GuidedRect = { x: number; y: number; w: number; h: number }
/** A scan, with the box of each panel in reading order. */
export type GuidedImagePage = ReaderStripPage & { panels: (GuidedRect & { label?: string })[] }
/** A page of the page model (PageData), drawn by Page; its panels come from pageGeometry. */
export type GuidedDataPage = { page: PageData; alt?: string }
export type GuidedPage = GuidedImagePage | GuidedDataPage
export type GuidedPosition = { page: number; panel: number }

export type GuidedViewProps = Omit<React.ComponentProps<"section">, "children"> & {
  pages: GuidedPage[]
  position?: GuidedPosition
  defaultPosition?: GuidedPosition
  onPositionChange?: (position: GuidedPosition) => void
  /** Reading order of the taps, swipes and arrows (and of data pages that do not say). */
  direction?: "rtl" | "ltr"
  /** Shown after the last panel (e.g. a ChapterEnd). */
  end?: React.ReactNode
  onEnd?: () => void
  /** Extra buttons in the toolbar. */
  toolbar?: React.ReactNode
}

const isData = (p: GuidedPage): p is GuidedDataPage => "page" in p
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
/** The width a page is drawn at before the camera scales it (lettering in page units scales with it). */
const DRAW_W = 900
const MARGIN = 14
const SWIPE = 48

type Laid = { ratio: number; panels: { rect: GuidedRect; label: string }[] }

function layout(p: GuidedPage, direction: "rtl" | "ltr"): Laid {
  if (isData(p)) {
    const g = pageGeometry({ ...p.page, reading: p.page.reading ?? direction })
    return {
      ratio: g.width / g.height,
      panels: g.panels.map((q, i) => ({ rect: q.rect, label: q.data.label ?? `Panel ${i + 1}` })),
    }
  }
  return { ratio: p.width / p.height, panels: p.panels.map((r, i) => ({ rect: r, label: r.label ?? `Panel ${i + 1}` })) }
}

function Arrow({ to }: { to: "left" | "right" }) {
  return <span aria-hidden className={cn("mark-arrow shrink-0 text-lg", to === "left" ? "-rotate-90" : "rotate-90")} />
}

function GuidedView({
  pages,
  position: positionProp,
  defaultPosition = { page: 0, panel: 0 },
  onPositionChange,
  direction = "rtl",
  end,
  onEnd,
  toolbar,
  className,
  onKeyDown: onKeyDownProp,
  "aria-label": ariaLabel = "Guided reading",
  ...props
}: GuidedViewProps) {
  const rtl = direction === "rtl"
  const laid = React.useMemo(() => pages.map((p) => layout(p, direction)), [pages, direction])
  const [inner, setInner] = React.useState(defaultPosition)
  const [atEnd, setAtEnd] = React.useState(false)
  const pos = positionProp ?? inner
  const pi = clamp(pos.page, 0, Math.max(0, pages.length - 1))
  const page = laid[pi]
  const panelCount = page?.panels.length ?? 0
  const ki = clamp(pos.panel, 0, Math.max(0, panelCount - 1))
  const [overview, setOverview] = React.useState(false)
  const dotsId = `mg-guided-dots-${React.useId().replace(/:/g, "")}`

  /* Stage size. */
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
  }, [])

  /* The camera: the panel's box (or the whole page) fitted in the stage, centred. */
  const drawH = page ? DRAW_W / page.ratio : 0
  const target: GuidedRect = overview || !page?.panels[ki] ? { x: 0, y: 0, w: 100, h: 100 } : page.panels[ki].rect
  const bw = (target.w / 100) * DRAW_W
  const bh = (target.h / 100) * drawH
  const scale = stage.w && bw && bh ? Math.min((stage.w - 2 * MARGIN) / bw, (stage.h - 2 * MARGIN) / bh, overview ? Infinity : 4) : 0
  const bx = (target.x / 100) * DRAW_W
  const by = (target.y / 100) * drawH
  const tx = stage.w / 2 - scale * (bx + bw / 2)
  const ty = stage.h / 2 - scale * (by + bh / 2)
  // the hole of the veil: the panel on screen, a few pixels larger
  const hole = { x: tx + scale * bx - 3, y: ty + scale * by - 3, w: scale * bw + 6, h: scale * bh + 6 }

  /* While the camera travels the veil steps aside, then comes back on the new panel. */
  const [travelling, setTravelling] = React.useState(false)
  const firstMove = React.useRef(true)
  React.useEffect(() => {
    if (firstMove.current) {
      firstMove.current = false
      return
    }
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setTravelling(true)
    const t = window.setTimeout(() => setTravelling(false), 340)
    return () => window.clearTimeout(t)
  }, [pi, ki, overview])

  const callbacks = React.useRef({ onPositionChange, onEnd })
  React.useEffect(() => {
    callbacks.current = { onPositionChange, onEnd }
  })
  const turn = React.useRef(1)
  const [pageTurns, setPageTurns] = React.useState(0)
  const goTo = (next: GuidedPosition, way: 1 | -1) => {
    setAtEnd(false)
    if (next.page !== pi) {
      turn.current = way
      setPageTurns((n) => n + 1)
    }
    if (positionProp === undefined) setInner(next)
    callbacks.current.onPositionChange?.(next)
  }
  const next = () => {
    if (atEnd) return
    setOverview(false)
    if (ki < panelCount - 1) goTo({ page: pi, panel: ki + 1 }, 1)
    else if (pi < pages.length - 1) goTo({ page: pi + 1, panel: 0 }, 1)
    else if (end) {
      turn.current = 1
      setPageTurns((n) => n + 1)
      setAtEnd(true)
      callbacks.current.onEnd?.()
    } else callbacks.current.onEnd?.()
  }
  const prev = () => {
    setOverview(false)
    if (atEnd) {
      turn.current = -1
      setPageTurns((n) => n + 1)
      setAtEnd(false)
      return
    }
    if (ki > 0) goTo({ page: pi, panel: ki - 1 }, -1)
    else if (pi > 0) goTo({ page: pi - 1, panel: Math.max(0, laid[pi - 1].panels.length - 1) }, -1)
  }
  const hasPrev = atEnd || ki > 0 || pi > 0
  const hasNext = !atEnd && (ki < panelCount - 1 || pi < pages.length - 1 || !!end)

  /* Pointer: a horizontal drag follows the finger, then turns or snaps back. */
  const [drag, setDrag] = React.useState(0)
  const pointer = React.useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null)
  const swallowClick = React.useRef(false)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    if (!p || p.id !== e.pointerId) return
    const dx = e.clientX - p.x
    const dy = e.clientY - p.y
    if (!p.moved) {
      if (Math.hypot(dx, dy) < 8) return
      if (Math.abs(dy) > Math.abs(dx)) {
        pointer.current = null
        return
      }
      p.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setDrag(dx)
  }
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointer.current
    pointer.current = null
    if (!p || p.id !== e.pointerId || !p.moved) return
    swallowClick.current = true
    window.setTimeout(() => (swallowClick.current = false), 0)
    const dx = e.clientX - p.x
    setDrag(0)
    if (Math.abs(dx) < SWIPE) return
    if (rtl ? dx > 0 : dx < 0) next()
    else prev()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onKeyDownProp?.(e as never)
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    if ((e.target as HTMLElement).closest("input, textarea, select, [role=dialog]")) return
    const act: Record<string, () => void> = {
      ArrowLeft: rtl ? next : prev,
      ArrowRight: rtl ? prev : next,
      PageDown: next,
      PageUp: prev,
      " ": next,
      Home: () => goTo({ page: 0, panel: 0 }, -1),
      End: () => goTo({ page: pages.length - 1, panel: Math.max(0, laid[pages.length - 1].panels.length - 1) }, 1),
    }
    const run = act[e.key]
    if (!run) return
    e.preventDefault()
    run()
  }

  const total = laid.reduce((s, l) => s + l.panels.length, 0)
  const done = laid.slice(0, pi).reduce((s, l) => s + l.panels.length, 0) + ki + 1
  const label = atEnd ? "End" : `Panel ${ki + 1} / ${panelCount} · Page ${pi + 1} / ${pages.length}`
  const spoken = atEnd
    ? "End of the chapter."
    : overview
      ? `Page ${pi + 1} of ${pages.length}, whole page. Choose a panel.`
      : `${page?.panels[ki]?.label ?? `Panel ${ki + 1}`}. Panel ${ki + 1} of ${panelCount}, page ${pi + 1} of ${pages.length}.`
  const current = pages[pi]

  const edge = (side: "left" | "right") => {
    const isNext = rtl ? side === "left" : side === "right"
    if (isNext ? !hasNext : !hasPrev) return null
    return (
      <button
        type="button"
        data-slot="guided-view-edge"
        aria-label={isNext ? "Next panel" : "Previous panel"}
        tabIndex={-1}
        onClick={() => {
          if (swallowClick.current) return
          if (isNext) next()
          else prev()
        }}
        className={cn(
          "group/edge absolute inset-y-0 z-20 flex w-[34%] cursor-pointer items-center bg-transparent outline-none",
          side === "left" ? "left-0 justify-start ps-2" : "right-0 justify-end pe-2",
        )}
      >
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
    <Button key="prev" variant="outline" size="icon" aria-label="Previous panel" disabled={!hasPrev} onClick={prev} className="max-sm:size-11">
      <Arrow to={rtl ? "right" : "left"} />
    </Button>
  )
  const nextButton = (
    <Button key="next" variant="outline" size="icon" aria-label="Next panel" disabled={!hasNext} onClick={next} className="max-sm:size-11">
      <Arrow to={rtl ? "left" : "right"} />
    </Button>
  )

  return (
    <section
      data-manga="guided-view"
      data-reading={direction}
      data-overview={overview || undefined}
      aria-label={ariaLabel}
      aria-roledescription="guided reader"
      onKeyDown={onKeyDown}
      className={cn("relative flex h-[min(46rem,86svh)] min-h-[24rem] w-full flex-col gap-2 bg-background text-foreground", className)}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={spoken}
        data-slot="guided-view-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointer.current = null
          setDrag(0)
        }}
        style={{ touchAction: "pan-y pinch-zoom" }}
        className="relative min-h-0 flex-1 overflow-hidden border-ink-panel bg-background select-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-7px] focus-visible:outline-ring"
      >
        {atEnd ? (
          <div key="end" className="absolute inset-0 overflow-y-auto p-3 animate-slide-in" style={{ "--slide-dir": rtl ? -1 : 1 } as React.CSSProperties}>
            <div className="mx-auto grid min-h-full max-w-lg items-center">{end}</div>
          </div>
        ) : (
          current &&
          scale > 0 && (
            <div
              key={pi}
              className={cn("absolute inset-0", pageTurns > 0 && "animate-slide-in")}
              style={{ "--slide-dir": turn.current * (rtl ? -1 : 1) } as React.CSSProperties}
            >
              {/* the page, drawn at a fixed width and moved by the camera */}
              <div
                data-slot="guided-view-page"
                className={cn(
                  "absolute top-0 origin-top-left bg-background [direction:ltr]",
                  drag === 0 && "transition-transform duration-[333ms] ease-[steps(4)] motion-reduce:transition-none",
                )}
                style={{ width: DRAW_W, height: drawH, transform: `translate(${tx + drag}px, ${ty}px) scale(${scale})`, left: 0, right: "auto" }}
              >
                {isData(current) ? (
                  <Page page={{ ...current.page, reading: current.page.reading ?? direction }} fold="never" label={current.alt ?? `Page ${pi + 1}`} />
                ) : (
                  <img src={current.src} alt={current.alt} width={current.width} height={current.height} draggable={false} className="block size-full" />
                )}
              </div>
            </div>
          )
        )}

        {/* the veil: paper with wide dots over everything but the panel being read */}
        {!atEnd && !overview && scale > 0 && (
          <svg
            aria-hidden
            data-slot="guided-view-veil"
            className={cn("pointer-events-none absolute inset-0 z-10 size-full text-foreground", (travelling || drag !== 0) && "invisible")}
          >
            <defs>
              <pattern id={dotsId} width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="1.1" fill="currentColor" />
                <circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" />
              </pattern>
            </defs>
            <path
              fillRule="evenodd"
              fill="var(--background)"
              d={`M0 0H${stage.w}V${stage.h}H0Z M${hole.x} ${hole.y}h${hole.w}v${hole.h}h${-hole.w}Z`}
            />
            <path
              fillRule="evenodd"
              fill={`url(#${dotsId})`}
              d={`M0 0H${stage.w}V${stage.h}H0Z M${hole.x - 6} ${hole.y - 6}h${hole.w + 12}v${hole.h + 12}h${-hole.w - 12}Z`}
            />
          </svg>
        )}

        {/* whole page: every panel is a target */}
        {!atEnd && overview && scale > 0 && page && (
          <div className="absolute inset-0 z-20">
            {page.panels.map((p, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${p.label} (panel ${i + 1})`}
                aria-current={i === ki ? "true" : undefined}
                onClick={() => {
                  setOverview(false)
                  goTo({ page: pi, panel: i }, i >= ki ? 1 : -1)
                }}
                className="absolute cursor-pointer bg-transparent hover:shadow-[inset_0_0_0_3px_var(--foreground)] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=true]:shadow-[inset_0_0_0_2px_var(--background),inset_0_0_0_6px_var(--foreground)]"
                style={{
                  left: tx + scale * (p.rect.x / 100) * DRAW_W,
                  top: ty + scale * (p.rect.y / 100) * drawH,
                  width: scale * (p.rect.w / 100) * DRAW_W,
                  height: scale * (p.rect.h / 100) * drawH,
                }}
              />
            ))}
          </div>
        )}

        {!overview && edge("left")}
        {!overview && edge("right")}
      </div>

      <div data-slot="guided-view-toolbar" className="grid gap-2">
        <ReadingProgress value={atEnd ? 100 : total ? (done / total) * 100 : 0} showValue valueText={label} label="Panels read" />
        <div className="flex items-center justify-between gap-1 [direction:ltr]">
          {rtl ? nextButton : prevButton}
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1 [direction:initial]">
            <Button
              variant={overview ? "default" : "outline"}
              aria-pressed={overview}
              disabled={atEnd}
              onClick={() => setOverview((o) => !o)}
              className="max-sm:min-h-11"
            >
              <Scan />
              Whole page
            </Button>
            {toolbar}
          </div>
          {rtl ? prevButton : nextButton}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {spoken}
      </p>
    </section>
  )
}

export { GuidedView }
