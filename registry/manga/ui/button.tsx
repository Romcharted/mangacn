import * as React from "react"
import { cn } from "cn"

import { Button as ShadcnButton } from "@/components/ui/button"

type ShadcnProps = React.ComponentProps<typeof ShadcnButton>

const VARIANTS = {
  default: "default",
  outline: "outline",
  tone: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive",
  shout: "default",
} as const

const SIZES = { sm: "sm", default: "default", lg: "lg", icon: "icon" } as const

export type ButtonVariant = keyof typeof VARIANTS
export type ButtonSize = keyof typeof SIZES

export type ButtonProps = Omit<ShadcnProps, "variant" | "size"> & {
  /** default: ink flat · outline · tone: screentone band · ghost · link: wavy underline · destructive: accent, jagged · shout: burst for calls to action */
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows turning focus lines, sets aria-busy and disables the button. */
  loading?: boolean
  /** Stretches the button to the full width of its container. */
  fullWidth?: boolean
}

// States: hover = the tone shadow appears · pressed = 2px offset + negative · disabled = dashed + tone frame.
// Click: a three-frame impact (negative, recoil, settle) with short speed lines on both sides.
const base = [
  "group/button data-[impact]:animate-hit",
  "relative isolate rounded-(--radius) border-[length:var(--mg-bw)] border-border font-letter tracking-wide uppercase transition-none",
  "active:not-aria-[haspopup]:translate-y-0.5 active:translate-x-0.5 rtl:active:-translate-x-0.5",
  "focus-visible:ring-0 focus-visible:border-border focus-ink",
  "disabled:opacity-100 aria-disabled:opacity-100",
  "aria-invalid:ring-0 aria-invalid:border-destructive",
].join(" ")

const hoverShadow = "hover:tone-shadow hover:[--shadow-x:4px] hover:[--shadow-y:4px] active:[--shadow-x:2px] active:[--shadow-y:2px]"

const disabledLook = [
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
  "disabled:border-dashed aria-disabled:border-dashed disabled:border-border aria-disabled:border-border",
  "disabled:bg-background! aria-disabled:bg-background! disabled:text-foreground! aria-disabled:text-foreground!",
  "disabled:tone-frame aria-disabled:tone-frame disabled:before:hidden aria-disabled:before:hidden disabled:after:hidden",
].join(" ")

const variants: Record<ButtonVariant, string> = {
  default: `border-primary bg-primary text-primary-foreground hover:bg-primary ${hoverShadow} active:bg-background! active:text-foreground!`,
  outline: `border-border bg-background text-foreground hover:bg-background hover:text-foreground dark:bg-background dark:border-border dark:hover:bg-background ${hoverShadow} active:bg-primary! active:text-primary-foreground! aria-expanded:bg-primary aria-expanded:text-primary-foreground`,
  tone: [
    "border-border bg-background text-foreground hover:bg-background hover:text-foreground dark:bg-background dark:border-border dark:hover:bg-background",
    // the tone lives on the bottom third; the label stays on paper
    "before:absolute before:inset-x-0 before:bottom-0 before:-z-10 before:h-[30%] before:border-t-[length:var(--mg-bw-fine)] before:border-border before:tone-35 before:content-['']",
    hoverShadow,
    "active:bg-primary! active:text-primary-foreground! active:before:hidden",
  ].join(" "),
  ghost:
    "border-transparent bg-transparent text-foreground hover:border-border hover:bg-transparent hover:text-foreground dark:hover:bg-transparent aria-expanded:bg-transparent active:border-primary active:bg-primary! active:text-primary-foreground!",
  link: [
    "h-auto border-transparent bg-transparent px-0.5 text-foreground underline decoration-wavy decoration-2 underline-offset-[5px]",
    "hover:bg-transparent hover:decoration-[3px] hover:underline-offset-[6px] active:bg-primary active:text-primary-foreground active:no-underline",
  ].join(" "),
  destructive: [
    "border-transparent bg-transparent text-primary-foreground hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
    "focus-visible:border-transparent focus-visible:ring-0",
    "before:absolute before:inset-0 before:-z-10 before:bg-destructive before:content-[''] before:edge-jagged",
    hoverShadow,
    // pressed: a negative that keeps the accent — paper inside an accent serrated rim
    "active:text-destructive! active:after:absolute active:after:inset-[3px] active:after:-z-10 active:after:bg-background active:after:content-[''] active:after:edge-jagged active:after:translate-0 active:after:[clip-path:none] active:after:bg-none",
  ].join(" "),
  shout: [
    "border-transparent bg-transparent px-8 text-primary-foreground hover:bg-transparent",
    "before:absolute before:-inset-x-3 before:-inset-y-4 before:-z-10 before:bg-primary before:content-[''] before:shape-burst",
    // hover: the burst fidgets in steps
    "hover:before:animate-jitter",
    // focus follows the shape: see <ShoutFocus> (ink burst, paper gap, then the button burst)
    "focus-visible:shadow-none! focus-visible:outline-none!",
    // pressed: paper burst with an ink rim, visible on both paper and ink backgrounds
    "active:text-foreground! active:before:bg-background active:after:absolute active:after:-inset-x-3.5 active:after:-inset-y-[1.2rem] active:after:-z-20 active:after:bg-foreground active:after:content-[''] active:after:shape-burst",
  ].join(" "),
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  default: "h-10 gap-2 px-4 text-base",
  lg: "h-12 gap-2 px-6 text-lg",
  icon: "size-10 p-0",
}

