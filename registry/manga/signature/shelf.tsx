"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/manga/button"
import { VolumeCard, type VolumeStatus } from "@/components/manga/volume-card"

/*
 * Shelf: volumes standing on a plank, spine out. Pulling one (click, Enter) slides it up out of the row and
 * opens its card under the shelf: cover, status, progress and an Open action. Gestures: G1 each spine is a
 * 2px case, the shelf a 3px plank with a tone band under it (no text on it) · G3 hover-lift on a spine ·
 * G2 the pulled spine is an ink flat that sweeps in, raised by 16px in two steps · G5 the card drops in
 * (animate-drop-in) · focus ring (focus-ink), pressed offset (press). Arrows move along the row, Escape
 * puts the volume back.
 */

export type ShelfSpine = "plain" | "band" | "tone"

export type ShelfVolume = {
  id: string
  title: string
  volume: number | string
  author?: React.ReactNode
  /** Image URL or any node, drawn in a 2:3 box on the card. */
  cover?: React.ReactNode
  status?: VolumeStatus
  read?: number
  total?: number
  /** Spine width: 1 thin · 2 · 3 thick. */
  thickness?: 1 | 2 | 3
  /** plain · band: a tone band under the number · tone: tone at both ends. */
  spine?: ShelfSpine
}

export type ShelfProps = Omit<React.ComponentProps<"section">, "onSelect"> & {
  volumes: ShelfVolume[]
  /** Id of the volume pulled out (null: none). */
  selected?: string | null
  defaultSelected?: string | null
  onSelectedChange?: (id: string | null) => void
  /** Called by the Open button of the pulled volume. */
  onOpen?: (volume: ShelfVolume) => void
  openLabel?: string
  /** rtl: volume 1 stands at the right end (manga order) · ltr: at the left. */
  direction?: "rtl" | "ltr"
}

const widths = { 1: "w-11", 2: "w-12", 3: "w-14" } as const
// a little variety in height, like real volumes (written out so Tailwind sees every class)
const heights = ["h-52", "h-56", "h-54", "h-56", "h-52"]

function Spine({ v, index, pulled, controls, onPull }: { v: ShelfVolume; index: number; pulled: boolean; controls: string; onPull: () => void }) {
  const kind = v.spine ?? "plain"
  return (
    <button
      type="button"
      data-slot="shelf-spine"
      aria-expanded={pulled}
      aria-controls={pulled ? controls : undefined}
      aria-label={`Vol. ${v.volume}, ${v.title}`}
      onClick={onPull}
      className={cn(
        "group/spine relative isolate flex shrink-0 cursor-pointer flex-col items-stretch border-[length:var(--mg-bw)] border-border bg-background text-foreground",
        widths[v.thickness ?? 2],
        heights[index % heights.length],
        "hover-lift focus-ink press",
        // pulled out: an ink flat, raised in two steps
        "transition-[translate] duration-[166ms] ease-[steps(2)] motion-reduce:transition-none aria-expanded:-translate-y-4 aria-expanded:ink-fill aria-expanded:fill-in",
      )}
    >
      <span className="block shrink-0 ink-fill px-0.5 py-1 text-center font-letter text-sm leading-none group-aria-expanded/spine:border-b-2 group-aria-expanded/spine:border-primary-foreground">
        {v.volume}
      </span>
      {kind === "band" && <span aria-hidden className="block h-4 shrink-0 border-b-[length:var(--mg-bw-fine)] border-current tone-lines" />}
      {kind === "tone" && <span aria-hidden className="block h-6 shrink-0 border-b-[length:var(--mg-bw-fine)] border-current tone-35" />}
      <span className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-2">
        <span className="max-h-full truncate font-letter text-base leading-none tracking-wide uppercase [writing-mode:vertical-rl]">{v.title}</span>
      </span>
      {kind === "tone" && <span aria-hidden className="block h-6 shrink-0 border-t-[length:var(--mg-bw-fine)] border-current tone-35" />}
      <span aria-hidden className="block h-2.5 shrink-0 border-t-[length:var(--mg-bw-fine)] border-current" />
    </button>
  )
}

function Shelf({
  volumes,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  onOpen,
  openLabel = "Open",
  direction = "ltr",
  className,
  "aria-label": ariaLabel = "Shelf",
  ...props
}: ShelfProps) {
  const [inner, setInner] = React.useState<string | null>(defaultSelected)
  const selected = selectedProp === undefined ? inner : selectedProp
  const id = React.useId()
  const rowRef = React.useRef<HTMLUListElement>(null)
  const setSelected = (v: string | null) => {
    if (selectedProp === undefined) setInner(v)
    onSelectedChange?.(v)
  }
  const pulled = volumes.find((v) => v.id === selected)

  const putBack = () => {
    const at = volumes.findIndex((v) => v.id === selected)
    setSelected(null)
    rowRef.current?.querySelectorAll<HTMLElement>("[data-slot=shelf-spine]")[at]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const spines = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-slot=shelf-spine]"))
    const at = spines.indexOf(document.activeElement as HTMLElement)
    if (at < 0) return
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const step = e.key === "ArrowRight" ? (rtl ? -1 : 1) : e.key === "ArrowLeft" ? (rtl ? 1 : -1) : 0
    let to = -1
    if (step) to = Math.min(spines.length - 1, Math.max(0, at + step))
    else if (e.key === "Home") to = 0
    else if (e.key === "End") to = spines.length - 1
    if (to < 0) return
    e.preventDefault()
    spines[to].focus()
    spines[to].scrollIntoView({ block: "nearest", inline: "nearest" })
  }

  return (
    <section
      data-manga="shelf"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Escape" && selected) {
          e.preventDefault()
          putBack()
        }
      }}
      className={cn("grid w-full min-w-0 gap-4 text-foreground", className)}
      {...props}
    >
      <div className="relative min-w-0">
        <ul
          ref={rowRef}
          onKeyDown={onKeyDown}
          className="m-0 flex list-none items-end gap-1 overflow-x-auto px-3 pt-6 pb-0"
          style={{ direction }}
        >
          {volumes.map((v, i) => (
            <li key={v.id} className="flex shrink-0 [direction:ltr]">
              <Spine v={v} index={i} pulled={v.id === selected} controls={`${id}-card`} onPull={() => setSelected(v.id === selected ? null : v.id)} />
            </li>
          ))}
          {/* room at the end of the row, so the last spine's shadow is not cut */}
          <li aria-hidden className="w-2 shrink-0" />
        </ul>
        {/* the plank: an ink edge, a band of tone, an ink edge */}
        <div aria-hidden className="h-4 border-y-[length:var(--mg-bw-panel)] border-border bg-background tone-lines" />
      </div>

      {pulled && (
        <div
          id={`${id}-card`}
          key={pulled.id}
          role="region"
          aria-label={`Vol. ${pulled.volume}, ${pulled.title}`}
          className="relative grid animate-drop-in grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-end gap-4 px-1 pb-1"
        >
          {/* the card is the case (G1); the actions stand beside it */}
          <VolumeCard
            title={pulled.title}
            volume={pulled.volume}
            cover={pulled.cover}
            author={pulled.author}
            status={pulled.status}
            read={pulled.read}
            total={pulled.total}
          />
          <div className="flex min-w-0 flex-col items-start gap-2 pb-1">
            <Button onClick={() => onOpen?.(pulled)} className="max-sm:min-h-11">
              {openLabel}
            </Button>
            <Button variant="outline" onClick={putBack} className="max-sm:min-h-11">
              Put back
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export { Shelf }
