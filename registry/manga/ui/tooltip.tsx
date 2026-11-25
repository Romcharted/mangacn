import * as React from "react"
import { cn } from "cn"

import {
  Tooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type TooltipVariant = "speech" | "thought"

export type TooltipContentProps = React.ComponentProps<typeof ShadcnTooltipContent> & {
  /** speech: small bubble with an ink tail · thought: cloud bubble with two trailing circles */
  variant?: TooltipVariant
}

const thought = [
  "[&>:last-child]:hidden",
  "before:absolute before:size-1.5 before:rounded-full before:border-2 before:border-border before:bg-background before:content-['']",
  "after:absolute after:size-3 after:rounded-full after:border-2 after:border-border after:bg-background after:content-['']",
  "before:start-3 after:start-5",
  "data-[side=top]:after:-bottom-4 data-[side=top]:before:-bottom-7",
  "data-[side=bottom]:after:-top-4 data-[side=bottom]:before:-top-7",
  "data-[side=left]:after:-right-4 data-[side=left]:before:-right-7 data-[side=left]:before:top-1/2 data-[side=left]:after:top-1",
  "data-[side=right]:after:-left-4 data-[side=right]:before:-left-7 data-[side=right]:before:top-1/2 data-[side=right]:after:top-1",
].join(" ")

/** A mini speech bubble. Pops in over two frames. */
function TooltipContent({ variant = "speech", className, ...props }: TooltipContentProps) {
  return (
    <ShadcnTooltipContent
      data-manga="tooltip"
      data-variant={variant}
      className={cn(
        "relative rounded-[1.1rem] border-[length:var(--mg-bw)] border-border bg-background px-3 py-1 font-letter text-base text-foreground",
        "duration-0 data-open:animate-pop data-[state=delayed-open]:animate-pop data-[state=instant-open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none",
        variant === "thought" && thought,
        className,
      )}
      {...props}
    />
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
