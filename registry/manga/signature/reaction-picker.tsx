"use client"

import * as React from "react"
import { cn } from "cn"

import { Manpu, type ManpuKind } from "@/components/manga/manpu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/manga/popover"
import { ImpactLines, punch, withImpact } from "@/lib/manga/gestures"

/*
 * Reactions drawn as manpu marks, each a toggle chip with its count.
 * Gestures: G2 (a chip you reacted with is an ink flat that sweeps in), G3 (hover-thicken: small cells),
 * G4 (click impact with speed lines; the count takes the hit when it changes), G5 (a new chip pops in),
 * G6 (the "+" chip opens the kit Popover bubble with the eight marks).
 * Disabled: dashed line, tone frame, label on paper.
 */

export type Reaction = { kind: ManpuKind; count: number; active?: boolean }

const ALL_KINDS: ManpuKind[] = ["anger", "sweat", "surprise", "question", "sparkle", "gloom", "love", "sigh"]

const NAMES: Record<ManpuKind, string> = {
  anger: "Anger",
  sweat: "Sweat",
  surprise: "Surprise",
  question: "Question",
  sparkle: "Sparkle",
  gloom: "Gloom",
  love: "Love",
  sigh: "Sigh",
}

const formatCount = (n: number) => (n < 1000 ? String(n) : `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, "")}k`)

/** Shared by the chips and the "+" trigger. */
const chipBase = [
  "group/chip relative isolate inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center gap-1 px-2",
  "rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background text-foreground transition-none select-none",
  "max-sm:min-h-11 max-sm:min-w-11 animate-pop data-[impact]:animate-hit",
  "hover-thicken",
  "active:translate-x-0.5 active:translate-y-0.5 rtl:active:-translate-x-0.5 active:bg-foreground active:text-background",
  "focus-ink focus-visible:outline-solid!",
  "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-background disabled:px-3 disabled:text-foreground disabled:tone-frame disabled:shadow-none! disabled:translate-none",
].join(" ")

/** On: an ink flat (G2). Its hover line is paper, so it still shows on the ink. */
const chipOn =
  "aria-pressed:ink-fill aria-pressed:fill-in aria-pressed:border-primary aria-pressed:[--thicken-ink:var(--primary-foreground)] aria-pressed:active:bg-background aria-pressed:active:text-foreground"

/** Hollow marks (sweat, love) are filled with --background: on ink they stay hollow. */
const markOnInk = "group-aria-pressed/chip:[--background:var(--primary)] group-active/chip:[--background:var(--foreground)]"

export type ReactionChipProps = Omit<React.ComponentProps<"button">, "children"> & {
  kind: ManpuKind
  count: number
  active?: boolean
}

/** One reaction: the mark and its count, a toggle button (aria-pressed). */
function ReactionChip({ kind, count, active = false, className, onClick, ...props }: ReactionChipProps) {
  const countRef = React.useRef<HTMLSpanElement>(null)
  const previous = React.useRef(count)
  React.useEffect(() => {
    if (previous.current === count) return
    previous.current = count
    punch(countRef.current)
  }, [count])

  return (
    <button
      type="button"
      data-manga="reaction-chip"
      data-kind={kind}
      aria-pressed={active}
      aria-label={`${NAMES[kind]}: ${count}`}
      // disabled does not change: a reacted chip stays on paper (aria-pressed still tells)
      className={cn(chipBase, !props.disabled && chipOn, className)}
      onClick={withImpact(onClick)}
      {...props}
    >
      <ImpactLines />
      <Manpu kind={kind} size="1.25rem" animated={false} className={props.disabled ? undefined : markOnInk} style={{ color: "inherit" }} />
      <span ref={countRef} aria-hidden className="relative inline-block font-sfx text-sm leading-none tabular-nums data-[impact]:animate-hit">
        {formatCount(count)}
      </span>
    </button>
  )
}

const cell = [
  "relative grid size-10 cursor-pointer place-items-center rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background text-foreground transition-none",
  "max-sm:size-11 data-[impact]:animate-hit hover-thicken",
  "active:translate-x-0.5 active:translate-y-0.5 rtl:active:-translate-x-0.5 active:bg-foreground active:text-background",
  // a cell of a group keeps its focus ring inside
  "focus-visible:outline-2! focus-visible:outline-solid! focus-visible:outline-offset-[-6px]! focus-visible:shadow-none!",
  "aria-pressed:ink-fill aria-pressed:border-primary aria-pressed:[--thicken-ink:var(--primary-foreground)] aria-pressed:focus-visible:outline-primary-foreground",
  "disabled:cursor-not-allowed disabled:border-dashed disabled:tone-frame disabled:shadow-none! disabled:translate-none",
].join(" ")

