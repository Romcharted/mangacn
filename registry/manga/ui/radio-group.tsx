import * as React from "react"
import { cn } from "cn"

import { RadioGroup as ShadcnRadioGroup, RadioGroupItem as ShadcnRadioGroupItem } from "@/components/ui/radio-group"

function RadioGroup({ className, ...props }: React.ComponentProps<typeof ShadcnRadioGroup>) {
  return <ShadcnRadioGroup data-manga="radio-group" className={cn("gap-3", className)} {...props} />
}

/*
 * A diamond, not a circle: only speech bubbles are round (see AGENTS.md, special cases). Under 24px, so no
 * tone (rule C). Hover: the line thickens (G3). Checked: the ink flat sweeps in (G2) with a paper dot.
 * aria-checked is set by Radix and Base UI alike.
 */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof ShadcnRadioGroupItem>) {
  return (
    <ShadcnRadioGroupItem
      data-manga="radio"
      className={cn(
        "touch-hit m-0.5 size-4! rotate-45 rounded-none border-[length:var(--mg-bw)] border-border bg-background shadow-none transition-none dark:bg-background",
        "hover-thicken active:translate-y-px",
        "focus-visible:border-border focus-visible:ring-0 focus-ink",
        "aria-checked:border-primary aria-checked:bg-primary! aria-checked:fill-in",
        "[&_[data-slot=radio-group-indicator]>span]:size-1.5 [&_[data-slot=radio-group-indicator]>span]:rounded-none [&_[data-slot=radio-group-indicator]>span]:bg-background",
        "disabled:cursor-not-allowed disabled:opacity-100 disabled:border-dashed data-disabled:cursor-not-allowed data-disabled:opacity-100 data-disabled:border-dashed data-disabled:aria-checked:bg-background! data-disabled:[&_[data-slot=radio-group-indicator]>span]:bg-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
