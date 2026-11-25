"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Versus panel. Gestures: G1 case (the outer frame), G2 flat (the highlighted side is an ink flat), G8 burst
 * (the VS mark, shape-burst). The two halves are split by a 3px ink diagonal: side by side from a container
 * width of 36rem (@xl), stacked below it, where the split becomes a zig from left to right with the VS on it.
 * The halves are clipped in CSS and overlap by --vs, so the seam is shared; the seam line is drawn from the
 * measured size. Contents keep clear of the seam and of the VS mark.
 */

const SLANT = 12 // px: the seam's offset from the middle, on each side of it (set in --vs below)

const SideIndex = React.createContext(0)

// Stacked (default) and side by side (@xl). Halves overlap by 2 * --vs in the stacked flow, and by --vs
// on the inline axis side by side; clip-path draws the diagonal inside each box.
const SIDE_CLASSES = [
  [
    "px-5 pt-5 pb-[calc(2*var(--vs)_+_2.25rem)] [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_2*var(--vs)),0_100%)]",
    "@xl:pb-5 @xl:pe-[calc(2*var(--vs)_+_2.5rem)] @xl:-me-[var(--vs)] @xl:[clip-path:polygon(0_0,100%_0,calc(100%_-_2*var(--vs))_100%,0_100%)]",
  ].join(" "),
  [
    "px-5 pt-[calc(2*var(--vs)_+_2.25rem)] pb-5 -mt-[calc(2*var(--vs))] [clip-path:polygon(0_calc(2*var(--vs)),100%_0,100%_100%,0_100%)]",
    "@xl:mt-0 @xl:pt-5 @xl:-ms-[var(--vs)] @xl:ps-[calc(2*var(--vs)_+_2.5rem)] @xl:pe-5 @xl:[clip-path:polygon(calc(2*var(--vs))_0,100%_0,100%_100%,0_100%)]",
  ].join(" "),
]

export type VersusPanelProps = React.ComponentProps<"div"> & {
  /** Lettering on the crossing mark. Decorative: the mark is aria-hidden. */
  label?: string
}

export type VersusSideProps = React.ComponentProps<"section"> & {
  /** The recommended side: an ink flat with paper text. */
  highlight?: boolean
}

/** Two halves split by an ink diagonal, with a VS burst at the crossing. Give each side an accessible name. */
function VersusPanel({ label = "VS", className, children, ...props }: VersusPanelProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [geo, setGeo] = React.useState({ w: 0, h: 0, t: 0 })

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const first = el.querySelector<HTMLElement>('[data-versus-side="0"]')
      setGeo({ w: el.clientWidth, h: el.clientHeight, t: first?.offsetHeight ?? 0 })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.querySelectorAll("[data-versus-side]").forEach((s) => ro.observe(s))
    return () => ro.disconnect()
  }, [])

  const sides = React.Children.toArray(children).slice(0, 2)

  return (
    <div
      ref={ref}
      data-manga="versus-panel"
      className={cn("@container ink-case relative isolate block [--vs:12px]", className)}
      {...props}
    >
      <div className="grid grid-cols-1 @xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {sides.map((side, i) => (
          <SideIndex.Provider key={i} value={i}>
            {side}
          </SideIndex.Provider>
        ))}
      </div>
      {geo.w > 0 && (
        <>
          {/* stacked: the seam runs from the left edge at the first side's bottom to the right edge, 2 * SLANT higher */}
          <svg aria-hidden viewBox={`0 0 ${geo.w} ${geo.h}`} className="pointer-events-none absolute inset-0 z-20 size-full @xl:hidden">
            <line x1={0} y1={geo.t} x2={geo.w} y2={geo.t - 2 * SLANT} stroke="var(--foreground)" strokeWidth={3} />
          </svg>
          {/* side by side: the seam runs from the top, SLANT right of the middle, to the bottom, SLANT left of it */}
          <svg aria-hidden viewBox={`0 0 ${geo.w} ${geo.h}`} className="pointer-events-none absolute inset-0 z-20 hidden size-full @xl:block">
            <line x1={geo.w / 2 + SLANT} y1={0} x2={geo.w / 2 - SLANT} y2={geo.h} stroke="var(--foreground)" strokeWidth={3} />
          </svg>
        </>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute start-1/2 top-[var(--vs-top,50%)] z-30 -translate-x-1/2 -translate-y-1/2 @xl:top-1/2"
        style={geo.w > 0 ? ({ "--vs-top": `${geo.t - SLANT}px` } as React.CSSProperties) : undefined}
      >
        <span className="absolute -inset-1.5 bg-background shape-burst" />
        <span className="relative grid size-12 place-items-center bg-foreground font-sfx text-base leading-none text-background shape-burst">
          {label}
        </span>
      </div>
    </div>
  )
}

/** One half: a region with its own name. `highlight` makes it the ink flat. */
function VersusSide({ highlight = false, className, children, ...props }: VersusSideProps) {
  const index = React.useContext(SideIndex)
  return (
    <section
      data-manga="versus-side"
      data-versus-side={index}
      data-highlight={highlight || undefined}
      className={cn(
        "relative isolate min-w-0",
        SIDE_CLASSES[index === 0 ? 0 : 1],
        highlight ? "ink-fill" : "bg-background text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export { VersusPanel, VersusSide }
