"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Popover,
  PopoverContent as ShadcnPopoverContent,
  PopoverDescription as ShadcnPopoverDescription,
  PopoverHeader,
  PopoverTitle as ShadcnPopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BubbleTail } from "@/lib/manga/gestures"

/** G6: a speech bubble (3px line, round corners) with a tail toward the trigger; it pops in (G5). */
const bubble =
  "relative overflow-visible rounded-[1.4rem] border-[length:var(--mg-bw-panel)] border-border bg-popover px-4 py-3 text-base text-popover-foreground shadow-none ring-0 duration-0 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none"

// align="start" by default: the bubble grows from its trigger instead of overflowing on both sides.
function PopoverContent({ className, children, sideOffset = 16, align = "start", ...props }: React.ComponentProps<typeof ShadcnPopoverContent>) {
  return (
    <ShadcnPopoverContent data-manga="popover" sideOffset={sideOffset} align={align} className={cn(bubble, className)} {...props}>
      {children}
      <BubbleTail weight={3} />
    </ShadcnPopoverContent>
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof ShadcnPopoverTitle>) {
  return <ShadcnPopoverTitle className={cn("font-letter text-lg leading-tight font-normal tracking-wide uppercase", className)} {...props} />
}

function PopoverDescription({ className, ...props }: React.ComponentProps<typeof ShadcnPopoverDescription>) {
  return <ShadcnPopoverDescription className={cn("text-foreground", className)} {...props} />
}

/** A static popover bubble (no trigger, no portal) for previews and state grids. Put plain elements inside: PopoverTitle and PopoverDescription need a live Popover. */
function PopoverBubble({ side = "bottom", className, children, ...props }: React.ComponentProps<"div"> & { side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <div data-manga="popover" data-side={side} className={cn(bubble, "inline-flex w-72 flex-col gap-2.5", className)} {...props}>
      {children}
      <BubbleTail weight={3} />
    </div>
  )
}

export { Popover, PopoverBubble, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger }
