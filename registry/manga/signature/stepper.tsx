import * as React from "react"
import { cn } from "cn"

export type StepperStep = { label: React.ReactNode; description?: React.ReactNode }

export type StepperProps = Omit<React.ComponentProps<"ol">, "children"> & {
  steps: StepperStep[]
  /** Index of the current step (0-based). Steps before it are done. */
  current: number
  orientation?: "horizontal" | "vertical"
}

/*
 * Steps as chapter marks: done = brush check (G8), current = ink flat (G2), next = paper square. The rail
 * between done steps runs with speed lines (G7). Follows the reading order (data-reading="rtl").
 */
function Stepper({ steps, current, orientation = "horizontal", className, ...props }: StepperProps) {
  const vertical = orientation === "vertical"
  return (
    <ol
      data-manga="stepper"
      data-orientation={orientation}
      className={cn("flex", vertical ? "flex-col" : "w-full items-start reading-rtl:[direction:rtl] *:[direction:ltr]", className)}
      {...props}
    >
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "next"
        const last = i === steps.length - 1
        return (
          <li
            key={i}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("relative flex gap-3", vertical ? "pb-6 last:pb-0" : "flex-1 flex-col items-center text-center")}
          >
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute",
                  vertical ? "start-[1.125rem] top-10 bottom-1 w-1.5 -translate-x-1/2" : "start-[calc(50%+1.5rem)] end-[calc(-50%+1.5rem)] top-[1.0625rem] h-1.5",
                  // done: a rail running with speed lines (G7); ahead: a fine ink line (dashes mean "disabled")
                  state === "done" ? (vertical ? "bg-foreground" : "fill-lines") : vertical ? "w-0.5! bg-foreground" : "h-0.5! translate-y-0.5 bg-foreground",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-9 shrink-0 place-items-center border-[length:var(--mg-bw)] border-border font-letter text-lg",
                state === "current" && "ink-fill fill-in",
                state === "next" && "bg-background",
                state === "done" && "bg-background",
              )}
            >
              {state === "done" ? <span aria-hidden className="mark-check text-xl" /> : i + 1}
              {state === "done" && <span className="sr-only">Done:</span>}
            </span>
            <span className={cn("grid gap-0.5", vertical ? "pt-1.5" : "px-2")}>
              <span className={cn("font-letter text-base leading-tight tracking-wide uppercase", state === "current" && "underline decoration-[3px] underline-offset-4")}>
                {s.label}
              </span>
              {s.description && <span className="text-sm">{s.description}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export { Stepper }
