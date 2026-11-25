/*
 * Grammar: an item is a list row, or a case when outlined (G1, 2px). Muted: a light tone frame inside the
 * border, never under the text (Rule A). Interactive (G3): frameless rows invert to ink, framed rows thicken
 * their line by 1px inside. Media is a square case. Nothing here moves on its own: no entrance, no press.
 * Pass `interactive` for a row that is clicked (put the row in an <a href="#"> or a button in demos).
 */
import * as React from "react"
import { cn } from "cn"

import {
  Item as ShadcnItem,
  ItemActions as ShadcnItemActions,
  ItemContent,
  ItemDescription as ShadcnItemDescription,
  ItemFooter,
  ItemGroup as ShadcnItemGroup,
  ItemHeader,
  ItemMedia as ShadcnItemMedia,
  ItemSeparator as ShadcnItemSeparator,
  ItemTitle as ShadcnItemTitle,
} from "@/components/ui/item"

type ItemProps = React.ComponentProps<typeof ShadcnItem> & {
  /** G3 hover: a frameless row inverts, a framed or muted row thickens its line. */
  interactive?: boolean
}

const frame = "rounded-(--radius) border-2 text-foreground transition-none focus-visible:ring-0 [a]:transition-none [a]:hover:bg-transparent"

const variantLook = {
  default: "border-transparent bg-transparent",
  outline: "border-border bg-background",
  // A fine line on paper, and a 6px tone band on the start edge, outside the text. No inner tone frame,
  // so it never reads as disabled (Rule B).
  muted: "relative border-border border-[length:var(--mg-bw-fine)] bg-background before:absolute before:inset-y-0 before:start-0 before:w-1.5 before:tone-35 before:content-['']",
} as const

const hoverLook = {
  default: "hover:bg-foreground hover:text-background",
  outline: "hover:shadow-[inset_0_0_0_1px_var(--border)]",
  muted: "hover:shadow-[inset_0_0_0_1px_var(--border)]",
} as const

function Item({ className, variant = "default", size = "default", interactive = false, ...props }: ItemProps) {
  return (
    <ShadcnItem
      data-manga="item"
      variant={variant}
      size={size}
      className={cn(frame, variantLook[variant ?? "default"], interactive ? hoverLook[variant ?? "default"] : "", className)}
      {...props}
    />
  )
}

function ItemGroup({ className, ...props }: React.ComponentProps<typeof ShadcnItemGroup>) {
  return <ShadcnItemGroup data-manga="item-group" className={cn("gap-2", className)} {...props} />
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnItemSeparator>) {
  return (
    <ShadcnItemSeparator
      data-manga="item-separator"
      className={cn("my-1 h-[length:var(--mg-bw-fine)] bg-border", className)}
      {...props}
    />
  )
}

/** A square case for an icon or a cover: 2px ink frame, paper inside. */
function ItemMedia({ className, ...props }: React.ComponentProps<typeof ShadcnItemMedia>) {
  return (
    <ShadcnItemMedia
      data-manga="item-media"
      className={cn(
        "size-10 rounded-(--radius) border-2 border-border bg-background text-foreground [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  )
}

/** Title in lettering, on paper. */
function ItemTitle({ className, ...props }: React.ComponentProps<typeof ShadcnItemTitle>) {
  return (
    <ShadcnItemTitle
      data-manga="item-title"
      className={cn("font-letter text-lg leading-tight font-normal tracking-wide text-current uppercase", className)}
      {...props}
    />
  )
}

/** Reads with the row: it takes the row's colour, so it inverts with it. */
function ItemDescription({ className, ...props }: React.ComponentProps<typeof ShadcnItemDescription>) {
  return (
    <ShadcnItemDescription
      data-manga="item-description"
      className={cn("text-sm leading-normal font-normal text-current", className)}
      {...props}
    />
  )
}

/** Actions sit at the end of the row. */
function ItemActions({ className, ...props }: React.ComponentProps<typeof ShadcnItemActions>) {
  return <ShadcnItemActions data-manga="item-actions" className={cn("gap-2 text-current", className)} {...props} />
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
