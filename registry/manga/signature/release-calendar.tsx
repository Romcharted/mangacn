"use client"

import * as React from "react"
import { cn } from "cn"

import { Stamp } from "@/components/manga/stamp"
import { ImpactLines, withImpact } from "@/lib/manga/gestures"

/*
 * Release calendar: releases by day of the week. Narrow: a day strip drawn like boxed tabs (one frame split
 * into seven cells, the selected cell an ink flat) above the releases of that day. Wide (a container of 56rem
 * and up, or layout="columns"): seven columns, one per day, every day at once.
 * Gestures: G1 case (cards), G2 flat (selected day, today's header), G3 hover (cells thicken, rows lift),
 * focus ring kept inside the cell, G4 impact on rows, G5 slide for a day change, G8 marks (NEW burst, Break stamp).
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type ReleaseStatus = "new" | "break"

export type Release = {
  id: string
  /** 0 = Monday … 6 = Sunday */
  day: Weekday
  title: React.ReactNode
  chapter?: React.ReactNode
  time?: string
  /** An image URL, or any node drawn as the cover (a 2:3 box is drawn for you). */
  cover?: string | React.ReactNode
  status?: ReleaseStatus
  /** Makes the row a link. */
  href?: string
}

export type DayLabels = [string, string, string, string, string, string, string]

export type ReleaseCalendarLayout = "auto" | "strip" | "columns"

export type ReleaseCalendarProps = Omit<React.ComponentProps<"div">, "onSelect" | "defaultValue"> & {
  releases: Release[]
  /** The day marked as today (0 = Monday). Default: computed from the current date. */
  today?: Weekday
  /** Controlled day shown on narrow screens. */
  day?: Weekday
  /** Initial day shown on narrow screens. Default: today. */
  defaultDay?: Weekday
  onDayChange?: (day: Weekday) => void
  /** Short labels, Monday first. */
  dayLabels?: DayLabels
  /** Called when a release row that has no href is pressed. */
  onSelect?: (release: Release) => void
  /** Shown on a day without releases. */
  empty?: React.ReactNode
  /** auto: by container width (56rem and up shows the columns) · strip · columns */
  layout?: ReleaseCalendarLayout
  className?: string
}

const DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6]
const DEFAULT_LABELS: DayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function mondayBasedToday(): Weekday {
  return ((new Date().getDay() + 6) % 7) as Weekday
}

const showStrip: Record<ReleaseCalendarLayout, string> = {
  auto: "@4xl/rc:hidden",
  strip: "",
  columns: "hidden",
}

const showColumns: Record<ReleaseCalendarLayout, string> = {
  auto: "hidden @4xl/rc:grid",
  strip: "hidden",
  columns: "grid",
}

// The day cell: a segment of one frame. Hover thickens its line (not on the selected cell), focus stays inside.
const cellClass = [
  "relative flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 border-0 border-s-[length:var(--mg-bw)] border-border bg-background px-1 py-1.5 text-foreground first:border-s-0",
  "aria-selected:ink-fill aria-selected:fill-in aria-selected:bg-primary! aria-selected:text-primary-foreground!",
  "hover-thicken aria-selected:hover:shadow-none",
  "focus-visible:shadow-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-[-5px] focus-visible:outline-ring aria-selected:focus-visible:outline-primary-foreground",
].join(" ")

function NewMark() {
  return (
    <span className="relative isolate inline-grid h-6 place-items-center px-3 font-sfx text-xs leading-none text-primary-foreground before:absolute before:-inset-x-2 before:-inset-y-2 before:-z-10 before:bg-destructive before:content-[''] before:shape-burst">
      New
    </span>
  )
}

function EmptyDay({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 border-ink-fine bg-background p-3 text-sm">
      <span aria-hidden className="font-sfx text-2xl leading-none">
        …
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </p>
  )
}

export type ReleaseRowProps = Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> & {
  release: Release
  /** Makes the row a button (ignored when the release has an href). */
  onSelect?: (release: Release) => void
}

