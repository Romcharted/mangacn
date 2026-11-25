import * as React from "react"
import { cn } from "cn"

import { Progress as ShadcnProgress } from "@/components/ui/progress"

/*
 * G7: a 2px ink rail filled with speed lines; the fill moves in steps (4 frames), never a smooth glide.
 * Only <Progress> is wrapped: the Radix version of shadcn exports nothing else (label it with aria-label
 * or a visible label + aria-labelledby). In the Radix version the root is the track.
 */
function Progress({ className, ...props }: React.ComponentProps<typeof ShadcnProgress>) {
  return (
    <ShadcnProgress
      data-manga="progress"
      className={cn(
        "[&_[data-slot=progress-track]]:h-4 [&_[data-slot=progress-track]]:rounded-none [&_[data-slot=progress-track]]:border-[length:var(--mg-bw)] [&_[data-slot=progress-track]]:border-border [&_[data-slot=progress-track]]:bg-background",
        "not-has-[[data-slot=progress-track]]:h-4 not-has-[[data-slot=progress-track]]:rounded-none not-has-[[data-slot=progress-track]]:border-[length:var(--mg-bw)] not-has-[[data-slot=progress-track]]:border-border not-has-[[data-slot=progress-track]]:bg-background",
        "[&_[data-slot=progress-indicator]]:fill-lines [&_[data-slot=progress-indicator]]:transition-[width,translate,transform] [&_[data-slot=progress-indicator]]:duration-[333ms] [&_[data-slot=progress-indicator]]:ease-[steps(4)]",
        className,
      )}
      {...props}
    />
  )
}

export { Progress }
