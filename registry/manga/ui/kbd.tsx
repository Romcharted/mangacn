/*
 * Grammar: a key cap drawn in ink. A 2px frame with a heavier 3px bottom edge, like a pressed key; paper
 * inside, lettering inside. No tone (Rule C: under 24px). A key is not interactive, so no hover, press or
 * focus gesture applies.
 */
import * as React from "react"
import { cn } from "cn"

import { Kbd as ShadcnKbd, KbdGroup as ShadcnKbdGroup } from "@/components/ui/kbd"

function Kbd({ className, ...props }: React.ComponentProps<typeof ShadcnKbd>) {
  return (
    <ShadcnKbd
      data-manga="kbd"
      className={cn(
        "h-6 min-w-6 gap-1 rounded-(--radius) border-2 border-b-[3px] border-border bg-background px-1.5 font-letter! text-sm leading-none font-normal tracking-wide text-foreground uppercase shadow-none",
        "[&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<typeof ShadcnKbdGroup>) {
  return <ShadcnKbdGroup data-manga="kbd-group" className={cn("gap-1.5", className)} {...props} />
}

export { Kbd, KbdGroup }
