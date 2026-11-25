import * as React from "react"
import { cn } from "cn"

import {
  Tooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type TooltipVariant = "speech" | "thought"
export type TooltipSide = "top" | "bottom" | "left" | "right"

/** Bubble body shared by the live tooltip and the static TooltipBubble. */
const bubble =
  "group/tt relative overflow-visible rounded-[1.1rem] border-[length:var(--mg-bw)] border-border bg-background px-3 py-1 font-letter text-base text-foreground"

/**
 * The tail, drawn like SpeechBubble's: a curved wedge whose fill hides the bubble
 * outline under it. Thought bubbles trail two circles instead. Placed from data-side,
 * which Radix and Base UI both set on the popup.
 */
function Tail({ variant }: { variant: TooltipVariant }) {
  const pos = [
    "pointer-events-none absolute",
    "group-data-[side=top]/tt:top-full group-data-[side=top]/tt:start-4 group-data-[side=top]/tt:-mt-[3px]",
    "group-data-[side=bottom]/tt:bottom-full group-data-[side=bottom]/tt:start-4 group-data-[side=bottom]/tt:-mb-[3px] group-data-[side=bottom]/tt:-scale-y-100",
    "group-data-[side=left]/tt:left-full group-data-[side=left]/tt:top-1/2 group-data-[side=left]/tt:-ml-[3px] group-data-[side=left]/tt:-translate-y-1/2 group-data-[side=left]/tt:-rotate-90",
    "group-data-[side=right]/tt:right-full group-data-[side=right]/tt:top-1/2 group-data-[side=right]/tt:-mr-[3px] group-data-[side=right]/tt:-translate-y-1/2 group-data-[side=right]/tt:rotate-90",
  ].join(" ")
  const style = { fill: "var(--background)", stroke: "var(--foreground)", strokeWidth: 2, strokeLinejoin: "round" as const }
  return variant === "speech" ? (
    <svg aria-hidden width="16" height="12" viewBox="0 0 16 12" className={cn(pos, "overflow-visible")}>
      <path d="M1 0 Q4 6 3 11 Q9 7 13 0" style={style} />
    </svg>
  ) : (
    <svg aria-hidden width="16" height="20" viewBox="0 0 16 20" className={cn(pos, "overflow-visible")}>
      <circle cx="6" cy="7" r="4" style={style} />
      <circle cx="3" cy="16" r="2.2" style={style} />
    </svg>
  )
}

export type TooltipContentProps = React.ComponentProps<typeof ShadcnTooltipContent> & {
  /** speech: small bubble with a curved tail · thought: cloud bubble with two trailing circles */
  variant?: TooltipVariant
}

/** A mini speech bubble. Pops in over two frames; the offset leaves room for the tail. */
function TooltipContent({ variant = "speech", className, children, sideOffset, ...props }: TooltipContentProps) {
  return (
    <ShadcnTooltipContent
      data-manga="tooltip"
      data-variant={variant}
      sideOffset={sideOffset ?? (variant === "thought" ? 24 : 14)}
      className={cn(
        bubble,
        // the stock arrow is appended last: hide it, our tail replaces it
        "[&>:last-child]:hidden",
        "duration-0 data-open:animate-pop data-[state=delayed-open]:animate-pop data-[state=instant-open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none",
        className,
      )}
      {...props}
    >
      {children}
      <Tail variant={variant} />
    </ShadcnTooltipContent>
  )
}

/** A static tooltip bubble (no trigger, no portal): for previews, docs and state grids. */
function TooltipBubble({
  variant = "speech",
  side = "top",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: TooltipVariant; side?: TooltipSide }) {
  return (
    <div data-manga="tooltip" data-variant={variant} data-side={side} role="tooltip" className={cn(bubble, "inline-block", className)} {...props}>
      {children}
      <Tail variant={variant} />
    </div>
  )
}

export { Tooltip, TooltipBubble, TooltipContent, TooltipProvider, TooltipTrigger }
