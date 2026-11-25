import * as React from "react"
import { cn } from "cn"

import {
  Card as ShadcnCard,
  CardAction as ShadcnCardAction,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from "@/components/ui/card"

export type CardVariant = "default" | "bleed" | "tilted" | "splash" | "beta"

export type CardProps = React.ComponentProps<typeof ShadcnCard> & {
  /** default: 3px panel + tone shadow · bleed: first image runs to the edges · tilted: slanted panel · splash: no frame, focus lines · beta: ink flat */
  variant?: CardVariant
  /** Hover lifts the panel and lengthens its tone shadow. */
  interactive?: boolean
  /** Marks the card as chosen: a double ink frame. */
  selected?: boolean
}

const variants: Record<CardVariant, string> = {
  default: "border-ink-panel bg-card tone-shadow",
  bleed:
    "border-ink-panel bg-card tone-shadow pt-0 *:[img:first-child]:w-full *:[img:first-child]:rounded-(--radius) *:[img:first-child]:border-b-[length:var(--mg-bw-panel)] *:[img:first-child]:border-border",
  tilted: "border-ink-panel bg-card tone-shadow -rotate-1 rtl:rotate-1",
  splash: "border-0 bg-transparent focus-lines [--focus-hole:46%_50%]",
  beta: "border-ink-panel bg-primary text-primary-foreground tone-shadow [--tone-paper:var(--primary)] **:data-[slot=card-description]:text-primary-foreground",
}

function Card({ variant = "default", interactive = false, selected = false, className, ...props }: CardProps) {
  return (
    <ShadcnCard
      data-manga="card"
      data-variant={variant}
      data-selected={selected || undefined}
      className={cn(
        "relative gap-4 overflow-visible rounded-(--radius) py-5 text-base shadow-none ring-0 [--card-spacing:--spacing(5)]",
        variants[variant],
        interactive &&
          "cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:[--shadow-x:10px] hover:[--shadow-y:10px] active:translate-0 active:animate-impact",
        selected && "shadow-[0_0_0_3px_var(--background),0_0_0_6px_var(--foreground)]",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof ShadcnCardHeader>) {
  return <ShadcnCardHeader className={cn("rounded-t-(--radius)", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof ShadcnCardTitle>) {
  return (
    <ShadcnCardTitle
      className={cn("font-letter text-2xl leading-none font-normal tracking-wide uppercase", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof ShadcnCardDescription>) {
  return <ShadcnCardDescription className={cn("text-base text-foreground", className)} {...props} />
}

function CardAction(props: React.ComponentProps<typeof ShadcnCardAction>) {
  return <ShadcnCardAction {...props} />
}

function CardContent(props: React.ComponentProps<typeof ShadcnCardContent>) {
  return <ShadcnCardContent {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof ShadcnCardFooter>) {
  return (
    <ShadcnCardFooter
      className={cn(
        "gap-2 rounded-t-none rounded-b-(--radius) border-t-[length:var(--mg-bw)] border-border bg-transparent py-3 group-data-[variant=beta]/card:border-primary-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
