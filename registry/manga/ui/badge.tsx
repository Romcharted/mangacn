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
  /** default: ink flat · outline · tone · destructive: red, jagged · burst: "NEW!" star · stamp: tilted red stamp */
  variant?: BadgeVariant
  /** Adds a small square status dot before the label. */
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  default: "border-primary bg-primary text-primary-foreground [a]:hover:bg-primary [a]:hover:speed-lines [--tone-paper:var(--primary)]",
  outline: "border-border bg-background text-foreground [a]:hover:bg-background [a]:hover:text-foreground [a]:hover:tone-20",
  tone: "border-border bg-background text-foreground tone-20 [a]:hover:bg-background [a]:hover:tone-35",
  destructive: [
    "isolate border-transparent bg-transparent text-primary-foreground dark:bg-transparent [a]:hover:bg-transparent [--jag:3px]",
    "before:absolute before:inset-0 before:-z-10 before:bg-destructive before:content-[''] before:edge-jagged",
  ].join(" "),
  burst: [
    "isolate my-2 overflow-visible border-transparent bg-transparent px-3 text-primary-foreground [a]:hover:bg-transparent",
    "before:absolute before:-inset-x-2.5 before:-inset-y-3 before:-z-10 before:bg-primary before:content-[''] before:shape-burst",
  ].join(" "),
  stamp: [
    "-rotate-6 rtl:rotate-6 border-destructive bg-transparent px-2.5 font-sfx text-xs tracking-[0.15em] text-destructive",
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
