import * as React from "react"
import { cn } from "cn"

import {
  Empty as ShadcnEmpty,
  EmptyContent,
  EmptyDescription as ShadcnEmptyDescription,
  EmptyHeader,
  EmptyMedia as ShadcnEmptyMedia,
  EmptyTitle as ShadcnEmptyTitle,
} from "@/components/ui/empty"

/*
 * An empty panel: a 2px case without shadow (G1 inside a page), solid line — dashes mean "disabled" in this
 * kit. The media slot is an ink frame; with no media, an ellipsis mark (G8) is drawn instead.
 */
function Empty({ className, ...props }: React.ComponentProps<typeof ShadcnEmpty>) {
  return <ShadcnEmpty data-manga="empty" className={cn("rounded-none border-[length:var(--mg-bw)] border-solid border-border bg-background p-8", className)} {...props} />
}

function EmptyMedia({ className, ...props }: React.ComponentProps<typeof ShadcnEmptyMedia>) {
  return (
    <ShadcnEmptyMedia
      className={cn(
        "data-[variant=icon]:size-12 data-[variant=icon]:rounded-none data-[variant=icon]:border-[length:var(--mg-bw)] data-[variant=icon]:border-border data-[variant=icon]:bg-background data-[variant=icon]:[&_svg]:size-6!",
        className,
      )}
      {...props}
    />
  )
}

/** The default mark of an empty state: a heavy ellipsis that pops in. */
function EmptyMark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-manga="empty-mark" className={cn("mb-1 inline-block animate-pop font-sfx text-5xl leading-none", className)} {...props}>
      …
    </span>
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<typeof ShadcnEmptyTitle>) {
  return <ShadcnEmptyTitle className={cn("font-letter text-2xl font-normal tracking-wide uppercase", className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<typeof ShadcnEmptyDescription>) {
  return <ShadcnEmptyDescription className={cn("text-base text-foreground [&>a]:decoration-2 [&>a:hover]:decoration-4", className)} {...props} />
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMark, EmptyMedia, EmptyTitle }
