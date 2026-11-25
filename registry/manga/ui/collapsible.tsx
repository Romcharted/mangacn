import * as React from "react"
import { cn } from "cn"

import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent as ShadcnCollapsibleContent,
  CollapsibleTrigger as ShadcnCollapsibleTrigger,
} from "@/components/ui/collapsible"

/*
 * Grammar: the trigger is a frameless lettering row. Hover thickens the underline (G3, frameless); its brush
 * chevron turns in two steps when open (G8). The content unfolds with a drop-in (G5). No frame of its own:
 * a case (G1) is added by the caller if wanted. Disabled: a dashed underline and not-allowed cursor, label on paper.
 */

function Collapsible({ className, ...props }: React.ComponentProps<typeof ShadcnCollapsible>) {
  return <ShadcnCollapsible data-manga="collapsible" className={cn("w-full", className)} {...props} />
}

function CollapsibleTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnCollapsibleTrigger>) {
  return (
    <ShadcnCollapsibleTrigger
      data-manga="collapsible-trigger"
      className={cn(
        "flex w-full items-center gap-3 border-0 bg-transparent p-0 text-start font-letter text-lg tracking-wide text-foreground uppercase transition-none",
        "decoration-transparent decoration-2 underline underline-offset-4",
        "[&:hover:not([data-disabled])]:decoration-current [&:hover:not([data-disabled])]:decoration-4",
        "data-[disabled]:decoration-dashed data-[disabled]:decoration-current data-[disabled]:cursor-not-allowed",
        "after:mark-chevron after:ms-auto after:shrink-0 after:text-base",
        "aria-expanded:after:rotate-180 aria-expanded:after:animate-chevron",
        "focus-ink disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  )
}

function CollapsibleContent({ className, children, ...props }: React.ComponentProps<typeof ShadcnCollapsibleContent>) {
  return (
    <ShadcnCollapsibleContent
      data-manga="collapsible-content"
      className={cn("pt-3 text-base", className)}
      {...props}
    >
      <div className="animate-drop-in">{children}</div>
    </ShadcnCollapsibleContent>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
