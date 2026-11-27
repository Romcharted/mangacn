import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar, CalendarDayButton } from "@registry/manga/ui/calendar"
import type { Example } from "../registry"
import { force, Tile, Tiles, type Force } from "../state-grid"

// Fixed dates so the tiles never move: June 2026, "today" is the 3rd.
const JUNE = new Date(2026, 5, 1)
const TODAY = new Date(2026, 5, 3)
const d = (day: number, month = 5) => new Date(2026, month, day)

/** A day button with a frozen state, keyed by ISO date (showcase only). */
function frozen(states: Record<string, Force>) {
  return function FrozenDay(props: React.ComponentProps<typeof CalendarDayButton>) {
    return <CalendarDayButton {...props} {...force(states[props.day.isoDate] ?? "")} />
  }
}

const cellStates = frozen({ "2026-06-08": "hover", "2026-06-09": "focus", "2026-06-10": "active", "2026-06-03": "hover", "2026-06-16": "hover", "2026-06-17": "focus" })
const rangeHover = frozen({ "2026-06-11": "hover" })

function navForced({ prev, next }: { prev?: Force; next?: Force }) {
  return {
    PreviousMonthButton: (p: React.ComponentProps<"button">) => <button {...p} {...force(prev ?? "")} />,
    NextMonthButton: (p: React.ComponentProps<"button">) => <button {...p} {...force(next ?? "")} />,
  }
}
const navHover = navForced({ next: "hover" })
const navFocus = navForced({ prev: "focus", next: "active" })

export function Preview() {
  const [day, setDay] = React.useState<Date | undefined>(d(12))
  return (
    <figure className="flex max-w-full min-w-0 flex-col gap-2">
      <figcaption className="font-letter text-lg tracking-wide uppercase">Next chapter drop</figcaption>
      <div className="relative w-fit max-w-full ink-case">
        <Calendar mode="single" selected={day} onSelect={setDay} defaultMonth={JUNE} today={TODAY} />
      </div>
      <p className="text-sm" aria-live="polite">
        {day ? `Chapter 42 lands on ${day.toDateString()}.` : "No date picked yet."}
      </p>
    </figure>
  )
}

function RangeTrip() {
  const [trip, setTrip] = React.useState<DateRange | undefined>({ from: d(8), to: d(14) })
  return (
    <figure className="flex max-w-full min-w-0 flex-col gap-2">
      <figcaption className="font-letter text-lg tracking-wide uppercase">Convention trip</figcaption>
      <div className="relative w-fit max-w-full ink-case">
        <Calendar mode="range" selected={trip} onSelect={setTrip} defaultMonth={JUNE} today={TODAY} disabled={{ before: TODAY }} />
      </div>
      <p className="text-sm" aria-live="polite">
        {trip?.from ? `${trip.from.toDateString()} → ${trip.to ? trip.to.toDateString() : "…"}` : "Pick the first day."}
      </p>
    </figure>
  )
}

function DisabledDays() {
  return (
    <div className="relative w-fit max-w-full ink-case">
      <Calendar mode="single" defaultMonth={JUNE} today={TODAY} disabled={[{ dayOfWeek: [0, 6] }, { before: TODAY }]} />
    </div>
  )
}

function DropdownCaption() {
  return (
    <div className="relative w-fit max-w-full ink-case">
      <Calendar mode="single" captionLayout="dropdown" defaultMonth={JUNE} startMonth={new Date(2026, 0)} endMonth={new Date(2026, 11)} today={TODAY} />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "RangeTrip", title: "Date range", description: "mode range: the first click starts the band, the second ends it; days before today are disabled.", Component: RangeTrip },
  { fn: "DisabledDays", title: "Disabled days", description: "disabled takes a matcher: weekends and past days get a dashed line-through and cannot be picked.", Component: DisabledDays },
  { fn: "DropdownCaption", title: "Month dropdown", description: "captionLayout=\"dropdown\" turns the month caption into a select, limited by startMonth and endMonth.", Component: DropdownCaption },
]

const tight = "p-0!"

/** Lets the calendar shrink to the tile instead of pushing it wider. */
function Fit({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full min-w-0 justify-center">{children}</div>
}

export function States() {
  return (
    <Tiles>
      <Tile label="single · selected 12, today 3, outside days lighter" size="lg">
        <Fit><Calendar className={tight} mode="single" selected={d(12)} defaultMonth={JUNE} today={TODAY} /></Fit>
      </Tile>
      <Tile label="cells · hover 8 · focus 9 · pressed 10 · today hover 3 · selected hover 16, focus 17" size="lg">
        <Fit><Calendar className={tight} mode="multiple" selected={[d(16), d(17)]} defaultMonth={JUNE} today={TODAY} components={{ DayButton: cellStates }} /></Fit>
      </Tile>
      <Tile label="range · 8 → 14, middle hover 11" size="lg">
        <Fit><Calendar className={tight} mode="range" selected={{ from: d(8), to: d(14) }} defaultMonth={JUNE} today={TODAY} components={{ DayButton: rangeHover }} /></Fit>
      </Tile>
      <Tile label="multiple · every Tuesday" size="lg">
        <Fit><Calendar className={tight} mode="multiple" selected={[d(2), d(9), d(16), d(23), d(30)]} defaultMonth={JUNE} today={TODAY} /></Fit>
      </Tile>
      <Tile label="disabled days · weekends and before today" size="lg">
        <Fit><Calendar className={tight} mode="single" defaultMonth={JUNE} today={TODAY} disabled={[{ dayOfWeek: [0, 6] }, { before: TODAY }]} /></Fit>
      </Tile>
      <Tile label="dropdown caption" size="lg">
        <Fit><Calendar className={tight} mode="single" captionLayout="dropdown" defaultMonth={JUNE} startMonth={new Date(2000, 0)} endMonth={new Date(2030, 11)} today={TODAY} /></Fit>
      </Tile>
      <Tile label="nav · previous disabled (first month) · next hover" size="lg">
        <Fit><Calendar className={tight} mode="single" defaultMonth={JUNE} startMonth={JUNE} today={TODAY} components={navHover} /></Fit>
      </Tile>
      <Tile label="nav · previous focus · next pressed" size="lg">
        <Fit><Calendar className={tight} mode="single" defaultMonth={JUNE} today={TODAY} components={navFocus} /></Fit>
      </Tile>
      <Tile label="two months · range across the fold (stacks on phones)" size="full">
        <Fit><Calendar className={tight} mode="range" numberOfMonths={2} showOutsideDays={false} selected={{ from: d(26), to: d(4, 6) }} defaultMonth={JUNE} today={TODAY} /></Fit>
      </Tile>
    </Tiles>
  )
}

/** Live: pick a range. */
/** Thumbnail: a readable detail at real size, cropped. */
export function Thumb() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: d(8), to: d(12) })
  // the top of the month at real size: its title, the weekdays and the first weeks
  return (
    <div className="w-64 h-28 overflow-hidden">
      <Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={JUNE} today={TODAY} />
    </div>
  )
}
