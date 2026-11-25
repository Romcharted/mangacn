"use client"

import * as React from "react"
import { cn } from "cn"

import { Button, buttonClassName } from "@/components/ui/manga/button"
import { Sfx } from "@/components/manga/sfx"
import { Stamp } from "@/components/manga/stamp"

/*
 * Chapter end: the card at the foot of a chapter. A 3px panel whose concentration lines (G5 focus lines)
 * surround a central paper plate, so no line runs under the text (Rule A). In the plate: the chapter line, the
 * SFX word and a brush arrow in the reading direction (a check for the end of a series). Under it: the next
 * chapter as a button (G3 hover lift, G4 impact, focus ring) or, when it is not out yet, a stamp with the date.
 * The panel pops in once (G5).
 */

export type ChapterEndNext = {
  number: React.ReactNode
  title: React.ReactNode
  /** Makes the next chapter a link. */
  href?: string
  /** Makes the next chapter a button. */
  onSelect?: () => void
  /** An image URL, or any node drawn as the cover (a 2:3 box is drawn for you). */
  cover?: string | React.ReactNode
  /** Shown as "Out on {date}" when the next chapter has neither href nor onSelect (not out yet). */
  date?: React.ReactNode
}

export type ChapterEndProps = Omit<React.ComponentProps<"section">, "children" | "title"> & {
  /** The chapter just read, e.g. "Chapter 12 · Echo". */
  chapter?: React.ReactNode
  /** continued: more to come · end: the series is over */
  variant?: "continued" | "end"
  /** The big word. Default: "To be continued" (continued) or "The end" (end). */
  title?: string
  next?: ChapterEndNext
  /** Extra actions, e.g. back to the series, comments. */
  children?: React.ReactNode
  className?: string
}

function NextInfo({ next }: { next: ChapterEndNext }) {
  const art =
    typeof next.cover === "string" ? (
      <img src={next.cover} alt="" className="absolute inset-0 size-full object-cover" />
    ) : (
      // the drawn cover keeps its ink on the ink button
      <span className="absolute inset-0 block bg-background text-foreground">{next.cover}</span>
    )
  return (
    <span className="flex min-w-0 flex-1 items-center gap-3">
      {next.cover && (
        <span className="relative block aspect-[2/3] w-10 shrink-0 overflow-hidden border-[length:var(--mg-bw)] border-current bg-background">
          {art}
        </span>
      )}
      <span className="grid min-w-0 gap-0.5">
        <span className="block font-mono text-xs normal-case">Next · ch. {next.number}</span>
        <span className="block font-letter break-words uppercase">{next.title}</span>
      </span>
    </span>
  )
}

/** The next chapter as an action: a link, a button, or (not out yet) the date in a stamp. */
function ChapterNext({ next, className, ...props }: { next: ChapterEndNext } & React.HTMLAttributes<HTMLElement>) {
  if (next.href)
    return (
      <a
        {...props}
        href={next.href}
        className={cn(buttonClassName({ variant: "default" }), "flex w-full !h-auto min-h-12 items-center py-2 text-start whitespace-normal", className)}
      >
        <NextInfo next={next} />
      </a>
    )
  if (next.onSelect)
    return (
      <Button
        {...props}
        variant="default"
        className={cn("!h-auto min-h-12 w-full py-2 text-start whitespace-normal", className)}
        onClick={() => next.onSelect?.()}
      >
        <NextInfo next={next} />
      </Button>
    )
  return (
    <div className={cn("grid gap-3 border-ink-fine bg-background p-3", className)} {...props}>
      <NextInfo next={next} />
      <span className="justify-self-start">
        <Stamp tone="ink" rotate={-3}>
          Out on {next.date}
        </Stamp>
      </span>
    </div>
  )
}

function ChapterEnd({ chapter, variant = "continued", title, next, children, className, ...props }: ChapterEndProps) {
  const isEnd = variant === "end"
  const word = title ?? (isEnd ? "The end" : "To be continued")
  return (
    <section
      data-manga="chapter-end"
      data-variant={variant}
      className={cn("@container/end relative grid gap-4 border-ink-panel bg-background p-3 text-foreground animate-pop sm:p-4", className)}
      {...props}
    >
      <div className="relative isolate grid place-items-center overflow-hidden px-3 py-8 focus-lines @sm/end:px-8 @sm/end:py-12">
        <div className="relative z-10 grid w-full max-w-md justify-items-center gap-4 border-ink bg-background px-3 py-6 text-center @sm/end:px-4">
          {chapter !== undefined && chapter !== null && <p className="font-mono text-xs">End of {chapter}</p>}
          <div className="flex flex-wrap items-center justify-center gap-3 reading-rtl:flex-row-reverse">
            {/* the word steps down with the card's own width (container query), not the window's */}
            <Sfx size="md" rotate={-6} label={word} style={{ whiteSpace: "normal" }} className="max-w-full text-center break-words @max-sm/end:text-3xl @lg/end:text-5xl">
              {word}
            </Sfx>
            {isEnd ? (
              <span aria-hidden className="mark-check size-8 shrink-0 text-foreground" />
            ) : (
              <span aria-hidden className="mark-arrow size-8 shrink-0 rotate-90 text-foreground reading-rtl:-rotate-90" />
            )}
          </div>
        </div>
      </div>
      {next && <ChapterNext next={next} />}
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </section>
  )
}

export { ChapterEnd, ChapterNext }
