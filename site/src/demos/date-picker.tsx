import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@registry/manga/ui/calendar"
import { DatePicker, DateRangePicker, datePickerTriggerClassName } from "@registry/manga/ui/date-picker"
import { PopoverBubble } from "@registry/manga/ui/popover"
import { force, Tile, Tiles } from "../state-grid"

const JUNE = new Date(2026, 5, 1)
const TODAY = new Date(2026, 5, 3)
const d = (day: number, month = 5) => new Date(2026, month, day)

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex max-w-full min-w-0 flex-col gap-1.5">
      <span id={id} className="font-letter text-lg tracking-wide uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="text-sm">{hint}</span>}
    </div>
  )
}

export function Preview() {
  const [birthday, setBirthday] = React.useState<Date | undefined>()
  const [trip, setTrip] = React.useState<DateRange | undefined>({ from: d(12), to: d(15) })
  return (
    <div className="flex flex-wrap items-start gap-6 pb-96">
      <Field id="dp-birthday" label="Birthday" hint={birthday ? `A cake panel on ${birthday.toDateString()}.` : "For a cake panel on your day."}>
        <DatePicker
          aria-labelledby="dp-birthday"
          value={birthday}
          onValueChange={setBirthday}
          placeholder="Pick your birthday"
          calendarProps={{ captionLayout: "dropdown", startMonth: new Date(1940, 0), endMonth: new Date(2026, 11), defaultMonth: new Date(2000, 0) }}
        />
      </Field>
      <Field id="dp-trip" label="Convention trip" hint="Two months from 640px, one on phones.">
        <DateRangePicker aria-labelledby="dp-trip" value={trip} onValueChange={setTrip} calendarProps={{ today: TODAY, disabled: { before: TODAY } }} />
      </Field>
      <Field id="dp-closed" label="Signing session" hint="Booking opens next month.">
        <DatePicker aria-labelledby="dp-closed" disabled placeholder="Not open yet" />
      </Field>
    </div>
  )
}

/** A static open picker: the trigger look and a bubble around the calendar (no portal). */
function OpenTwin({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-4">
      <button type="button" aria-expanded="true" tabIndex={-1} className={datePickerTriggerClassName(wide ? "w-80" : undefined)}>
        <span aria-hidden className="mark-calendar shrink-0 text-xl" />
        <span className="min-w-0 truncate">{label}</span>
      </button>
      <PopoverBubble className="w-auto! max-w-full px-3! py-3! max-sm:px-1.5!">{children}</PopoverBubble>
    </div>
  )
}

/** Lets the trigger shrink to the tile (max-w-full) instead of pushing it wider. */
function Fit({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full min-w-0 justify-center">{children}</div>
}

export function States() {
  return (
    <Tiles>
      <Tile label="rest · placeholder" size="lg">
        <Fit><DatePicker aria-label="Rest" placeholder="Pick a date" /></Fit>
      </Tile>
      <Tile label="hover" size="lg">
        <Fit><DatePicker aria-label="Hover" placeholder="Pick a date" {...force("hover")} /></Fit>
      </Tile>
      <Tile label="focus" size="lg">
        <Fit><DatePicker aria-label="Focus" placeholder="Pick a date" {...force("focus")} /></Fit>
      </Tile>
      <Tile label="filled" size="lg">
        <Fit><DatePicker aria-label="Filled" defaultValue={d(12)} /></Fit>
      </Tile>
      <Tile label="range · filled" size="lg">
        <Fit><DateRangePicker aria-label="Range" defaultValue={{ from: d(12), to: d(15) }} /></Fit>
      </Tile>
      <Tile label="disabled" size="lg">
        <Fit><DatePicker aria-label="Disabled" disabled placeholder="Not open yet" /></Fit>
      </Tile>
      <Tile label="error" size="lg">
        <Fit><DatePicker aria-label="Error" aria-invalid placeholder="Required" /></Fit>
      </Tile>
      <Tile label="open · single" size="full">
        <OpenTwin label="Jun 12, 2026">
          <Calendar className="p-0!" mode="single" selected={d(12)} defaultMonth={JUNE} today={TODAY} />
        </OpenTwin>
      </Tile>
      <Tile label="open · birthday, dropdown caption" size="lg">
        <OpenTwin label="Pick your birthday">
          <Calendar className="p-0!" mode="single" captionLayout="dropdown" startMonth={new Date(1940, 0)} endMonth={new Date(2026, 11)} defaultMonth={new Date(2000, 0)} today={TODAY} />
        </OpenTwin>
      </Tile>
      <Tile label="open · range, one month on phones" size="lg">
        <OpenTwin label="Jun 12, 2026 – Jun 15, 2026" wide>
          <Calendar className="p-0!" mode="range" selected={{ from: d(12), to: d(15) }} defaultMonth={JUNE} today={TODAY} />
        </OpenTwin>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div inert className="flex flex-col items-start gap-2">
      <DatePicker aria-label="Release day" defaultValue={d(12)} className="w-52" />
      <div className="relative ms-6 [zoom:0.24]">
        <Calendar mode="single" selected={d(12)} defaultMonth={JUNE} today={TODAY} />
      </div>
    </div>
  )
}
