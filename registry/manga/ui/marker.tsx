import * as React from "react"
import { cn } from "cn"

import {
  Marker as ShadcnMarker,
  MarkerContent as ShadcnMarkerContent,
  MarkerIcon as ShadcnMarkerIcon,
  markerVariants,
} from "@/components/ui/marker"

/*
 * A line inside a conversation ("Today", "Model switched to ...", "Context compacted"): lettering, small,
 * uppercase, ink (never grey). variant "separator": a 1px ink rule on both sides. variant "border": a 1px
 * ink rule under it. Links inside take the G3 underline hover and the focus ring.
 */

type Variant = "default" | "separator" | "border"
type Stock<T> = Omit<T, "render" | "asChild">

function Marker({
  className,
  variant = "default",
  ...props
}: Stock<React.ComponentProps<typeof ShadcnMarker>> & { variant?: Variant }) {
  return (
    <ShadcnMarker
      data-manga="marker"
      data-variant={variant}
      variant={variant}
      className={cn(
        "animate-pop font-letter text-xs tracking-wide text-foreground! uppercase",
        "before:bg-foreground! after:bg-foreground! before:h-px after:h-px",
        "[&_a]:text-foreground! [&_a]:underline-offset-4 [&_a]:focus-ink [&_a:hover]:decoration-[3px]",
        "[&_a]:hover-underline",
        "data-[variant=border]:border-b-[length:var(--mg-bw-fine)]! data-[variant=border]:border-border! data-[variant=border]:pb-2",
        className,
      )}
      {...props}
    />
  )
}

function MarkerIcon({ className, ...props }: React.ComponentProps<typeof ShadcnMarkerIcon>) {
  return <ShadcnMarkerIcon data-manga="marker-icon" className={cn("text-foreground", className)} {...props} />
}

function MarkerContent({ className, ...props }: React.ComponentProps<typeof ShadcnMarkerContent>) {
  return <ShadcnMarkerContent className={cn("text-foreground", className)} {...props} />
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
