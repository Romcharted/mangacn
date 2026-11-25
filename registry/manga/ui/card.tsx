"use client"

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
  // the slant is drawn by <TiltedFrame> (SVG frame + tone shadow); the content stays upright
  tilted: "isolate border-0 bg-transparent pb-8",
  // wide empty centre; the title sits on a paper plate
  splash: "border-0 bg-transparent px-2 focus-lines [--focus-hole:56%_60%] **:data-[slot=card-title]:on-tone **:data-[slot=card-footer]:border-t-0",
  beta: "border-ink-panel bg-primary text-primary-foreground tone-shadow [--tone-paper:var(--primary)] **:data-[slot=card-description]:text-primary-foreground",
}

const SLANT = 18

/** Slanted-bottom panel drawn at the real size: tone shadow first, then the paper frame on top. */
function TiltedFrame() {
  const ref = React.useRef<SVGSVGElement>(null)
  const [size, setSize] = React.useState({ w: 0, h: 0 })
  const id = React.useId()
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { w, h } = size
  const b = 1.5
  const frame = (dx: number, dy: number) =>
    `M${b + dx} ${b + dy}H${w - b + dx}V${h - b - SLANT + dy}L${b + dx} ${h - b + dy}Z`
  return (
    <svg ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full overflow-visible">
      {w > 0 && (
        <>
          <defs>
            <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.4" style={{ fill: "var(--foreground)" }} />
              <circle cx="4.5" cy="4.5" r="1.4" style={{ fill: "var(--foreground)" }} />
            </pattern>
          </defs>
          <path d={frame(6, 6)} fill={`url(#${id})`} />
          <path d={frame(0, 0)} style={{ fill: "var(--card)", stroke: "var(--border)", strokeWidth: 3, strokeLinejoin: "miter" }} />
        </>
      )}
    </svg>
  )
}

function Card({ variant = "default", interactive = false, selected = false, className, children, ...props }: CardProps) {
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
    >
      {variant === "tilted" && <TiltedFrame />}
      {children}
    </ShadcnCard>
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
