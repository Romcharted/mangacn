"use client"

import * as React from "react"
import { cn } from "cn"
import { format } from "date-fns"
import type { DateRange, PropsBase } from "react-day-picker"

import { Calendar } from "@/components/ui/manga/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/manga/popover"

/*
 * Date Picker: shadcn documents it as a recipe (Popover + Calendar); mangacn ships it as an item.
 * Grammar: the trigger is a field like the Select trigger (2px line, hover-thicken, focus ink / paper /
 * ink, 3px line while open, dashed + tone frame when disabled, accent + "!" when invalid) with a drawn
 * calendar mark; the placeholder stays in the same ink (italic, never grey). The calendar opens in the
 * kit Popover bubble (G6) that pops in (G5); choosing a day closes it (single). The range picker shows
 * two months from 640px and one month on phones, so the bubble fits a 360px screen.
 * The trigger only gets a className (no asChild / render), so Radix and Base UI both work.
 */

const trigger = [
  "relative inline-flex h-10 max-w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-(--radius) border-[length:var(--mg-bw)] border-input bg-background px-3 text-start text-base text-foreground transition-none max-sm:h-11",
  "data-[empty]:italic",
  // G3, a field: the line thickens by 1px, inside
  "hover-thicken",
  "focus-visible:outline-none focus-visible:border-ring focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
  "aria-expanded:border-[3px] aria-expanded:px-[11px]",
  "disabled:cursor-not-allowed disabled:border-dashed disabled:tone-frame disabled:hover:shadow-none",
  "aria-invalid:border-destructive aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] aria-invalid:mark-error",
].join(" ")

/** The manga look of the date picker trigger, for a static twin or a trigger of your own (className replaces the default width). */
function datePickerTriggerClassName(className?: string) {
  return cn(trigger, className || "w-72")
}

/** The kit's calendar mark (G8, `mark-calendar` from base), decorative. */
function CalendarMark() {
  return <span aria-hidden className="mark-calendar shrink-0 text-xl" />
}

const NARROW = "(max-width: 639.98px)"
function useNarrow() {
  return React.useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(NARROW)
      m.addEventListener("change", onChange)
      return () => m.removeEventListener("change", onChange)
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  )
}

function useValue<T>(props: { value?: T; defaultValue?: T; onValueChange?: (value: T | undefined) => void }) {
  const controlled = "value" in props
  const [inner, setInner] = React.useState<T | undefined>(props.defaultValue)
  const value = controlled ? props.value : inner
  const set = (next: T | undefined) => {
    if (!controlled) setInner(next)
    props.onValueChange?.(next)
  }
  return [value, set] as const
}

type TriggerProps = Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "children" | "type" | "ref">

type PickerProps<T> = TriggerProps & {
  value?: T
  defaultValue?: T
  onValueChange?: (value: T | undefined) => void
  /** Shown in the same ink (italic) while nothing is chosen. */
  placeholder?: string
  disabled?: boolean
  /** date-fns format of each date in the trigger. Default "LLL d, y". */
  formatString?: string
  /** Extra Calendar props (captionLayout, startMonth, endMonth, disabled days, locale…). */
  calendarProps?: Partial<PropsBase>
}

function PickerShell({
  open,
  onOpenChange,
  label,
  empty,
  disabled,
  className,
  children,
  ...props
}: TriggerProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: string
  empty: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Popover open={open} onOpenChange={(next: boolean) => onOpenChange(next)}>
      <PopoverTrigger
        data-manga="date-picker"
        data-empty={empty || undefined}
        disabled={disabled}
        className={cn(trigger, className || "w-72")}
        {...props}
      >
        <CalendarMark />
        <span className="min-w-0 truncate">{label}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto! max-w-[calc(100vw-1rem)] px-3! py-3! max-sm:px-1.5!">{children}</PopoverContent>
    </Popover>
  )
}

/** One date, in a field that opens a calendar. Choosing a day closes it. */
function DatePicker(props: PickerProps<Date>) {
  const { value: _v, defaultValue: _d, onValueChange: _c, placeholder = "Pick a date", formatString = "LLL d, y", calendarProps, ...rest } = props
  const [value, setValue] = useValue<Date>(props)
  const [open, setOpen] = React.useState(false)
  return (
    <PickerShell open={open} onOpenChange={setOpen} empty={!value} label={value ? format(value, formatString) : placeholder} {...rest}>
      <Calendar
        defaultMonth={value}
        {...calendarProps}
        className="p-0!"
        mode="single"
        selected={value}
        onSelect={(date: Date | undefined) => {
          setValue(date)
          setOpen(false)
        }}
      />
    </PickerShell>
  )
}

/** A range of dates (from, to): two months from 640px, one on phones. */
function DateRangePicker(props: PickerProps<DateRange>) {
  const { value: _v, defaultValue: _d, onValueChange: _c, placeholder = "Pick dates", formatString = "LLL d, y", calendarProps, className, ...rest } = props
  const [value, setValue] = useValue<DateRange>(props)
  const [open, setOpen] = React.useState(false)
  const narrow = useNarrow()
  const label = value?.from
    ? value.to
      ? `${format(value.from, formatString)} – ${format(value.to, formatString)}`
      : `${format(value.from, formatString)} – …`
    : placeholder
  return (
    <PickerShell open={open} onOpenChange={setOpen} empty={!value?.from} label={label} className={className || "w-80"} {...rest}>
      <Calendar
        defaultMonth={value?.from}
        numberOfMonths={narrow ? 1 : 2}
        showOutsideDays={narrow}
        {...calendarProps}
        className="p-0!"
        mode="range"
        selected={value}
        onSelect={(range: DateRange | undefined) => setValue(range)}
      />
    </PickerShell>
  )
}

export { DatePicker, DateRangePicker, datePickerTriggerClassName }