export type ReactionGridProps = Omit<React.ComponentProps<"div">, "children" | "onSelect"> & {
  kinds?: ManpuKind[]
  /** Marks already chosen (drawn as ink flats). */
  active?: ManpuKind[]
  /** Marks that cannot be added (the row is full). */
  blocked?: ManpuKind[]
  onSelect?: (kind: ManpuKind) => void
}

/** The grid of marks inside the picker bubble. Arrow keys move between marks. Also usable on its own. */
function ReactionGrid({ kinds = ALL_KINDS, active = [], blocked = [], onSelect, className, onKeyDown, ...props }: ReactionGridProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const cols = Math.min(4, kinds.length)

  const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    const root = ref.current
    if (!root || event.defaultPrevented) return
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("button"))
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (index < 0) return
    const rtl = getComputedStyle(root).direction === "rtl"
    const step: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
      ArrowDown: cols,
      ArrowUp: -cols,
    }
    let next = -1
    if (event.key === "Home") next = 0
    else if (event.key === "End") next = buttons.length - 1
    else if (event.key in step) next = index + step[event.key]
    else return
    event.preventDefault()
    // skip blocked marks in the direction of travel
    const dir = next >= index ? 1 : -1
    while (next >= 0 && next < buttons.length && buttons[next].disabled) next += event.key === "Home" ? 1 : event.key === "End" ? -1 : dir
    buttons[next]?.focus()
  }

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Pick a reaction"
      data-manga="reaction-grid"
      className={cn("grid w-max gap-1.5", cols === 4 ? "grid-cols-4" : cols === 3 ? "grid-cols-3" : cols === 2 ? "grid-cols-2" : "grid-cols-1", className)}
      onKeyDown={move}
      {...props}
    >
      {kinds.map((kind) => {
        const on = active.includes(kind)
        return (
          <button
            key={kind}
            type="button"
            data-kind={kind}
            aria-label={`React with ${NAMES[kind].toLowerCase()}`}
            aria-pressed={on}
            disabled={!on && blocked.includes(kind)}
            className={cn("group/chip", cell)}
            onClick={withImpact(() => onSelect?.(kind))}
          >
            <ImpactLines />
            <Manpu kind={kind} size="1.4rem" animated={false} className={markOnInk} style={{ color: "inherit" }} />
          </button>
        )
      })}
    </div>
  )
}

export type ReactionPickerProps = Omit<React.ComponentProps<"div">, "children"> & {
  reactions: Reaction[]
  /** Called with the kind clicked, from a chip or from the picker: toggle it in your state. */
  onReact?: (kind: ManpuKind) => void
  /** Marks offered in the picker (default: all eight). */
  kinds?: ManpuKind[]
  /** The most different reactions the row holds; once full, the picker only toggles those already there. */
  max?: number
  /** Read-only row: dashed chips, no picker. */
  disabled?: boolean
}

function ReactionPicker({ reactions, onReact, kinds = ALL_KINDS, max, disabled = false, className, ...props }: ReactionPickerProps) {
  const [open, setOpen] = React.useState(false)
  const shown = reactions.filter((r) => r.count > 0 || r.active)
  const present = shown.map((r) => r.kind)
  const full = max !== undefined && present.length >= max

  return (
    <div
      role="group"
      aria-label="Reactions"
      data-manga="reaction-picker"
      // pe-4: room for the impact lines of a chip that wraps to the end edge (no sideways scroll)
      className={cn("flex max-w-full flex-wrap items-center gap-2 pe-4", className)}
      {...props}
    >
      {shown.map((r) => (
        <ReactionChip key={r.kind} kind={r.kind} count={r.count} active={r.active} disabled={disabled} onClick={() => onReact?.(r.kind)} />
      ))}
      <Popover open={open} onOpenChange={(next: boolean) => setOpen(next)}>
        <PopoverTrigger
          aria-label="Add a reaction"
          data-manga="reaction-add"
          disabled={disabled}
          className={cn(chipBase, "font-sfx text-base leading-none aria-expanded:ink-fill aria-expanded:border-primary aria-expanded:[--thicken-ink:var(--primary-foreground)]")}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 overflow-visible">
            <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
          </svg>
        </PopoverTrigger>
        <PopoverContent aria-label="Pick a reaction" className="w-max! max-w-[calc(100vw-2rem)]">
          <ReactionGrid
            kinds={kinds}
            active={shown.filter((r) => r.active).map((r) => r.kind)}
            blocked={full ? kinds.filter((k) => !present.includes(k)) : []}
            onSelect={(kind) => {
              onReact?.(kind)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { ReactionChip, ReactionGrid, ReactionPicker }
