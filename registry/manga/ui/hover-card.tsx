"use client"

import * as React from "react"
import { cn } from "cn"

import { HoverCard, HoverCardContent as ShadcnHoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { BubbleTail } from "@/lib/manga/gestures"

/** G6: a speech bubble with a tail toward the trigger, popping in (G5). Same drawing as Popover. */
function HoverCardContent({ className, children, sideOffset = 16, align = "start", ...props }: React.ComponentProps<typeof ShadcnHoverCardContent>) {
  return (
    <ShadcnHoverCardContent
      data-manga="hover-card"
      sideOffset={sideOffset}
      align={align}
      className={cn(
        "relative overflow-visible rounded-[1.4rem] border-[length:var(--mg-bw-panel)] border-border bg-popover px-4 py-3 text-base text-popover-foreground shadow-none ring-0",
        "duration-0 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none",
        className,
      )}
      {...props}
    >
      {children}
      <BubbleTail weight={3} />
    </ShadcnHoverCardContent>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
