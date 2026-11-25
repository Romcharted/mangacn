"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Manga page layout: PanelGrid is the page, Panel a case (G1) placed on its grid, PanelCaption the
 * narration box. In manga reading order (reading="rtl" here, or data-reading="rtl" on <html>) the
 * panels flow right to left; text inside them stays left to right.
 */

export type PanelGridProps = React.ComponentProps<"div"> & {
  /** Columns of the page grid. */
  cols?: number
  /** Rows of the page grid (equal heights). Leave out for rows sized by content. */
  rows?: number
  /** Gutter between panels (any CSS length). */
  gap?: string
  /** Panel order: left to right, or right to left (manga). Defaults to the page setting. */
  reading?: "ltr" | "rtl"
}

function PanelGrid({ cols = 3, rows, gap = "0.6rem", reading, className, style, ...props }: PanelGridProps) {
  return (
    <div
      data-manga="panel-grid"
      data-reading={reading}
      className={cn(
        "grid bg-background p-3 [direction:ltr] reading-rtl:[direction:rtl] *:[direction:ltr]",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
        gap,
        ...style,
      }}
      {...props}
    />
  )
}

export type PanelProps = React.ComponentProps<"div"> & {
  colSpan?: number
  rowSpan?: number
  /**
   * Cuts one side on a slant (size in px, default 32). Give the neighbour the opposite cut with the
   * same size and the gutter between them stays parallel. Follows the reading order.
   */
  cut?: { side: "start" | "end"; size?: number }
  /** An ink panel (paper lines), e.g. for a flashback or a night scene. */
  ink?: boolean
}

function useSize() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

function Panel({ colSpan, rowSpan, cut, ink = false, className, style, children, ...props }: PanelProps) {
  const [ref, { w, h }] = useSize()
  const c = cut?.size ?? 32
  // outline in px, left-to-right; mirrored for manga reading order
  const pts =
    cut?.side === "end"
      ? [[0, 0], [w, 0], [w - c, h], [0, h]]
      : cut?.side === "start"
        ? [[c, 0], [w, 0], [w, h], [0, h]]
        : [[0, 0], [w, 0], [w, h], [0, h]]
  const poly = (mirror: boolean) => `polygon(${pts.map(([x, y]) => `${mirror ? w - x : x}px ${y}px`).join(", ")})`
  const measured = w > 0
  return (
    <div
      ref={ref}
      data-manga="panel"
      data-cut={cut?.side}
      className={cn(
        "relative isolate min-h-24 overflow-hidden",
        ink ? "bg-foreground text-background [--tone-ink:var(--background)] [--tone-paper:var(--foreground)]" : "bg-background text-foreground",
        measured ? "[clip-path:var(--panel-clip)] reading-rtl:[clip-path:var(--panel-clip-rtl)]" : "border-ink-panel",
        className,
      )}
      style={
        {
          gridColumn: colSpan ? `span ${colSpan}` : undefined,
          gridRow: rowSpan ? `span ${rowSpan}` : undefined,
          "--panel-clip": measured ? poly(false) : undefined,
          "--panel-clip-rtl": measured ? poly(true) : undefined,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
      {/* The frame: a 3px line along the (possibly slanted) outline, drawn over the art. */}
      {measured && (
        <svg aria-hidden viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 z-20 size-full reading-rtl:-scale-x-100">
          <polygon
            points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={ink ? "var(--background)" : "var(--foreground)"}
            strokeWidth="6"
          />
        </svg>
      )}
    </div>
  )
}

export type PanelCaptionProps = React.ComponentProps<"div"> & {
  /** Corner of the panel the narration box sits in. */
  position?: "top-start" | "top-end" | "bottom-start" | "bottom-end"
}

const positions = {
  "top-start": "top-2 start-2",
  "top-end": "top-2 end-2",
  "bottom-start": "bottom-2 start-2",
  "bottom-end": "bottom-2 end-2",
}

/** Narration box (récitatif): a case inside the panel, 2px and without a shadow (G1). */
function PanelCaption({ position = "top-start", className, ...props }: PanelCaptionProps) {
  return (
    <div
      data-manga="panel-caption"
      className={cn(
        "absolute z-10 max-w-[70%] border-[length:var(--mg-bw)] border-foreground bg-background px-2 py-1 font-letter text-sm leading-tight tracking-wide text-foreground uppercase",
        positions[position],
        className,
      )}
      {...props}
    />
  )
}

export { Panel, PanelCaption, PanelGrid }
