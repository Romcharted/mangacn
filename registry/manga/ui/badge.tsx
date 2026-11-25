import * as React from "react"
import { cn } from "cn"

import { Badge as ShadcnBadge } from "@/components/ui/badge"

type ShadcnProps = React.ComponentProps<typeof ShadcnBadge>

const VARIANTS = {
  default: "default",
  outline: "outline",
  tone: "outline",
  destructive: "destructive",
  burst: "default",
  stamp: "outline",
} as const

export type BadgeVariant = keyof typeof VARIANTS

export type BadgeProps = Omit<ShadcnProps, "variant"> & {
  /** default: ink flat · outline · tone: screentone tab at the start · destructive: accent flat · burst: "NEW!" star · stamp: tilted accent stamp */
  variant?: BadgeVariant
  /** Adds a small square status dot before the label. */
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  default: "border-primary bg-primary text-primary-foreground [a]:hover:bg-primary [a]:hover:underline",
  outline: "border-border bg-background text-foreground [a]:hover:bg-background [a]:hover:text-foreground [a]:hover:underline",
  // the tone is a small tab at the start; the label stays on paper
  tone: "isolate border-border bg-background ps-4 text-foreground before:absolute before:inset-y-0 before:start-0 before:-z-10 before:w-2 before:border-e-[length:var(--mg-bw-fine)] before:border-border before:tone-50 before:content-[''] [a]:hover:bg-background [a]:hover:underline",
  // under 32px a serrated edge eats the label: badges get a clean accent flat
  // G8 error: a "!" mark before the label
  destructive: "before:content-['!'] before:font-sfx before:-me-0.5 border-destructive bg-destructive text-primary-foreground dark:bg-destructive [a]:hover:bg-destructive [a]:hover:underline",
  burst: [
    // G8 "new": a burst, popping in (G5)
    "isolate my-2 overflow-visible border-transparent bg-transparent px-3 text-primary-foreground animate-pop [a]:hover:bg-transparent",
    "before:absolute before:-inset-x-2.5 before:-inset-y-3 before:-z-10 before:bg-primary before:content-[''] before:shape-burst",
  ].join(" "),
  stamp: [
    "animate-pop -rotate-6 rtl:rotate-6 border-destructive bg-transparent px-2.5 font-sfx text-xs tracking-[0.15em] text-destructive",
    "shadow-[inset_0_0_0_2px_var(--background),inset_0_0_0_3px_var(--destructive)] [a]:hover:bg-transparent [a]:hover:text-destructive",
  ].join(" "),
}

function Badge({ variant = "default", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <ShadcnBadge
      data-manga="badge"
      data-variant={variant}
      variant={VARIANTS[variant]}
      className={cn(
        "relative h-6 gap-1.5 rounded-(--radius) border-[length:var(--mg-bw)] px-2 font-letter text-sm tracking-wide uppercase transition-none",
        "focus-visible:ring-0 focus-ink aria-invalid:ring-0",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className="size-2 shrink-0 bg-current" />}
      {children}
    </ShadcnBadge>
  )
}

export { Badge }
