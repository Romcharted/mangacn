"use client"

import * as React from "react"
import { cn } from "cn"

import { Sfx } from "@/components/manga/sfx"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Spinner } from "@/components/ui/manga/spinner"

/*
 * Loading screen. Gestures: G7 running line (a determinate bar filled with speed lines; indeterminate is the
 * turning concentration Spinner), G5 pop (the SFX lands once), concentration lines behind the plate (SpeedLines,
 * stepped, still under reduced motion). The plate is a case (G1) with the SFX and the message on paper (Rule A).
 */

export type LoadingScreenProps = React.ComponentProps<"div"> & {
  /** Onomatopoeia in the centre. Decorative. */
  sfx?: string
  /** Screen-reader text announced as the status. */
  label?: string
  /** Visible line under the SFX. */
  message?: React.ReactNode
  /** 0 to 100. Omitted = indeterminate (a turning spinner, no bar). */
  progress?: number
  /** Covers the viewport (fixed, above the page). Default false: fills its container. */
  fullscreen?: boolean
}

function LoadingScreen({
  sfx = "ドドド",
  label = "Loading",
  message,
  progress,
  fullscreen = false,
  className,
  ...props
}: LoadingScreenProps) {
  const determinate = typeof progress === "number" && Number.isFinite(progress)
  const value = determinate ? Math.min(100, Math.max(0, Math.round(progress))) : undefined

  return (
    <div
      data-manga="loading-screen"
      data-fullscreen={fullscreen || undefined}
      data-determinate={determinate || undefined}
      role="status"
      aria-live="polite"
      className={cn(fullscreen ? "fixed inset-0 z-50" : "relative size-full min-h-64", className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      <div className="absolute inset-0">
        <SpeedLines variant="focus" animated hole={0.3} density={0.7} className="size-full">
          <div className="grid h-full place-items-center p-4">
            <div className="ink-case relative grid w-full max-w-72 justify-items-center gap-3 p-5 text-center">
              <Sfx size="lg" rotate={-6} className="text-foreground">
                {sfx}
              </Sfx>
              {message && <p className="text-base leading-snug">{message}</p>}
              {determinate ? (
                <>
                  <div
                    role="progressbar"
                    aria-label={label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={value}
                    className="h-8 w-full border-ink bg-background p-0.5"
                  >
                    <div
                      className="h-full fill-lines transition-[width] duration-[333ms] ease-[steps(4)]"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm">{value}%</span>
                </>
              ) : (
                <Spinner className="size-8" />
              )}
            </div>
          </div>
        </SpeedLines>
      </div>
    </div>
  )
}

export { LoadingScreen }
