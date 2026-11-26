"use client"

import * as React from "react"
import { cn } from "cn"

import { ImpactLines, prefersReducedMotion, withImpact } from "@/lib/manga/gestures"

/*
 * Dialogue box: a character speaks a queue of lines, one at a time. A portrait, a name plate on the top
 * edge, the line writing itself, and an arrow to go on. The arrow button is the control (keyboard and
 * screen readers); a click on the text does the same for pointers. While a line is writing, the button
 * shows it whole at once; once it is out, it goes to the next line.
 * Gestures: G1 (the box is a case, the portrait a case inside it), G2 (the name plate is an ink flat), G5
 * (a new speaker's plate and portrait pop), G7 (the stepped caret, the arrow blinking in two hard steps),
 * G3 / G4 on the button (inversion on hover, negative, recoil and impact lines on a click).
 * Reduced motion: each line shows at once, the arrow stays still, the states stay distinct.
 */

/** One frame at 12 fps. */
const FRAME = 83

export type DialogueLine = {
  /** Who speaks: shown on the name plate. */
  speaker: React.ReactNode
  /** The line. Plain text: it is written out character by character. */
  text: string
  /** The speaker's face: an image URL or any node (a square box is drawn for it). */
  portrait?: React.ReactNode
  /** Side of the portrait and the name plate. */
  side?: "start" | "end"
}

export type DialogueBoxProps = Omit<React.ComponentProps<"section">, "children"> & {
  lines: DialogueLine[]
  /** Current line (controlled). */
  index?: number
  /** First line (uncontrolled). */
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Called when the reader goes on after the last line. */
  onEnd?: () => void
  /** After the last line, start again from the first. With false, the box stays on the last line. */
  loop?: boolean
  /** Characters per frame at 12 fps. 0 shows each line at once. */
  speed?: number
  /** Freezes the current line at this fraction (0–1): for previews and state grids. */
  progress?: number
  /** Shows "2 / 5" next to the arrow. */
  showCount?: boolean
  /** Spoken names of the button in each state. */
  labels?: { skip?: string; next?: string; end?: string }
}

function Portrait({ portrait }: { portrait: React.ReactNode }) {
  return (
    <span aria-hidden className="relative block size-16 shrink-0 overflow-hidden ink-case-inner animate-pop sm:size-24">
      {typeof portrait === "string" ? <img src={portrait} alt="" className="absolute inset-0 size-full object-cover" /> : <span className="absolute inset-0 block">{portrait}</span>}
    </span>
  )
}

