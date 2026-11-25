"use client"

import * as React from "react"
import { cn } from "cn"

import { Toggle as ShadcnToggle } from "@/components/ui/toggle"
import { ImpactLines, withImpact } from "@/lib/manga/gestures"

type ShadcnProps = React.ComponentProps<typeof ShadcnToggle>

export type ToggleVariant = "default" | "outline"
export type ToggleSize = "sm" | "default" | "lg"

export type ToggleProps = Omit<ShadcnProps, "className"> & {
  /** default: frameless, inverts on hover · outline: 2px frame, lifts its tone shadow on hover */
  variant?: ToggleVariant
  size?: ToggleSize
  className?: string
}

/*
 * Off: paper (outline) or nothing (default). On (aria-pressed / data-state=on): an ink flat that sweeps
 * in (G2). Hover (G3): default inverts, outline lifts. Click: G4 impact with speed lines. Disabled:
 * dashed line, tone frame, label on paper. Radix sets data-state=on, Base UI sets aria-pressed: both are covered.
 */
const base = [
  "group/toggle data-[impact]:animate-hit",
  "relative isolate rounded-(--radius) border-[length:var(--mg-bw)] font-letter tracking-wide uppercase text-foreground transition-none",
  "active:translate-x-0.5 active:translate-y-0.5 rtl:active:-translate-x-0.5",
  "focus-visible:ring-0 focus-visible:border-border focus-ink focus-visible:outline-solid!",
  "aria-pressed:ink-fill aria-pressed:fill-in aria-pressed:border-primary aria-pressed:bg-primary! aria-pressed:text-primary-foreground!",
  "data-[state=on]:ink-fill data-[state=on]:fill-in data-[state=on]:border-primary data-[state=on]:bg-primary! data-[state=on]:text-primary-foreground!",
  "disabled:cursor-not-allowed disabled:border-dashed disabled:border-border disabled:bg-background! disabled:text-foreground! disabled:opacity-100 disabled:tone-frame disabled:before:hidden disabled:after:hidden",
].join(" ")

const variants: Record<ToggleVariant, string> = {
  default: "border-transparent bg-transparent hover-invert hover:border-foreground hover:bg-foreground! hover:text-background!",
  outline: "border-border bg-background hover-lift hover:bg-background",
}

const sizes: Record<ToggleSize, string> = {
  sm: "h-8 min-w-8 gap-1 px-2 text-sm",
  default: "h-10 min-w-10 gap-2 px-3 text-base",
  lg: "h-12 min-w-12 gap-2 px-5 text-lg",
}

/** The manga look of a toggle, for elements that render their own (ToggleGroupItem uses it). */
function toggleClassName({ variant = "default", size = "default", className }: { variant?: ToggleVariant; size?: ToggleSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className)
}

function Toggle({ variant = "default", size = "default", className, children, onClick, ...props }: ToggleProps) {
  return (
    <ShadcnToggle
      data-manga="toggle"
      variant={variant}
      size={size}
      className={toggleClassName({ variant, size, className })}
      onClick={withImpact(onClick) as ShadcnProps["onClick"]}
      {...props}
    >
      <ImpactLines />
      {children}
    </ShadcnToggle>
  )
}

export { Toggle, toggleClassName }