/** Concentration lines turning in steps: the loading mark shared by every mangacn control. */
function Spinner({ className, label }: { className?: string; label?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const inner = i % 3 === 0 ? 4 : 6
    const w = i % 2 ? 0.9 : 1.6
    const x = (r: number, d = 0) => 12 + Math.cos(a + d) * r
    const y = (r: number, d = 0) => 12 + Math.sin(a + d) * r
    return `M${x(inner).toFixed(2)} ${y(inner).toFixed(2)}L${x(12, w / 12).toFixed(2)} ${y(12, w / 12).toFixed(2)}L${x(12, -w / 12).toFixed(2)} ${y(12, -w / 12).toFixed(2)}Z`
  }).join("")
  return (
    <svg
      viewBox="0 0 24 24"
      data-slot="spinner"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("size-4 shrink-0 animate-spin-steps", className)}
    >
      <path d={rays} fill="currentColor" />
    </svg>
  )
}

/** Short speed lines on both sides, shown for the three frames of a click. */
function ImpactLines() {
  const lines = (flip: boolean) => (
    <svg viewBox="0 0 16 24" preserveAspectRatio="none" className={cn("size-full", flip ? "-scale-x-100 rtl:scale-x-100" : "rtl:-scale-x-100")} aria-hidden>
      <path d="M2 4h12M7 9h7M0 14h14M8 19h6" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  )
  const side =
    "pointer-events-none invisible absolute top-1/2 h-6 w-4 -translate-y-1/2 text-foreground group-data-[impact]/button:animate-hit-lines"
  return (
    <>
      <span aria-hidden className={cn(side, "-start-6 origin-right rtl:origin-left group-data-[variant=shout]/button:-start-10")}>{lines(false)}</span>
      <span aria-hidden className={cn(side, "-end-6 origin-left rtl:origin-right group-data-[variant=shout]/button:-end-10")}>{lines(true)}</span>
    </>
  )
}

/** Restarts the click impact on a button (skipped when the user prefers reduced motion). */
const impactTimers = new WeakMap<HTMLElement, number>()
function punch(el: HTMLElement) {
  if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return
  el.removeAttribute("data-impact")
  void el.offsetWidth
  el.setAttribute("data-impact", "")
  window.clearTimeout(impactTimers.get(el))
  impactTimers.set(el, window.setTimeout(() => el.removeAttribute("data-impact"), 260))
}

/** Focus ring for the burst: a larger ink burst and a paper gap, shown only on focus-visible. */
function ShoutFocus() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-7 -z-30 hidden bg-ring shape-burst group-focus-visible/button:block" />
      <span aria-hidden className="pointer-events-none absolute -inset-x-[1.15rem] -inset-y-[1.4rem] -z-20 hidden bg-background shape-burst group-focus-visible/button:block" />
    </>
  )
}

function Button({
  variant = "default",
  size = "default",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const handleClick: ShadcnProps["onClick"] = (event) => {
    onClick?.(event)
    punch(event.currentTarget as HTMLElement)
  }
  return (
    <ShadcnButton
      data-manga="button"
      data-variant={variant}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      variant={VARIANTS[variant]}
      size={SIZES[size]}
      disabled={disabled || loading}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        size === "lg" && variant === "shout" && "px-10",
        fullWidth && "w-full",
        loading ? "disabled:cursor-progress" : disabledLook,
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {variant === "shout" && <ShoutFocus />}
      <ImpactLines />
      {loading && <Spinner />}
      {children}
    </ShadcnButton>
  )
}

export { Button, Spinner }
