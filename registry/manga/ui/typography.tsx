import * as React from "react"
import { cn } from "cn"

/*
 * Plain styled elements, no state, no gesture of their own: headings use the lettering face (H1/H2 can switch to
 * the SFX face with `sfx`), body text the reading face, and every variant keeps the same ink (muted is smaller,
 * never grey). The narration box is a case (G1) with a 6px bar at its start; the table reuses the kit Table look
 * without depending on it.
 */

type HeadingProps = React.ComponentProps<"h1"> & {
  sfx?: boolean
  /** The element: the H1 look on another level (a block title inside a page that has its h1, a specimen). */
  as?: "h1" | "h2" | "p"
}

export function TypographyH1({ className, sfx = false, as: Tag = "h1", ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(
        "scroll-m-20 text-balance text-4xl leading-tight tracking-wide lg:text-5xl",
        sfx ? "font-sfx" : "font-letter",
        className,
      )}
      {...props}
    />
  )
}

export function TypographyH2({ className, sfx = false, ...props }: React.ComponentProps<"h2"> & { sfx?: boolean }) {
  return (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b-[length:var(--mg-bw)] border-border pb-2 text-3xl tracking-wide first:mt-0",
        sfx ? "font-sfx" : "font-letter",
        className,
      )}
      {...props}
    />
  )
}

export function TypographyH3({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("mt-8 scroll-m-20 font-letter text-2xl tracking-wide", className)} {...props} />
}

export function TypographyH4({ className, ...props }: React.ComponentProps<"h4">) {
  return <h4 className={cn("mt-6 scroll-m-20 text-lg font-bold", className)} {...props} />
}

export function TypographyP({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
}

export function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xl leading-relaxed", className)} {...props} />
}

export function TypographyLarge({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-letter text-xl tracking-wide", className)} {...props} />
}

export function TypographySmall({ className, ...props }: React.ComponentProps<"small">) {
  return <small className={cn("text-sm leading-none font-medium", className)} {...props} />
}

/** Smaller text, same ink: a note, a caption, a credit. Never grey. */
export function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm", className)} {...props} />
}

/** A narration box: a 2px case with a 6px ink bar at the start of the text. */
export function TypographyBlockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return <blockquote className={cn("ink-case-inner my-6 border-s-[6px]! ps-5 pe-4 py-3 text-lg", className)} {...props} />
}

export function TypographyList({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("my-6 ms-6 list-disc [&>li]:mt-2", className)} {...props} />
}

/** Inline code in a fine frame, in the monospace face. */
export function TypographyInlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return <code className={cn("border-ink-fine px-1.5 py-0.5 font-mono text-sm font-semibold", className)} {...props} />
}

/**
 * A table in a case, with the kit Table look: an ink header, 1px row rules, no stripes.
 * Pass native thead / tbody / tr / th / td children.
 */
export function TypographyTable({ className, children, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-manga="typography-table" className="relative my-6 ink-case">
      <table
        className={cn(
          "w-full border-collapse text-base",
          "[&_thead]:bg-primary [&_thead]:text-primary-foreground",
          "[&_th]:h-11 [&_th]:px-3 [&_th]:text-start [&_th]:font-letter [&_th]:font-normal [&_th]:tracking-wide [&_th]:uppercase",
          "[&_td]:px-3 [&_td]:py-2.5",
          "[&_tbody_tr]:border-b-[length:var(--mg-bw-fine)] [&_tbody_tr]:border-border [&_tbody_tr:last-child]:border-b-0",
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}
