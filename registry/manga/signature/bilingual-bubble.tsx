"use client"

import * as React from "react"
import { cn } from "cn"

import { withImpact } from "@/lib/manga/gestures"
import { SpeechBubble, type SpeechBubbleProps } from "@/components/manga/speech-bubble"

/*
 * A speech bubble that switches between the original line and its translation. It wraps SpeechBubble
 * without changing it: both texts are laid out in the same cell, so the bubble keeps the size of the longer
 * one and never jumps when it switches. A two-cell switch sits above the bubble.
 * Gestures: G6 (the bubble), G5 (the line that comes in pops, in steps), G2 (the current language is an ink
 * flat that sweeps in), G3 (cells of a group thicken their line), G4 (a click hits: negative and recoil).
 * The hidden text is invisible and aria-hidden; each text carries its own `lang`.
 */

export type BilingualSide = "original" | "translation"

export type BilingualBubbleProps = Omit<SpeechBubbleProps, "children"> & {
  /** The line as first written. */
  original: React.ReactNode
  /** The same line, translated. */
  translation: React.ReactNode
  originalLang?: string
  translationLang?: string
  /** Short label of each language on the switch. */
  originalLabel?: string
  translationLabel?: string
  /** Shown text (controlled). */
  showing?: BilingualSide
  /** Shown text at first (uncontrolled). */
  defaultShowing?: BilingualSide
  onShowingChange?: (showing: BilingualSide) => void
  /** Spoken name of the switch. */
  switchLabel?: string
  /** Where the switch sits along the top edge. */
  switchAlign?: "start" | "end"
}

const cell = cn(
  "relative touch-hit h-9 min-w-11 bg-background px-3 font-letter text-sm tracking-wide text-foreground uppercase max-sm:h-11",
  "border-s-[length:var(--mg-bw)] border-border first:border-s-0",
  "hover-thicken aria-pressed:hover:shadow-none",
  "active:translate-x-0.5 active:translate-y-0.5 active:bg-foreground active:text-background rtl:active:-translate-x-0.5 data-[impact]:animate-hit",
  "aria-pressed:ink-fill aria-pressed:fill-in",
  "focus-visible:outline-solid! focus-visible:outline-2! focus-visible:outline-ring! focus-visible:outline-offset-[-5px]! focus-visible:shadow-none!",
)

function BilingualBubble({
  original,
  translation,
  originalLang = "ja",
  translationLang = "en",
  originalLabel = "JA",
  translationLabel = "EN",
  showing: controlled,
  defaultShowing = "original",
  onShowingChange,
  switchLabel = "Language",
  switchAlign = "end",
  className,
  ...bubble
}: BilingualBubbleProps) {
  const [own, setOwn] = React.useState<BilingualSide>(defaultShowing)
  const showing = controlled ?? own
  // the text that comes in pops; the first render stays still
  const [changes, setChanges] = React.useState(0)

  const pick = (next: BilingualSide) => {
    if (next === showing) return
    if (controlled === undefined) setOwn(next)
    setChanges((n) => n + 1)
    onShowingChange?.(next)
  }

  const text = (side: BilingualSide, lang: string, node: React.ReactNode) => {
    const on = showing === side
    return (
      <span
        key={on ? `${side}-${changes}` : side}
        lang={lang}
        aria-hidden={!on}
        data-slot={`bilingual-${side}`}
        className={cn("[grid-area:1/1] [word-break:auto-phrase]", on ? changes > 0 && "animate-pop" : "invisible")}
      >
        {node}
      </span>
    )
  }

  return (
    <div
      data-manga="bilingual-bubble"
      data-showing={showing}
      className={cn("inline-flex max-w-full flex-col gap-1", switchAlign === "end" ? "items-end" : "items-start", className)}
    >
      <div role="group" aria-label={switchLabel} className="inline-flex border-[length:var(--mg-bw)] border-border bg-background">
        <button type="button" lang={originalLang} aria-pressed={showing === "original"} onClick={withImpact(() => pick("original"))} className={cell}>
          {originalLabel}
        </button>
        <button type="button" lang={translationLang} aria-pressed={showing === "translation"} onClick={withImpact(() => pick("translation"))} className={cell}>
          {translationLabel}
        </button>
      </div>
      <SpeechBubble {...bubble} className="self-stretch">
        <span className="grid">
          {text("original", originalLang, original)}
          {text("translation", translationLang, translation)}
        </span>
      </SpeechBubble>
    </div>
  )
}

export { BilingualBubble }
