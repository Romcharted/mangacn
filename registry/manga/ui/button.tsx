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
  /** default: ink flat · outline · tone: screentone fill · ghost · link: wavy underline · destructive: stamp red, jagged · shout: burst for calls to action */
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows turning focus lines, sets aria-busy and disables the button. */
  loading?: boolean
  /** Stretches the button to the full width of its container. */
  fullWidth?: boolean
}

const base = [
  "relative isolate rounded-(--radius) border-[length:var(--mg-bw)] border-border font-letter tracking-wide uppercase transition-none",
  // pressed: 2px offset + impact frame
  "active:not-aria-[haspopup]:translate-y-0.5 active:translate-x-0.5 rtl:active:-translate-x-0.5 active:animate-impact",
  // focus: ink / paper / ink
  "focus-visible:ring-0 focus-visible:border-border focus-ink",
  "disabled:opacity-100 aria-disabled:opacity-100",
  // error (aria-invalid): stamp red line
  "aria-invalid:ring-0 aria-invalid:border-destructive",
].join(" ")

// disabled (not loading): dashed line + light tone, text stays readable
const disabledLook = [
  "disabled:border-dashed aria-disabled:border-dashed disabled:border-border disabled:bg-background aria-disabled:bg-background",
  "disabled:[--tone-paper:var(--background)] aria-disabled:[--tone-paper:var(--background)] disabled:text-foreground aria-disabled:text-foreground disabled:tone-10 aria-disabled:tone-10 disabled:before:hidden aria-disabled:before:hidden",
].join(" ")

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground border-primary hover:bg-primary hover:speed-lines [--tone-paper:var(--primary)]",
  outline:
    "bg-background text-foreground border-border hover:bg-background hover:text-foreground hover:tone-20 dark:bg-background dark:border-border dark:hover:bg-background aria-expanded:bg-primary aria-expanded:text-primary-foreground",
  tone:
    "bg-background text-foreground border-border tone-20 hover:bg-background hover:text-foreground hover:tone-35 dark:bg-background dark:border-border dark:hover:bg-background",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-transparent hover:text-foreground hover:tone-10 dark:hover:bg-transparent aria-expanded:bg-transparent active:bg-background",
  link:
    "h-auto border-transparent bg-transparent px-0.5 text-foreground underline decoration-wavy decoration-2 underline-offset-[5px] hover:bg-primary hover:text-primary-foreground hover:no-underline active:bg-background",
  destructive: [
    "border-transparent bg-transparent text-primary-foreground hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent",
    "focus-visible:border-transparent focus-visible:ring-0",
    "before:absolute before:inset-0 before:-z-10 before:bg-destructive before:content-[''] before:edge-jagged",
    "hover:before:speed-lines hover:before:[--tone-ink:var(--primary-foreground)] [--tone-paper:var(--destructive)]",
  ].join(" "),
  shout: [
    "border-transparent bg-transparent px-8 text-primary-foreground hover:bg-transparent",
    "before:absolute before:-inset-x-3 before:-inset-y-4 before:-z-10 before:bg-primary before:content-[''] before:shape-burst",
    "hover:before:scale-110 hover:before:rotate-6",
  ].join(" "),
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  default: "h-10 gap-2 px-4 text-base",
  lg: "h-12 gap-2 px-6 text-lg",
  icon: "size-10 p-0",
}

/** Turning focus lines: the loading mark shared by every mangacn control. */
function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="spinner"
      className={cn(
        "inline-block size-4 shrink-0 animate-spin-steps rounded-full focus-lines [--focus-hole:30%_30%] [--tone-ink:currentColor]",
        className,
      )}
    />
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
  ...props
}: ButtonProps) {
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
        !loading && disabledLook,
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </ShadcnButton>
  )
}

export { Button, Spinner }
