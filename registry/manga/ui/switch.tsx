import * as React from "react"
import { cn } from "cn"

import { Switch as ShadcnSwitch } from "@/components/ui/switch"

export type SwitchProps = React.ComponentProps<typeof ShadcnSwitch>

// 44 × 24 px. Off: paper track, ink thumb. On: ink track, paper thumb. Disabled: dashed.
// No screentone at this size (rule C). Both libraries set role="switch" + aria-checked.
function Switch({ className, ...props }: SwitchProps) {
  return (
    <ShadcnSwitch
      data-manga="switch"
      className={cn(
        "h-6! w-11! shrink-0 rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background! px-0.5 shadow-none transition-none",
        "aria-checked:bg-primary! aria-checked:border-primary",
        "hover:border-[3px] hover:px-[1px] active:translate-y-0.5",
        "focus-visible:border-border focus-visible:ring-0 focus-ink",
        "[&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:rounded-[calc(var(--radius)*0.6)] [&_[data-slot=switch-thumb]]:shadow-none [&_[data-slot=switch-thumb]]:transition-none",
        "[&_[data-slot=switch-thumb]]:bg-foreground! [&_[data-slot=switch-thumb]]:translate-x-0!",
        "aria-checked:[&_[data-slot=switch-thumb]]:bg-background! aria-checked:[&_[data-slot=switch-thumb]]:translate-x-5! rtl:aria-checked:[&_[data-slot=switch-thumb]]:-translate-x-5!",
        "data-disabled:opacity-100 disabled:opacity-100 aria-disabled:opacity-100 group-has-disabled/field:opacity-100 data-disabled:cursor-not-allowed",
        "data-disabled:border-dashed data-disabled:bg-background! data-disabled:aria-checked:bg-background! data-disabled:border-border data-disabled:hover:border-[length:var(--mg-bw)] data-disabled:hover:px-0.5",
        "data-disabled:[&_[data-slot=switch-thumb]]:bg-background! data-disabled:[&_[data-slot=switch-thumb]]:border-[length:var(--mg-bw)] data-disabled:[&_[data-slot=switch-thumb]]:border-dashed data-disabled:[&_[data-slot=switch-thumb]]:border-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-0",
        className,
      )}
      {...props}
    />
  )
}

export { Switch }
