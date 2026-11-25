"use client"

import * as React from "react"
import { cn } from "cn"
import { useDayPicker, type ClassNames } from "react-day-picker"

import { Calendar as ShadcnCalendar, CalendarDayButton as ShadcnCalendarDayButton } from "@/components/ui/calendar"

/*
 * Grammar: the calendar has no frame of its own (put it in a Card, a Popover or an ink-case).
 * Month caption and weekday heads in the lettering face. Nav buttons: square 2px frames with a brush
 * chevron (G8), hover-thicken (G3), focus-ink. Day cells are cells of a group: the hover line appears
 * inside (G3 hover-thicken), focus stays inside the cell. Selected day, range start and range end:
 * ink flat sweeping in (G2 ink-fill + fill-in). Today: a 2px ink frame (selected wins). Range middle:
 * paper with a fine ink line above and below (a band, never a tone behind the number). Outside days:
 * same ink, lighter weight. Disabled days: dashed line-through, not-allowed cursor.
 * Cells are 40px; under 640px they share the available width, up to 44px, so a month fits a 360px screen.
 * Day states come from react-day-picker (same in Radix and Base UI): data-selected-single,
 * data-range-start / -end / -middle on the button; data-today, data-outside, data-disabled on the cell.
 */

// One box-shadow carries the hover line, the today frame and the range band, so they combine:
// --day-w: inside line (hover 1px, today 2px, today + hover 3px) · --day-c: its colour · --band: lines above and below.
const dayButton = [
  "rounded-(--radius)! border-0 bg-transparent font-sans text-base font-medium tabular-nums text-foreground transition-none",
  "shadow-[inset_0_0_0_var(--day-w,0px)_var(--day-c,var(--border)),inset_0_var(--band,0px)_0_0_var(--border),inset_0_calc(var(--band,0px)*-1)_0_0_var(--border)]",
  "[&>span]:opacity-100!",
  // G3, cells of a group: the line appears inside (no background)
  "hover:bg-transparent! hover:text-foreground hover:[--day-w:1px]",
  "group-data-[today=true]/day:[--day-w:2px] group-data-[today=true]/day:hover:[--day-w:3px]",
  // outside days: same ink, lighter weight
  "group-data-[outside=true]/day:font-extralight",
  // focus stays inside the cell: ink line, paper gap, the cell edge
  "focus-visible:ring-0! group-data-[focused=true]/day:ring-0! group-data-[focused=true]/day:border-0",
  "focus-visible:outline-solid! focus-visible:outline-2! focus-visible:outline-offset-[-6px]! focus-visible:outline-ring!",
  // pressed: explicit negative
  "active:bg-primary! active:text-primary-foreground!",
  // G2: selected day, range start and end are ink flats (selected wins over today)
  "data-[selected-single=true]:ink-fill data-[selected-single=true]:fill-in data-[selected-single=true]:bg-primary! data-[selected-single=true]:text-primary-foreground!",
  "data-[range-start=true]:ink-fill data-[range-start=true]:fill-in data-[range-start=true]:bg-primary! data-[range-start=true]:text-primary-foreground!",
  "data-[range-end=true]:ink-fill data-[range-end=true]:fill-in data-[range-end=true]:bg-primary! data-[range-end=true]:text-primary-foreground!",
  "data-[selected-single=true]:[--day-w:0px]! data-[range-start=true]:[--day-w:0px]! data-[range-end=true]:[--day-w:0px]!",
  "data-[selected-single=true]:hover:[--day-w:1px]! data-[range-start=true]:hover:[--day-w:1px]! data-[range-end=true]:hover:[--day-w:1px]!",
  "data-[selected-single=true]:[--day-c:var(--primary-foreground)] data-[range-start=true]:[--day-c:var(--primary-foreground)] data-[range-end=true]:[--day-c:var(--primary-foreground)]",
  "data-[selected-single=true]:focus-visible:outline-primary-foreground! data-[range-start=true]:focus-visible:outline-primary-foreground! data-[range-end=true]:focus-visible:outline-primary-foreground!",
  "data-[selected-single=true]:active:bg-background! data-[selected-single=true]:active:text-foreground! data-[range-start=true]:active:bg-background! data-[range-start=true]:active:text-foreground! data-[range-end=true]:active:bg-background! data-[range-end=true]:active:text-foreground!",
  // range middle: paper, a fine ink line above and below
  "data-[range-middle=true]:bg-background! data-[range-middle=true]:text-foreground! data-[range-middle=true]:[--band:1px] data-[range-middle=true]:hover:[--day-w:2px]",
  // disabled: dashed line-through on paper, not-allowed cursor, no hover line
  "disabled:pointer-events-auto! disabled:cursor-not-allowed disabled:opacity-100! disabled:line-through disabled:decoration-dashed disabled:decoration-2",
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-100! aria-disabled:line-through aria-disabled:decoration-dashed aria-disabled:decoration-2",
  "disabled:hover:[--day-w:0px] group-data-[today=true]/day:disabled:hover:[--day-w:2px]",
].join(" ")

