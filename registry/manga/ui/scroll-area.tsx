import * as React from "react"
import { cn } from "cn"

import {
  ScrollArea as ShadcnScrollArea,
  ScrollBar as ShadcnScrollBar,
} from "@/components/ui/scroll-area"

/*
 * Grammar: the thumb is a flat of ink inset in a fine ink track (a 1px line on the start edge). No rounded
 * pill, no opacity, a square corner. Keyboard and wheel behaviour stay stock. The focus ring of the viewport
 * is an ink line inside the area, not a 50 % ring.
 */

function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ShadcnScrollArea>) {
  return (
    <ShadcnScrollArea
      data-manga="scroll-area"
      className={cn(
        "[&_[data-slot=scroll-area-viewport]]:focus-visible:ring-0! [&_[data-slot=scroll-area-viewport]]:focus-visible:outline-2! [&_[data-slot=scroll-area-viewport]]:focus-visible:-outline-offset-[2px]! [&_[data-slot=scroll-area-viewport]]:focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
    </ShadcnScrollArea>
  )
}

function ScrollBar({ className, ...props }: React.ComponentProps<typeof ShadcnScrollBar>) {
  return (
    <ShadcnScrollBar
      data-manga="scroll-bar"
      className={cn(
        "data-vertical:w-3! data-horizontal:h-3! data-vertical:border-s-border! data-horizontal:border-t-border!",
        "[&_[data-slot=scroll-area-thumb]]:m-[3px]! [&_[data-slot=scroll-area-thumb]]:rounded-none! [&_[data-slot=scroll-area-thumb]]:bg-foreground!",
        className,
      )}
      {...props}
    />
  )
}

export { ScrollArea, ScrollBar }
