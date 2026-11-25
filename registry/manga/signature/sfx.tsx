import * as React from "react"
import { cn } from "cn"

export type SfxProps = React.ComponentProps<"span"> & {
  size?: "sm" | "md" | "lg" | "xl"
  /** Tilt in degrees. */
  rotate?: number
  /** solid: ink letters with a paper outline · outline: paper letters with an ink outline. */
  variant?: "solid" | "outline"
  /** Plays a stepped pop when it appears (G5). Off with reduced motion. */
  animated?: boolean
  /** Spoken text for screen readers. Without it the sound effect is decorative (aria-hidden). */
  label?: string
}

// Designed at 375px first: the two big sizes step down on phones so a word still fits the screen.
const sizes = { sm: "text-2xl", md: "text-4xl", lg: "text-5xl sm:text-6xl", xl: "text-6xl sm:text-8xl" }

/** Onomatopoeia lettering: the SFX face (covers katakana), a paper knockout, a tilt. */
function Sfx({ size = "md", rotate = -8, variant = "solid", animated = true, label, className, style, ...props }: SfxProps) {
  return (
    <span
      data-manga="sfx"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn(
        "inline-block font-sfx leading-none whitespace-nowrap select-none",
        sizes[size],
        variant === "solid" ? "text-foreground knockout" : "text-background [-webkit-text-stroke:0.08em_var(--foreground)] [paint-order:stroke_fill]",
        animated && "animate-sfx",
        className,
      )}
      style={{ rotate: `${rotate}deg`, ...style }}
      {...props}
    />
  )
}

export { Sfx }