const navButton = [
  "relative z-10 inline-grid size-(--cell-size) place-items-center rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background p-0 text-foreground select-none",
  "hover-thicken focus-ink active:bg-primary active:text-primary-foreground",
  "aria-disabled:cursor-not-allowed aria-disabled:border-dashed aria-disabled:tone-frame aria-disabled:hover:shadow-none aria-disabled:active:bg-background aria-disabled:active:text-foreground",
].join(" ")

function parts(dropdown: boolean): Partial<ClassNames> {
  return {
    root: "w-fit",
    months: "relative flex flex-col gap-6 sm:flex-row",
    month: "flex w-full flex-col gap-3",
    nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
    button_previous: navButton,
    button_next: navButton,
    month_caption: "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
    dropdowns: "flex h-(--cell-size) w-full items-center justify-center gap-2",
    dropdown_root: [
      "relative flex h-9 items-center rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background text-foreground hover-thicken",
      "has-[select:focus-visible]:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
    ].join(" "),
    // the native select stays the click target over the drawn label (stock behaviour)
    dropdown: "absolute inset-0 cursor-pointer bg-popover text-foreground opacity-0",
    caption_label: dropdown
      ? "pointer-events-none flex h-full items-center gap-1.5 ps-2.5 pe-2 font-letter text-base leading-none tracking-wide uppercase select-none"
      : "font-letter text-xl leading-none tracking-wide uppercase select-none",
    month_grid: "w-full border-collapse",
    weekdays: "flex",
    weekday: "flex-1 pb-1 font-letter text-sm font-normal tracking-wide text-foreground uppercase select-none",
    week: "mt-1 flex w-full",
    week_number_header: "w-(--cell-size) select-none",
    week_number: "font-letter text-sm text-foreground select-none",
    day: "group/day relative aspect-square h-full w-full p-0 text-center select-none",
    range_start: "",
    range_middle: "",
    range_end: "",
    today: "",
    outside: "",
    disabled: "",
    hidden: "invisible",
  }
}

type ChevronProps = {
  className?: string
  size?: number
  disabled?: boolean
  orientation?: "up" | "down" | "left" | "right"
}

/** G8: the brush chevron (points down; turned for the nav buttons, mirrored in right-to-left writing). */
function CalendarChevron({ className, orientation = "left" }: ChevronProps) {
  return (
    <span
      aria-hidden
      data-orientation={orientation}
      className={cn(
        "mark-chevron shrink-0",
        orientation === "left" && "rotate-90 text-sm rtl:-rotate-90",
        orientation === "right" && "-rotate-90 text-sm rtl:rotate-90",
        orientation === "up" && "rotate-180 text-xs",
        orientation === "down" && "text-xs",
        className,
      )}
    />
  )
}

function CalendarDayButton({ className, ...props }: React.ComponentProps<typeof ShadcnCalendarDayButton>) {
  const { dayPickerProps } = useDayPicker()
  return (
    <ShadcnCalendarDayButton
      data-manga="calendar-day"
      locale={dayPickerProps.locale}
      className={cn(dayButton, className)}
      {...props}
    />
  )
}

function Calendar({
  className,
  classNames,
  components,
  captionLayout = "label",
  ...props
}: React.ComponentProps<typeof ShadcnCalendar>) {
  const own = parts(captionLayout !== "label")
  const merged: Partial<ClassNames> = { ...classNames }
  for (const key of Object.keys(own) as (keyof ClassNames)[]) merged[key] = cn(own[key], classNames?.[key])
  return (
    <ShadcnCalendar
      data-manga="calendar"
      captionLayout={captionLayout}
      className={cn(
        "[--cell-radius:var(--radius)]! [--cell-size:--spacing(10)]! p-2",
        // under 640px: as wide as a 44px-cell month, shrinking with its container; cells share the width (44px max)
        "max-sm:w-[calc(7*--spacing(11)+--spacing(4))] max-sm:max-w-full max-sm:[container-type:inline-size] max-sm:[--cell-size:min(--spacing(11),calc(100cqw/7))]!",
        className,
      )}
      classNames={merged}
      components={{ Chevron: CalendarChevron, DayButton: CalendarDayButton, ...components }}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
