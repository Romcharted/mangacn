"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Obi band: the paper promotional band wrapped round the lower part of a volume. Gestures: G1 case (the band's two
 * ink lines), G2 flat (the ink band), G8 mark (the NEW burst, rotated), a fold strip at the start edge. Static: no
 * hover, no press. Rule A: the lettering sits on the flat; on paper the screentone is only a 6px strip on the top edge.
 * Text scales with the cover through container queries (@container on the 2:3 box).
 */

export type ObiBandProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Drawn inside the 2:3 box when no `cover` is given. */
  children?: React.ReactNode
  /** An image URL (object-cover), or any node drawn as the cover. Takes precedence over children. */
  cover?: string | React.ReactNode
  /** The big catchphrase, in lettering. */
  headline: React.ReactNode
  /** A small line under the headline, e.g. "Over 2 million copies in print". */
  caption?: React.ReactNode
  /** A short word drawn in a burst at the band's end corner, e.g. "NEW". */
  badge?: React.ReactNode
  /** accent: the one colour of the kit · ink: an ink flat · paper: paper with a screentone top edge */
  tone?: "accent" | "ink" | "paper"
  /** Band height: 26 %, 34 % or 42 % of the cover (the band grows with its text). */
  size?: "sm" | "md" | "lg"
  className?: string
}

const BAND_SIZE = {
  sm: "min-h-[26%]",
  md: "min-h-[34%]",
  lg: "min-h-[42%]",
} as const

const BAND_TONE = {
  accent: "bg-destructive text-primary-foreground",
  ink: "ink-fill",
  paper: "bg-background text-foreground pt-3 before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:content-[''] before:tone-lines",
} as const

const FOLD_TONE = {
  accent: "bg-primary shadow-[inset_-2px_0_0_0_var(--background)]",
  ink: "bg-primary shadow-[inset_-2px_0_0_0_var(--background)]",
  paper: "bg-primary",
} as const

const BADGE_TONE = {
  accent: "before:bg-primary text-primary-foreground",
  ink: "before:bg-destructive text-primary-foreground",
  paper: "before:bg-destructive text-primary-foreground",
} as const

function ObiBand({
  children,
  cover,
  headline,
  caption,
  badge,
  tone = "accent",
  size = "md",
  className,
  ...props
}: ObiBandProps) {
  const art = cover ?? children
  return (
    <div data-manga="obi-band" data-tone={tone} data-size={size} className={cn("block w-full", className)} {...props}>
      <div className="relative isolate @container aspect-[2/3] w-full bg-background">
        {typeof cover === "string" ? (
          <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
        ) : art != null ? (
          <span className="absolute inset-0 block">{art}</span>
        ) : (
          <span aria-hidden className="absolute inset-0 block tone-lines" />
        )}
        <span aria-hidden className="pointer-events-none absolute inset-0 border-2 border-border" />
        <div
          className={cn(
            "absolute -inset-x-1 bottom-0 z-[1] flex flex-col justify-center gap-1 border-y-2 border-border ps-4 pe-3 py-2",
            BAND_SIZE[size],
            BAND_TONE[tone],
          )}
        >
          <span aria-hidden className={cn("absolute inset-y-0 start-0 w-1.5", FOLD_TONE[tone])} />
          <span className="block font-letter text-xl leading-tight break-words uppercase @xs:text-2xl @sm:text-3xl">{headline}</span>
          {caption != null && <span className="block font-sans text-xs leading-snug">{caption}</span>}
          {badge != null && (
            <span
              className={cn(
                "absolute -top-4 end-2 isolate inline-grid min-h-7 place-items-center px-3 font-sfx text-sm leading-none rotate-[-8deg] before:absolute before:-inset-x-2 before:-inset-y-2 before:-z-10 before:content-[''] before:shape-burst",
                BADGE_TONE[tone],
              )}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export { ObiBand }
