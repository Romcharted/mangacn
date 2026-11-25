"use client"

import * as React from "react"
import { cn } from "cn"

import { SpeechBubble, type BubbleTail, type BubbleTailAlign } from "@/components/manga/speech-bubble"

/*
 * A speech (or thought) bubble that waits, then writes. Gestures: G6 (the bubble itself), G7 (waiting:
 * three ink squares rising one after another, 12 fps), and a stepped block caret while the text comes.
 * The full text is laid out from the start (the part still to come is invisible), so the bubble never
 * reflows while typing. Reduced motion: the dots stay still and the text shows at once.
 */

/** One frame at 12 fps. */
const FRAME = 83

function reducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
}

export type TypingDotsProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Spoken name of the waiting state. */
  label?: string
}

/**
 * Three ink squares that rise one after another (two frames each, then a rest): pure CSS, the base
 * `animate-dots` keyframes with a two-frame delay per dot. Still with reduced motion.
 */
function TypingDots({ label = "Typing", className, ...props }: TypingDotsProps) {
  return (
    <span
      role="status"
      aria-label={label}
      data-manga="typing-dots"
      className={cn("inline-flex h-[1.375em] items-center gap-[0.3em] px-[0.15em] align-middle", className)}
      {...props}
    >
      <span aria-hidden className="block size-[0.38em] animate-dots bg-current" />
      <span aria-hidden className="block size-[0.38em] animate-dots bg-current [animation-delay:166ms]" />
      <span aria-hidden className="block size-[0.38em] animate-dots bg-current [animation-delay:333ms]" />
    </span>
  )
}

export type TypingBubbleProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The answer. It may grow over time (streaming): only the new characters animate. */
  text: string
  /** Show the three waiting dots (the text pauses). Default: while `text` is empty. */
  typing?: boolean
  /** Characters per frame at 12 fps. 0 shows the text at once. */
  speed?: number
  /** Freezes the writing at this fraction of the text (0–1), caret included: for previews and state grids. */
  progress?: number
  variant?: "speech" | "thought"
  tail?: BubbleTail
  tailAlign?: BubbleTailAlign
  /** Called each time the visible text catches up with `text`. */
  onDone?: () => void
}

function commonPrefix(a: string, b: string) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

function TypingBubble({
  text,
  typing = !text,
  speed = 3,
  progress,
  variant = "speech",
  tail = "bottom",
  tailAlign = "start",
  onDone,
  className,
  ...props
}: TypingBubbleProps) {
  const frozen = progress !== undefined
  const [shown, setShown] = React.useState(() => (speed <= 0 ? text.length : 0))

  // A new text keeps what it shares with the old one: a growing stream never restarts from zero.
  const [prevText, setPrevText] = React.useState(text)
  if (prevText !== text) {
    setPrevText(text)
    const keep = commonPrefix(prevText, text)
    setShown((s) => Math.min(s, keep))
  }

  const onDoneRef = React.useRef(onDone)
  React.useEffect(() => {
    onDoneRef.current = onDone
  })

  // One timer per frame, cleared on every change; it stops by itself once the text is out.
  React.useEffect(() => {
    if (typing || frozen) return
    if (speed <= 0 || reducedMotion()) {
      setShown(text.length)
      return
    }
    if (shown >= text.length) return
    const id = window.setTimeout(() => setShown((s) => Math.min(text.length, s + Math.max(1, Math.round(speed)))), FRAME)
    return () => window.clearTimeout(id)
  }, [typing, frozen, speed, text.length, shown])

  const visible = frozen ? Math.round(Math.min(1, Math.max(0, progress)) * text.length) : Math.min(shown, text.length)
  const coming = visible < text.length
  const done = !typing && text.length > 0 && !coming

  React.useEffect(() => {
    if (done && !frozen) onDoneRef.current?.()
  }, [done, frozen, text])

  const state = typing ? "typing" : coming ? "writing" : "done"

  return (
    <SpeechBubble
      variant={variant}
      tail={tail}
      tailAlign={tailAlign}
      data-manga="typing-bubble"
      data-state={state}
      className={className}
      {...props}
    >
      {visible === 0 && typing ? (
        <TypingDots />
      ) : (
        <>
          <span aria-hidden data-slot="typing-text">
            {text.slice(0, visible)}
            {coming && !typing && (
              // a zero-width anchor: the block caret floats over the next (invisible) letter, so nothing reflows
              <span data-slot="typing-caret" className="relative">
                <span className="absolute start-[0.05em] top-[0.12em] block h-[1em] w-[0.45em] bg-current" />
              </span>
            )}
            {coming && !typing && <span className="invisible">{text.slice(visible)}</span>}
          </span>
          {typing && <TypingDots className="ms-[0.2em]" />}
        </>
      )}
      {/* the full text, announced once it is all out */}
      <span className="sr-only" aria-live="polite">
        {done || frozen ? text : ""}
      </span>
    </SpeechBubble>
  )
}

export { TypingBubble, TypingDots }