function DialogueBox({
  lines,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  onEnd,
  loop = true,
  speed = 2,
  progress,
  showCount = true,
  labels,
  className,
  "aria-label": ariaLabel = "Dialogue",
  ...props
}: DialogueBoxProps) {
  const [own, setOwn] = React.useState(defaultIndex)
  const index = Math.min(Math.max(0, controlled ?? own), Math.max(0, lines.length - 1))
  const line = lines[index]
  const text = line?.text ?? ""
  const frozen = progress !== undefined

  const [shown, setShown] = React.useState(0)
  const [prev, setPrev] = React.useState({ index, text })
  if (prev.index !== index || prev.text !== text) {
    setPrev({ index, text })
    setShown(0)
  }

  React.useEffect(() => {
    if (frozen) return
    if (speed <= 0 || prefersReducedMotion()) {
      setShown(text.length)
      return
    }
    if (shown >= text.length) return
    const id = window.setTimeout(() => setShown((s) => Math.min(text.length, s + Math.max(1, Math.round(speed)))), FRAME)
    return () => window.clearTimeout(id)
  }, [frozen, speed, text.length, shown])

  const visible = frozen ? Math.round(Math.min(1, Math.max(0, progress)) * text.length) : Math.min(shown, text.length)
  const writing = visible < text.length
  const last = index >= lines.length - 1
  const state = writing ? "writing" : last ? "end" : "waiting"

  const go = (next: number) => {
    if (controlled === undefined) setOwn(next)
    onIndexChange?.(next)
  }

  const advance = () => {
    if (!line) return
    if (writing) {
      if (!frozen) setShown(text.length)
      return
    }
    if (!last) return go(index + 1)
    onEnd?.()
    if (loop && lines.length > 1) go(0)
  }

  if (!line) return null
  const end = line.side === "end"
  const speakerKey = typeof line.speaker === "string" ? line.speaker : index
  const buttonLabel = writing ? (labels?.skip ?? "Show the whole line") : last ? (labels?.end ?? (loop ? "Start again" : "End")) : (labels?.next ?? "Next line")

  return (
    <section
      data-manga="dialogue-box"
      data-state={state}
      data-side={end ? "end" : "start"}
      aria-label={ariaLabel}
      aria-roledescription="dialogue"
      className={cn("relative isolate mt-5 w-full min-w-0 ink-case p-3 pt-5 text-foreground sm:p-4 sm:pt-6", className)}
      {...props}
    >
      {/* name plate on the top edge */}
      <span
        key={`name-${speakerKey}`}
        className={cn(
          "absolute -top-4 z-10 block h-8 max-w-[70%] truncate leading-8 ink-fill px-3 font-letter text-base tracking-wide uppercase animate-pop",
          end ? "end-3" : "start-3",
        )}
      >
        {line.speaker}
      </span>

      <div className={cn("flex items-start gap-3 sm:gap-4", end && "flex-row-reverse")}>
        {line.portrait != null && <Portrait key={`face-${speakerKey}`} portrait={line.portrait} />}
        <p
          data-slot="dialogue-text"
          onClick={advance}
          className="min-h-[4.5em] min-w-0 flex-1 cursor-pointer text-base leading-relaxed break-words sm:text-lg"
        >
          <span aria-hidden>
            {text.slice(0, visible)}
            {writing && (
              <span data-slot="dialogue-caret" className="relative">
                <span className="absolute start-[0.05em] top-[0.2em] block h-[1em] w-[0.45em] bg-current" />
              </span>
            )}
            {writing && <span className="invisible">{text.slice(visible)}</span>}
          </span>
        </p>
      </div>

      <div className="-mb-1 flex items-center justify-end gap-7 pe-3">
        {showCount && lines.length > 1 && (
          <span className="font-mono text-xs" aria-hidden>
            {index + 1} / {lines.length}
          </span>
        )}
        <button
          type="button"
          aria-label={buttonLabel}
          onClick={withImpact(advance)}
          className={cn(
            "relative grid size-11 place-items-center border-[length:var(--mg-bw)] border-transparent bg-background text-foreground",
            "hover-invert active:translate-x-0.5 active:translate-y-0.5 active:bg-foreground active:text-background active:shadow-[inset_0_0_0_2px_var(--background)] rtl:active:-translate-x-0.5",
            "data-[impact]:animate-hit focus-ink",
          )}
        >
          {state === "writing" ? (
            // two small chevrons: fast-forward the line
            <svg aria-hidden viewBox="0 0 20 20" className="size-5">
              <path d="M3 4l6 6-6 6M10 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="miter" />
            </svg>
          ) : state === "end" && !loop ? (
            <span aria-hidden className="block size-3.5 bg-current" />
          ) : (
            <svg aria-hidden viewBox="0 0 20 20" className={cn("size-5", state === "waiting" && "animate-blink")}>
              <path d="M3 6h14l-7 9z" fill="currentColor" />
            </svg>
          )}
          <ImpactLines />
        </button>
      </div>

      {/* the whole line, announced once it is out */}
      <span className="sr-only" aria-live="polite">
        {!writing ? (
          <>
            {line.speaker}: {text}
          </>
        ) : (
          ""
        )}
      </span>
    </section>
  )
}

export { DialogueBox }
