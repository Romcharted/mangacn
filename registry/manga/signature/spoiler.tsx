"use client"

import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/manga/button"

/*
 * Spoiler. Gestures: G1 case (the paper plate, ink-case-inner), G3 hover (the plate's tone shadow appears when the
 * cover is hovered, drawn with a direct-parent selector), focus-ink and press on the cover, G5 pop (the content
 * appears on reveal), G2 flat (inline: the hidden words are an ink flat). Rule A: the words sit on the paper plate,
 * never on the tone. Inline: no screentone under 24 px, so the hidden words are an ink bar with transparent text.
 */

export type SpoilerProps = React.HTMLAttributes<HTMLElement> & {
  /** block: an image or paragraph under a screentone cover · inline: a few words in a sentence */
  variant?: "block" | "inline"
  /** What the spoiler hides, e.g. "Chapter 12 ending". */
  label?: string
  /** Controlled reveal state. */
  revealed?: boolean
  /** Uncontrolled initial reveal state. */
  defaultRevealed?: boolean
  onRevealedChange?: (revealed: boolean) => void
  /** Extra attributes for the reveal button (showcase states, data-*). */
  triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & { [key: `data-${string}`]: string | undefined }
  className?: string
  children?: React.ReactNode
}

function Spoiler({
  variant = "block",
  label = "Spoiler",
  revealed,
  defaultRevealed = false,
  onRevealedChange,
  triggerProps,
  className,
  children,
  ...props
}: SpoilerProps) {
  const [inner, setInner] = React.useState(defaultRevealed)
  const controlled = revealed !== undefined
  const open = controlled ? revealed : inner
  const set = (next: boolean) => {
    if (!controlled) setInner(next)
    onRevealedChange?.(next)
  }

  if (variant === "inline") {
    if (open)
      return (
        <span
          data-manga="spoiler"
          data-variant="inline"
          data-revealed=""
          className={cn("underline decoration-solid decoration-2 underline-offset-4", className)}
          {...props}
        >
          {children}
        </span>
      )
    return (
      <button
        type="button"
        data-manga="spoiler"
        data-variant="inline"
        {...props}
        {...triggerProps}
        aria-label={`Reveal spoiler: ${label}`}
        aria-expanded={false}
        onClick={() => set(true)}
        className={cn(
          "inline cursor-pointer border-ink bg-primary px-1 text-transparent box-decoration-clone [--thicken-ink:var(--background)] hover-thicken focus-ink press",
          className,
        )}
      >
        <span aria-hidden>{children}</span>
      </button>
    )
  }

  return (
    <div
      data-manga="spoiler"
      data-variant="block"
      data-revealed={open ? "" : undefined}
      className={cn("relative isolate", className)}
      {...props}
    >
      <div inert={!open} aria-hidden={open ? undefined : true} className={open ? "animate-pop" : undefined}>
        {children}
      </div>
      {open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Hide spoiler: ${label}`}
          onClick={() => set(false)}
          className="absolute end-2 top-2 z-20 max-sm:min-h-11"
        >
          Hide
        </Button>
      ) : (
        <button
          type="button"
          {...triggerProps}
          aria-label={`Reveal spoiler: ${label}`}
          aria-expanded={false}
          onClick={() => set(true)}
          className="absolute inset-0 z-10 grid cursor-pointer place-items-center border-2 border-border bg-background tone-35 focus-ink press"
        >
          <span className="relative grid max-w-[calc(100%-2rem)] gap-1 ink-case-inner px-3 py-2 text-center [--shadow-x:4px] [--shadow-y:4px] [button:hover>&]:tone-shadow">
            <span className="font-letter text-xs leading-none uppercase">Spoiler</span>
            <span className="font-letter text-base leading-tight break-words uppercase">{label}</span>
            <span className="font-sans text-xs leading-snug">Tap to reveal</span>
          </span>
        </button>
      )}
    </div>
  )
}

export { Spoiler }
