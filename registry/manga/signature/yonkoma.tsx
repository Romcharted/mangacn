"use client"

import * as React from "react"
import { cn } from "cn"

import { Panel, PanelCaption, PanelGrid } from "@/components/manga/panel"

/*
 * Yonkoma: a strip of four panels read top to bottom, to explain something in four beats (set-up,
 * development, turn, payoff). The API is only four children: each one becomes a panel. The panels are
 * the current Panel / PanelGrid (G1 case, 3px frame); everything that touches them stays in `Frame` and
 * `Strip` below, so the strip can move to another page model without changing its API.
 * Horizontal: four panels side by side, in the manga reading order (right to left with data-reading="rtl").
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
   * auto: vertical, then four in a row once the strip's container is 40rem wide.
   */
  orientation?: "vertical" | "horizontal" | "auto"
  /** Each panel's shape: any CSS aspect ratio (default 4 / 3). */
  aspect?: string
}

/* ---- The page model: the only part that knows about Panel / PanelGrid ---- */

function Strip({ orientation, children }: { orientation: NonNullable<YonkomaProps["orientation"]>; children: React.ReactNode }) {
  return (
    <PanelGrid
      cols={orientation === "horizontal" ? 4 : 1}
      gap="0.5rem"
      role="list"
      className={cn("p-0!", orientation === "auto" && "@2xl/yonkoma:grid-cols-[repeat(4,minmax(0,1fr))]!")}
    >
      {children}
    </PanelGrid>
  )
}

function Frame({ label, number, numbered, aspect, children }: { label: string; number: number; numbered: boolean; aspect: string; children: React.ReactNode }) {
  return (
    <Panel role="listitem" aria-label={label} className="min-h-0!" style={{ aspectRatio: aspect }}>
      <div data-slot="yonkoma-content" className="absolute inset-0 overflow-hidden">
        {children}
      </div>
      {numbered && (
        <PanelCaption aria-hidden position="top-start" className="px-1.5 py-0.5 font-mono text-xs">
          {number}
        </PanelCaption>
      )}
    </Panel>
  )
}

/* ---- The strip ---- */

function Yonkoma({ children, title, numbered = true, labels, orientation = "vertical", aspect = "4 / 3", className, ...props }: YonkomaProps) {
  const beats = React.Children.toArray(children).slice(0, 4)
  const headingId = React.useId()
  return (
    <section
      data-manga="yonkoma"
      data-orientation={orientation}
      aria-labelledby={title != null ? headingId : undefined}
      className={cn("@container/yonkoma grid w-full min-w-0 gap-2", orientation === "vertical" && "max-w-sm", className)}
      {...props}
    >
      {title != null && (
        <h3 id={headingId} className="justify-self-start border-ink-panel bg-background px-3 py-1 font-letter text-xl leading-tight tracking-wide uppercase">
          {title}
        </h3>
      )}
      <Strip orientation={orientation}>
        {beats.map((beat, i) => (
          <Frame key={i} number={i + 1} numbered={numbered} aspect={aspect} label={labels?.[i] ?? `Panel ${i + 1} of 4`}>
            {beat}
          </Frame>
        ))}
      </Strip>
    </section>
  )
}

export { Yonkoma }
