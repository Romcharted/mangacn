import * as React from "react"
import { cn } from "cn"

import { Switch as ShadcnSwitch } from "@/components/ui/switch"

export type SwitchProps = React.ComponentProps<typeof ShadcnSwitch>


// Off: toned track. On: ink flat. Both libraries set role="switch" + aria-checked.
function Switch({ className, ...props }: SwitchProps) {
  return (
    <ShadcnSwitch
      data-manga="switch"
      className={cn(
        "h-6 w-[38px] rounded-[calc(var(--radius)*0.6)] border-[length:var(--mg-bw)] border-border px-0.5 shadow-none transition-none",
        "bg-background! tone-20 hover:tone-35 aria-checked:bg-primary! aria-checked:bg-none",
        "active:animate-impact focus-visible:border-border focus-visible:ring-0 focus-ink",
        "[&_[data-slot=switch-thumb]]:size-4 [&_[data-slot=switch-thumb]]:rounded-[calc(var(--radius)*0.6)] [&_[data-slot=switch-thumb]]:bg-background! [&_[data-slot=switch-thumb]]:border-[length:var(--mg-bw)] [&_[data-slot=switch-thumb]]:border-border [&_[data-slot=switch-thumb]]:transition-none [&_[data-slot=switch-thumb]]:shadow-none",
        "data-disabled:opacity-100 disabled:opacity-100 aria-disabled:opacity-100 group-has-disabled/field:opacity-100 data-disabled:border-dashed data-disabled:tone-10 data-disabled:aria-checked:bg-background! data-disabled:aria-checked:tone-10",
        "aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:[--tone-ink:var(--destructive)]",
        className,
      )}
      {...props}
    />
  )
}

export { Switch }