/** One release: a case with the cover, the time, the title, the chapter and the status mark. */
function ReleaseRow({ release, onSelect, className, ...props }: ReleaseRowProps) {
  const { time, title, chapter, cover, status, href } = release
  const interactive = Boolean(href || onSelect)
  const hit = withImpact<React.MouseEvent<HTMLElement>>(() => onSelect?.(release))

  const art =
    typeof cover === "string" ? (
      <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
    ) : (
      <span className="absolute inset-0 block">{cover}</span>
    )

  const body = (
    <>
      {cover && (
        <span className="relative block aspect-[2/3] w-10 shrink-0 overflow-hidden border-ink bg-background">{art}</span>
      )}
      <span className="grid min-w-0 flex-1 content-start gap-1">
        {(time || status) && (
          <span className="flex flex-wrap items-center gap-2">
            {time && <span className="font-mono text-xs">{time}</span>}
            {status === "new" && <NewMark />}
            {status === "break" && (
              <span className="inline-block [&_[data-manga=stamp]]:px-2 [&_[data-manga=stamp]]:py-1 [&_[data-manga=stamp]]:text-xs">
                <Stamp tone="ink" rotate={-4} animated={false}>
                  Break
                </Stamp>
              </span>
            )}
          </span>
        )}
        <span className="block min-w-0 font-letter text-base leading-tight uppercase break-words">{title}</span>
        {chapter && <span className="block min-w-0 text-sm break-words">{chapter}</span>}
      </span>
    </>
  )

  const shell = cn(
    "relative flex min-w-0 gap-2 p-2 text-start text-foreground ink-case-inner",
    interactive && "cursor-pointer hover-lift focus-ink press data-[impact]:animate-hit",
    className,
  )
  const attrs = { "data-manga": "release-row", "data-status": status, "data-interactive": interactive || undefined, ...props }

  if (href)
    return (
      <a {...attrs} href={href} className={shell} onClick={hit}>
        <ImpactLines />
        {body}
      </a>
    )
  if (onSelect)
    return (
      <button {...attrs} type="button" onClick={hit} className={cn(shell, "w-full")}>
        <ImpactLines />
        {body}
      </button>
    )
  return (
    <div {...attrs} className={shell}>
      {body}
    </div>
  )
}

function ReleaseCalendar({
  releases,
  today,
  day,
  defaultDay,
  onDayChange,
  dayLabels = DEFAULT_LABELS,
  onSelect,
  empty = "Nothing this day.",
  layout = "auto",
  className,
  ...props
}: ReleaseCalendarProps) {
  const id = React.useId()
  const todayDay = today ?? mondayBasedToday()
  const [inner, setInner] = React.useState<Weekday>(defaultDay ?? todayDay)
  const current = day ?? inner
  const cells = React.useRef<(HTMLButtonElement | null)[]>([])

  const pick = (next: Weekday) => {
    if (day === undefined) setInner(next)
    onDayChange?.(next)
  }

  const byDay = DAYS.map((d) => releases.filter((r) => r.day === d))
  const tabId = (d: Weekday) => `${id}-tab-${d}`
  const panelId = `${id}-panel`

  // Arrow keys move and select (like a click); Home and End go to the ends. In dir="rtl" the arrows flip.
  const onStripKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    let next: Weekday | undefined
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const step = (event.key === "ArrowRight") !== rtl ? 1 : -1
      next = (((current + step) % 7) + 7) % 7 as Weekday
    } else if (event.key === "Home") next = 0
    else if (event.key === "End") next = 6
    if (next === undefined) return
    event.preventDefault()
    pick(next)
    cells.current[next]?.focus()
  }

  return (
    <div data-manga="release-calendar" data-layout={layout} className={cn("@container/rc grid min-w-0 gap-3", className)} {...props}>
      <div className={cn("grid min-w-0 gap-3", showStrip[layout])}>
        <div
          role="tablist"
          aria-label="Days"
          onKeyDown={onStripKey}
          className="grid grid-cols-7 border-[length:var(--mg-bw)] border-border bg-background"
        >
          {DAYS.map((d) => {
            const selected = d === current
            const isToday = d === todayDay
            return (
              <button
                key={d}
                ref={(el) => {
                  cells.current[d] = el
                }}
                id={tabId(d)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => pick(d)}
                className={cellClass}
              >
                {isToday && (
                  <span
                    aria-hidden
                    className="absolute end-0 top-0 size-3 bg-current [clip-path:polygon(0_0,100%_0,100%_100%)] rtl:[clip-path:polygon(0_0,100%_0,0_100%)]"
                  />
                )}
                <span className="font-letter text-sm leading-none uppercase">{dayLabels[d]}</span>
                <span className="font-mono text-xs leading-none">{byDay[d].length}</span>
                {isToday && <span className="sr-only"> (today)</span>}
              </button>
            )
          })}
        </div>
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(current)}
          tabIndex={0}
          className="text-base focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <div key={current} className="animate-slide-in rtl:[--slide-dir:-1]">
            {byDay[current].length ? (
              <ul className="grid gap-2">
                {byDay[current].map((r) => (
                  <li key={r.id}>
                    <ReleaseRow release={r} onSelect={onSelect} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyDay>{empty}</EmptyDay>
            )}
          </div>
        </div>
      </div>
      <div className={cn("grid-cols-7 gap-2 min-w-[56rem]", showColumns[layout])}>
        {DAYS.map((d) => {
          const isToday = d === todayDay
          return (
            <section key={d} aria-label={dayLabels[d]} className="grid min-w-0 content-start gap-2">
              <h3
                className={cn(
                  "border-ink px-1 py-1.5 text-center font-letter text-sm uppercase",
                  isToday ? "ink-fill" : "bg-background",
                )}
              >
                {dayLabels[d]}
                {isToday && <span className="sr-only"> (today)</span>}
              </h3>
              {byDay[d].length ? (
                <ul className="grid gap-2">
                  {byDay[d].map((r) => (
                    <li key={r.id}>
                      <ReleaseRow release={r} onSelect={onSelect} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyDay>{empty}</EmptyDay>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

export { ReleaseCalendar, ReleaseRow }
