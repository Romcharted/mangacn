import * as React from "react"
import { cn } from "cn"

import { Label as ShadcnLabel } from "@/components/ui/label"

export type LabelProps = React.ComponentProps<typeof ShadcnLabel> & {
  /** Adds an ink asterisk after the text (the field itself should still set required). */
  required?: boolean
}

// Lettering face, uppercase. Disabled fields keep their label readable (no fading) with a not-allowed cursor.
function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <ShadcnLabel
      data-manga="label"
      className={cn(
        "font-letter text-base leading-none font-normal tracking-wide uppercase",
        "peer-disabled:opacity-100 group-data-[disabled=true]:opacity-100 peer-disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="font-sfx text-sm leading-none">
          *
        </span>
      )}
    </ShadcnLabel>
  )
}

export { Label }
