import * as React from "react"
import { cn } from "cn"

import { Slider as ShadcnSlider } from "@/components/ui/slider"

/*
 * G7: the filled part runs with speed lines inside a 2px ink rail; the thumb is an ink block with a paper
 * gap. Hover thickens the thumb's line (G3), focus draws ink / paper / ink. The data-slot names are the
 * same in the Radix and Base UI versions of shadcn.
 */
function Slider({ className, ...props }: React.ComponentProps<typeof ShadcnSlider>) {
  return (
    <ShadcnSlider
      data-manga="slider"
      className={cn(
        "py-2",
        "[&_[data-slot=slider-track]]:h-3! [&_[data-slot=slider-track]]:rounded-none [&_[data-slot=slider-track]]:border-[length:var(--mg-bw)] [&_[data-slot=slider-track]]:border-border [&_[data-slot=slider-track]]:bg-background",
        "data-[orientation=vertical]:[&_[data-slot=slider-track]]:h-auto! data-[orientation=vertical]:[&_[data-slot=slider-track]]:w-3!",
        "[&_[data-slot=slider-range]]:fill-lines",
        "[&_[data-slot=slider-thumb]]:h-6 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:rounded-none [&_[data-slot=slider-thumb]]:border-[length:var(--mg-bw)] [&_[data-slot=slider-thumb]]:border-background [&_[data-slot=slider-thumb]]:bg-foreground [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:ring-0! [&_[data-slot=slider-thumb]]:outline-2 [&_[data-slot=slider-thumb]]:outline-foreground [&_[data-slot=slider-thumb]]:outline-solid [&_[data-slot=slider-thumb]]:transition-none",
        "[&_[data-slot=slider-thumb]:hover]:outline-[3px] [&_[data-slot=slider-thumb]:focus-visible]:outline-[3px] [&_[data-slot=slider-thumb]:focus-visible]:outline-offset-2 [&_[data-slot=slider-thumb]:active]:translate-y-px",
        "data-disabled:cursor-not-allowed data-disabled:[&_*]:opacity-100 data-disabled:[&_[data-slot=slider-track]]:border-dashed data-disabled:[&_[data-slot=slider-range]]:tone-frame data-disabled:[&_[data-slot=slider-thumb]]:bg-background data-disabled:[&_[data-slot=slider-thumb]]:outline-dashed",
        className,
      )}
      {...props}
    />
  )
}

export { Slider }
