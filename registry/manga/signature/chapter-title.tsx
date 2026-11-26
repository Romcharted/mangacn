import * as React from "react"
import { cn } from "cn"

import { VerticalText } from "@/components/manga/vertical-text"

/*
 * Chapter title page, used as a section header: a big number in the SFX face, the chapter label and
 * title in lettering, a 3px ink rule under them and an optional column of vertical text at the end
 * side, against a band of speed lines on the edge (rule A: lines beside the text, never under it).
 * Gestures: G1 (the ink variant is a flat like an ink panel), G5 (animated: the number pops, the rule
 * grows from the start, in steps). Reduced motion: nothing moves.
 */

export type ChapterTitleProps = Omit<React.ComponentProps<"header">, "title"> & {
  /** The chapter number, shown big: 3, "03", "IV". */
  number: React.ReactNode
  title: React.ReactNode
  /** Small lettering above the number. */
  label?: React.ReactNode
  /** A line under the title. */
  subtitle?: React.ReactNode
  /** A short column of vertical text at the end side (a subtitle, the title in Japanese). */
  vertical?: React.ReactNode
  /** Language of the vertical text. */
  verticalLang?: string
  /** Heading level of the title. */
  as?: "h1" | "h2" | "h3"
  /** id of the heading, for aria-labelledby and links. */
  titleId?: string
  /** paper (default) or an ink page with paper lettering. */
  variant?: "paper" | "ink"
  /** The number pops and the rule grows when it appears (G5). Off with reduced motion. */
  animated?: boolean
}

function ChapterTitle({
  number,
  title,
  label = "Chapter",
  subtitle,
  vertical,
  verticalLang = "ja",
  as: Heading = "h2",
  titleId,
  variant = "paper",
  animated = false,
  className,
  ...props
}: ChapterTitleProps) {
  const ink = variant === "ink"
  return (
    <header
      data-manga="chapter-title"
      data-variant={variant}
      className={cn(
        "@container/chapter relative isolate p-4 sm:p-6",
        ink ? "bg-foreground text-background [--border:var(--background)] [--tone-ink:var(--background)]" : "bg-background text-foreground",
        className,
      )}
      {...props}
    >
      {/* Narrow: the number over the title, the vertical column at the end. From 32rem: number | title | column. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 gap-y-3 @lg/chapter:grid-cols-[auto_minmax(0,1fr)_auto] @lg/chapter:gap-x-6">
      <div aria-hidden className="col-start-1 row-start-1 grid justify-items-start gap-1 self-stretch content-end">
        <span className="font-letter text-sm leading-none tracking-widest uppercase">{label}</span>
        <span className={cn("block font-sfx text-7xl leading-[0.85] @lg/chapter:text-8xl", animated && "animate-pop")}>{number}</span>
      </div>

      <div className="col-start-1 row-start-2 grid min-w-0 gap-2 pb-1 @lg/chapter:col-start-2 @lg/chapter:row-start-1">
        <Heading id={titleId} className="font-letter text-4xl leading-[0.95] tracking-wide break-words uppercase @lg/chapter:text-5xl">
          <span className="sr-only">
            {label} {number}:{" "}
          </span>
          {title}
        </Heading>
        <span
          aria-hidden
          className={cn("block h-[length:var(--mg-bw-panel)] w-full origin-left bg-current rtl:origin-right", animated && "animate-bar-in")}
        />
        {subtitle != null && <p className="text-base leading-snug sm:text-lg">{subtitle}</p>}
      </div>

      {vertical != null && (
        <div className="relative col-start-2 row-span-2 row-start-1 flex self-stretch ps-3 @lg/chapter:col-start-3 @lg/chapter:row-span-1">
          {/* the edge band: speed lines beside the column, never under the letters */}
          <span aria-hidden className="absolute inset-y-0 start-0 w-1.5 tone-lines" />
          <VerticalText font="letter" lang={verticalLang} className="max-h-48 text-2xl leading-[1.4]">
            {vertical}
          </VerticalText>
        </div>
      )}
      </div>
    </header>
  )
}

export { ChapterTitle }
