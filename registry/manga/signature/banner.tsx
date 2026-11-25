import * as React from "react"
import { cn } from "cn"

export type BannerProps = React.ComponentProps<"div"> & {
  /** ink: ink ribbon, paper text · paper: paper ribbon, ink line · accent: accent ribbon */
  variant?: "ink" | "paper" | "accent"
  /** Ribbon ends: notched (a swallowtail) or straight. */
  ends?: "notched" | "straight"
  /** Speed lines run out from both ends of the ribbon (around it, never under the text). */
  lines?: boolean
}

/*
 * A title ribbon for announcements and section heads. The text sits on the flat of the ribbon (rule A);
 * the optional speed lines live outside it.
 */
function Banner({ variant = "ink", ends = "notched", lines = false, className, children, ...props }: BannerProps) {
  const notch = ends === "notched"
  return (
    <div data-manga="banner" data-variant={variant} className={cn("relative isolate mx-auto flex w-fit max-w-full items-center justify-center animate-pop", className)} {...props}>
      {lines && (
        <span
          aria-hidden
          className="absolute inset-y-1 -inset-x-10 -z-10 [background-image:repeating-linear-gradient(to_bottom,var(--foreground)_0_2px,#0000_2px_7px)] [mask:linear-gradient(90deg,#000_0_2.5rem,#0000_2.5rem_calc(100%-2.5rem),#000_calc(100%-2.5rem))]"
        />
      )}
      <div
        className={cn(
          "relative px-10 py-2 font-letter text-xl tracking-wide uppercase",
          variant === "ink" && "bg-foreground text-background",
          variant === "accent" && "bg-destructive text-primary-foreground",
          variant === "paper" && "bg-background text-foreground",
          notch && "[clip-path:polygon(0_0,100%_0,calc(100%-1rem)_50%,100%_100%,0_100%,1rem_50%)]",
        )}
      >
        {variant === "paper" && (
          <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <polygon
              points={notch ? "0,0 100,0 96,50 100,100 0,100 4,50" : "0,0 100,0 100,100 0,100"}
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        <span className="relative">{children}</span>
      </div>
    </div>
  )
}

export { Banner }
