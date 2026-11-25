import * as React from "react"
import { cn } from "cn"

import { Bubble as ShadcnBubble, BubbleContent as ShadcnBubbleContent, BubbleGroup, BubbleReactions as ShadcnBubbleReactions } from "@/components/ui/bubble"

/*
 * Chat bubbles drawn as speech bubbles (G6): round, 2px ink line, a tail at the bottom pointing at the
 * speaker. Only the last bubble of a group keeps its tail. New bubbles pop in (G5).
 *   default      ink bubble, paper text (your own messages)
 *   secondary, muted, outline, tinted   paper bubble, ink line
 *   ghost        no bubble
 *   destructive  accent line and a "!" mark (G8)
 */
function Bubble({ className, ...props }: React.ComponentProps<typeof ShadcnBubble>) {
  return (
    <ShadcnBubble
      data-manga="bubble"
      className={cn(
        "animate-pop",
        "*:data-[slot=bubble-content]:bg-background! *:data-[slot=bubble-content]:text-foreground! *:data-[slot=bubble-content]:[--tail:var(--background)]",
        "data-[variant=default]:*:data-[slot=bubble-content]:bg-primary! data-[variant=default]:*:data-[slot=bubble-content]:text-primary-foreground! data-[variant=default]:*:data-[slot=bubble-content]:[--tail:var(--primary)]",
        "data-[variant=destructive]:*:data-[slot=bubble-content]:border-destructive! data-[variant=destructive]:*:data-[slot=bubble-content]:[--line:var(--destructive)]",
        "data-[variant=ghost]:*:data-[slot=bubble-content]:border-transparent! data-[variant=ghost]:*:data-[slot=bubble-content]:before:hidden data-[variant=ghost]:*:data-[slot=bubble-content]:after:hidden",
        // only the last bubble of a group points at the speaker
        "not-last:*:data-[slot=bubble-content]:before:hidden not-last:*:data-[slot=bubble-content]:after:hidden",
        className,
      )}
      {...props}
    />
  )
}

function BubbleContent({ className, ...props }: React.ComponentProps<typeof ShadcnBubbleContent>) {
  return (
    <ShadcnBubbleContent
      className={cn(
        "relative overflow-visible rounded-[1.25rem] border-[length:var(--mg-bw)] border-(--line,var(--border)) px-4 py-2 text-base leading-snug",
        "[button,a]:hover-thicken [button,a]:focus-visible:ring-0 [button,a]:focus-ink",
        // the tail: an ink wedge, and a smaller paper (or ink) wedge over it that hides the line
        "before:absolute before:-bottom-[11px] before:start-4 before:h-3 before:w-3.5 before:bg-(--line,var(--border)) before:[clip-path:polygon(0_0,100%_0,10%_100%)] before:content-['']",
        "after:absolute after:-bottom-[7px] after:start-[18px] after:h-2.5 after:w-2.5 after:bg-(--tail) after:[clip-path:polygon(0_0,100%_0,8%_100%)] after:content-['']",
        "group-data-[align=end]/bubble:before:start-auto group-data-[align=end]/bubble:before:end-4 group-data-[align=end]/bubble:before:[clip-path:polygon(0_0,100%_0,90%_100%)]",
        "group-data-[align=end]/bubble:after:start-auto group-data-[align=end]/bubble:after:end-[18px] group-data-[align=end]/bubble:after:[clip-path:polygon(0_0,100%_0,92%_100%)]",
        "group-data-[align=end]/message:before:start-auto group-data-[align=end]/message:before:end-4 group-data-[align=end]/message:before:[clip-path:polygon(0_0,100%_0,90%_100%)]",
        "group-data-[align=end]/message:after:start-auto group-data-[align=end]/message:after:end-[18px] group-data-[align=end]/message:after:[clip-path:polygon(0_0,100%_0,92%_100%)]",
        "group-data-[variant=destructive]/bubble:ps-9 group-data-[variant=destructive]/bubble:[background-image:linear-gradient(var(--destructive),var(--destructive))] group-data-[variant=destructive]/bubble:bg-[length:3px_0.8rem] group-data-[variant=destructive]/bubble:bg-[position:1rem_0.7rem] group-data-[variant=destructive]/bubble:bg-no-repeat",
        className,
      )}
      {...props}
    />
  )
}

function BubbleReactions({ className, ...props }: React.ComponentProps<typeof ShadcnBubbleReactions>) {
  return (
    <ShadcnBubbleReactions
      className={cn("rounded-none border-[length:var(--mg-bw)] border-border bg-background px-1.5 font-letter text-sm ring-0", className)}
      {...props}
    />
  )
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions }
