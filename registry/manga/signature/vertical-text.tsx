import * as React from "react"
import { cn } from "cn"

/*
 * Vertical writing (tategaki): characters run top to bottom, columns right to left, whatever the page's
 * reading order or writing direction. CSS writing modes only, so the text stays real text (selection,
 * search, screen readers). Latin words lie on their side unless `upright`; short numbers stand in one
 * cell with <Tcy> (tate-chū-yoko).
 */

export type VerticalTextProps = React.ComponentProps<"div"> & {
  /** Rendered element (a heading, a paragraph...). */
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4"
  /** Column height: any CSS length. Text wraps into a new column on the left when it is reached. */
  height?: string
  /** reading: the reading face · letter: the lettering face · sfx: the heavy SFX face (covers kana). */
  font?: "reading" | "letter" | "sfx"
  /** Latin letters stand upright one under the other instead of lying on their side. */
  upright?: boolean
  /** A fine ink rule between columns, like a manuscript sheet. */
  ruled?: boolean
}

const FONTS = { reading: "font-sans", letter: "font-letter", sfx: "font-sfx" }

function VerticalText({ as: Tag = "div", height, font = "reading", upright = false, ruled = false, lang = "ja", className, style, ...props }: VerticalTextProps) {
  return (
    <Tag
      data-manga="vertical-text"
      lang={lang}
      className={cn(
        "max-w-full [writing-mode:vertical-rl] leading-[1.8] [line-break:strict]",
        upright ? "[text-orientation:upright]" : "[text-orientation:mixed]",
        FONTS[font],
        // a fine rule (1px detail line) at the left edge of each column, never through the characters
        ruled && "bg-[repeating-linear-gradient(to_left,#0000_0_calc(1.8em_-_1px),var(--border)_calc(1.8em_-_1px)_1.8em)]",
        className,
      )}
      style={{ height, ...style }}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    />
  )
}

/** Tate-chū-yoko: up to 4 characters (a number, "!?") set across one cell of a vertical line. */
function Tcy({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="tcy" className={cn("[text-combine-upright:all]", className)} {...props} />
}

export { Tcy, VerticalText }
