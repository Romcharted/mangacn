import * as React from "react"
import { cn } from "cn"

/*
 * Ruby (furigana): small readings set over (or beside, in vertical text) the characters they read.
 * Native <ruby> / <rt> markup with <rp> fallbacks, so it copies, reads aloud and wraps like text.
 * Readings use the reading face at half size; the base keeps the face it sits in.
 * reveal="hover": readings stay hidden until the word is hovered or focused (for learners). Their room is
 * kept, so nothing reflows, and they are still read aloud; the word is then focusable, with a dotted
 * underline that thickens on hover (G3) and the ink focus ring. CSS only.
 */

/** One base with its reading: [base, reading]. Leave the reading out for kana or punctuation. */
export type RubyPart = [base: string, reading?: string]

export type RubyProps = Omit<React.ComponentProps<"ruby">, "children"> & {
  /** The characters. Use `parts` instead for a reading per character (mono ruby). */
  base?: React.ReactNode
  /** The reading over the whole base (group ruby). */
  reading?: React.ReactNode
  /** One reading per character or group: [["漢", "かん"], ["字", "じ"]]. Takes over `base` / `reading`. */
  parts?: RubyPart[]
  /** over (default) or under the base. In vertical text, over is on the right. */
  position?: "over" | "under"
  /** always: readings shown · hover: shown on hover or focus (room kept) · never: hidden but still read aloud. */
  reveal?: "always" | "hover" | "never"
}

function Rt({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <rp>(</rp>
      <rt data-slot="ruby-reading" className="font-sans text-[0.5em] leading-none font-normal tracking-normal not-italic">
        {children}
      </rt>
      <rp>)</rp>
    </>
  )
}

function Ruby({ base, reading, parts, position = "over", reveal = "always", lang = "ja", className, ...props }: RubyProps) {
  const hover = reveal === "hover"
  return (
    <ruby
      data-manga="ruby"
      data-reveal={reveal}
      lang={lang}
      tabIndex={hover ? 0 : undefined}
      className={cn(
        "[ruby-align:center]",
        position === "under" ? "[ruby-position:under]" : "[ruby-position:over]",
        // transparent, not invisible: the reading keeps its room and is still read aloud
        reveal !== "always" && "[&_rt]:text-transparent [&_rt]:select-none",
        hover && "cursor-help underline decoration-dotted decoration-2 underline-offset-4 hover:decoration-4 focus-ink",
        hover && "[&:hover_rt]:text-current [&:focus-visible_rt]:text-current",
        className,
      )}
      {...props}
    >
      {parts ? (
        parts.map(([b, r], i) => (
          <React.Fragment key={i}>
            {b}
            {r ? <Rt>{r}</Rt> : <rt />}
          </React.Fragment>
        ))
      ) : (
        <>
          {base}
          {reading != null && <Rt>{reading}</Rt>}
        </>
      )}
    </ruby>
  )
}

export { Ruby }
