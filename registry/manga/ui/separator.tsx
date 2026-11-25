import * as React from "react"
import { cn } from "cn"

import { Separator as ShadcnSeparator } from "@/components/ui/separator"

export type SeparatorProps = React.ComponentProps<typeof ShadcnSeparator> & {
  /** ink: 2px · fine: 1px · double: two lines, for a break between chapters */
  variant?: "ink" | "fine" | "double"
}

function Separator({ variant = "ink", className, ...props }: SeparatorProps) {
  return (
    <ShadcnSeparator
      data-manga="separator"
      data-variant={variant}
      className={cn(
        "bg-border",
        variant === "ink" && "data-horizontal:h-[length:var(--mg-bw)] data-vertical:w-[length:var(--mg-bw)] data-[orientation=horizontal]:h-[length:var(--mg-bw)] data-[orientation=vertical]:w-[length:var(--mg-bw)]",
        variant === "fine" && "data-horizontal:h-px data-vertical:w-px",
        variant === "double" &&
          "bg-transparent data-horizontal:h-[7px] data-horizontal:border-y-[length:var(--mg-bw)] data-vertical:w-[7px] data-vertical:border-x-[length:var(--mg-bw)] data-[orientation=horizontal]:h-[7px] data-[orientation=horizontal]:border-y-[length:var(--mg-bw)] data-[orientation=vertical]:w-[7px] data-[orientation=vertical]:border-x-[length:var(--mg-bw)] border-border",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
