"use client"

import * as React from "react"
import { cn } from "cn"

import { Page, Panel, PanelCaption, Tier } from "@/components/manga/panel"

/*
 * Yonkoma: a strip of four panels read top to bottom, to explain something in four beats (set-up,
 * development, turn, payoff). The API is only four children: each one becomes a panel.
 * Built on the page model: a free-height `Page` (format "strip") with one Tier per panel, or one Tier of four
 * panels side by side (in the reading order: right to left with data-reading="rtl"). The page model sizes its
 * lines and lettering with the page; the strip measures itself so the frames stay about 3px and the lettering
 * keeps the size it has in a phone-width column, whatever the strip's width.
 * A child given as a fragment is spread into its panel, so a `Place` inside it can cross the frame like on any page.
 */

export type YonkomaProps = Omit<React.ComponentProps<"section">, "title"> & {
  /** Exactly four children, one per panel. Extra ones are left out. */
  children: React.ReactNode
  /** The strip's title, set in lettering in a box above the first panel. */
  title?: React.ReactNode
  /** Number the panels 1 to 4 in a corner box. */
  numbered?: boolean
  /** Labels read by screen readers for each panel (default: "Panel 1 of 4"…). */
  labels?: [string, string, string, string]
  /**
   * vertical (default): the classic strip · horizontal: four in a row, in the reading order ·
   * auto: vertical, then four in a row once the strip is 40rem wide.
   */
  orientation?: "vertical" | "horizontal" | "auto"
  /** Each panel's shape: width / height, as a number or a CSS ratio ("4 / 3", the default). */
  aspect?: number | string
}

/** One tier of height 1 in a "strip" page is this share of the inner width (page-geometry). */
const STRIP_UNIT = 0.55
/** Target frame line, in CSS pixels. */
const LINE_PX = 3
/** Width at which the lettering has its page size; a narrower strip letters larger (a panel is a small page). */
const LETTERING_AT = 640

function ratio(aspect: number | string) {
  if (typeof aspect === "number") return aspect > 0 ? aspect : 4 / 3
  const [a, b] = aspect.split("/").map((n) => parseFloat(n))
  const r = b ? a / b : a
  return r > 0 ? r : 4 / 3
}

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [w, setW] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

/** A fragment child is spread into the panel, so its Place elements are direct children of the panel. */
function contents(beat: React.ReactNode): React.ReactNode {
  return React.isValidElement(beat) && beat.type === React.Fragment ? (beat.props as { children?: React.ReactNode }).children : beat
}

function Yonkoma({ children, title, numbered = true, labels, orientation = "vertical", aspect = "4 / 3", className, ...props }: YonkomaProps) {
  const beats = React.Children.toArray(children).slice(0, 4)
  const headingId = React.useId()
  const [ref, width] = useWidth<HTMLElement>()
  const row = orientation === "horizontal" || (orientation === "auto" && width >= 640)
  const r = ratio(aspect)

  // page units: the page is 100 units wide
  const unit = width > 0 ? width / 100 : 3.84
  const line = LINE_PX / unit
  const lettering = Math.min(2, Math.max(0.5, LETTERING_AT / Math.max(width, 1)))

  const panel = (beat: React.ReactNode, i: number) => (
    <Panel key={i} label={labels?.[i] ?? `Panel ${i + 1} of 4`}>
      {contents(beat)}
      {numbered && (
        <PanelCaption aria-hidden position="top-start" className="z-10 px-1.5 py-0.5 font-mono text-xs leading-none">
          {i + 1}
        </PanelCaption>
      )}
    </Panel>
  )

  return (
    <section
      ref={ref}
      data-manga="yonkoma"
      data-orientation={orientation}
      data-row={row || undefined}
      aria-labelledby={title != null ? headingId : undefined}
      className={cn("grid w-full min-w-0 gap-2", orientation === "vertical" && "max-w-sm", className)}
      {...props}
    >
      {title != null && (
        <h3 id={headingId} className="justify-self-start border-ink-panel bg-background px-3 py-1 font-letter text-xl leading-tight tracking-wide uppercase">
          {title}
        </h3>
      )}
      <Page
        format="strip"
        fold="never"
        margin={line}
        line={line}
        lettering={lettering}
        gutter={{ x: 8 / unit, y: 8 / unit }}
        label={typeof title === "string" ? title : "Four-panel strip"}
      >
        {row ? (
          <Tier height={1 / (4 * r * STRIP_UNIT)}>{beats.map(panel)}</Tier>
        ) : (
          beats.map((beat, i) => (
            <Tier key={i} height={1 / (r * STRIP_UNIT)}>
              {panel(beat, i)}
            </Tier>
          ))
        )}
      </Page>
    </section>
  )
}

export { Yonkoma }
