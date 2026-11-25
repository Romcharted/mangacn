import * as React from "react"
import { cn } from "cn"

export type StampProps = React.ComponentProps<"span"> & {
  /** Tilt in degrees. */
  rotate?: number
  /** horizontal text, or a vertical seal (top to bottom) */
  orientation?: "horizontal" | "vertical"
  /** Lands with a thump (G5 pop) when it appears. Off with reduced motion. */
  animated?: boolean
}

/*
 * A seal in the accent colour: double square frame (only bubbles are round), heavy lettering, the ink a
 * little uneven (a mask of tiny gaps). Readable: the gaps never cover more than a few percent.
 */
function Stamp({ rotate = -8, orientation = "horizontal", animated = true, className, style, ...props }: StampProps) {
  return (
    <span
      data-manga="stamp"
      data-orientation={orientation}
      className={cn(
        "inline-block border-[3px] border-destructive px-3 py-1.5 font-sfx text-xl leading-none tracking-[0.12em] text-destructive uppercase",
        "shadow-[inset_0_0_0_2px_var(--background),inset_0_0_0_4px_var(--destructive)]",
        "[mask:radial-gradient(circle_at_30%_40%,#0000_0.6px,#000_1.2px)_0_0/7px_9px,linear-gradient(#000_0_0)] [mask-composite:intersect]",
        orientation === "vertical" && "px-1.5 py-3 [writing-mode:vertical-rl] [text-orientation:upright]",
        animated && "animate-[mg-stamp_249ms_step-end_backwards]",
        className,
      )}
      style={{ rotate: `${rotate}deg`, ...style }}
      {...props}
    />
  )
}

export { Stamp }
