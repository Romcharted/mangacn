// Gestures: G3 hover, G4 impact, the focus ring and the loading lines all come from the Button it wraps
// (outline variant). The logo plate is a paper square with a 1px ink line; AuthDivider is two fine ink rules.
import * as React from "react"
import { cn } from "cn"

import { Button, type ButtonProps } from "@/components/ui/manga/button"

export type SocialButtonProps = ButtonProps & {
  /** The brand mark, supplied by the app (the item ships no logo). Fitted into a 20 × 20 paper plate. */
  logo?: React.ReactNode
  /** Sets data-provider (e.g. "google", "apple") for styling hooks in the app. */
  provider?: string
}

/** "Continue with <service>": an outline button, 44 px tall, full width by default, with a logo slot at the start. */
function SocialButton({ logo, provider, children, variant = "outline", fullWidth = true, className, ...props }: SocialButtonProps) {
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      className={cn("h-11!", className)}
      {...props}
      data-manga="social-button"
      data-provider={provider}
    >
      {logo !== undefined && (
        <span
          data-slot="social-logo"
          aria-hidden
          className="grid size-5 shrink-0 place-items-center overflow-hidden border-[length:var(--mg-bw-fine)] border-border bg-background [&>*]:max-h-full [&>*]:max-w-full"
        >
          {logo}
        </span>
      )}
      {children}
    </Button>
  )
}

/** A horizontal ink rule with a label in lettering in the middle ("or"). Fine lines; works at 360 px. */
function AuthDivider({ label = "or", className }: { label?: string; className?: string }) {
  return (
    <div
      role="separator"
      aria-label={label}
      data-manga="auth-divider"
      className={cn("flex w-full items-center gap-3", className)}
    >
      <span aria-hidden className="h-0 flex-1 border-t-[length:var(--mg-bw-fine)] border-border" />
      <span aria-hidden className="shrink-0 font-letter text-sm tracking-wide uppercase">
        {label}
      </span>
      <span aria-hidden className="h-0 flex-1 border-t-[length:var(--mg-bw-fine)] border-border" />
    </div>
  )
}

export { SocialButton, AuthDivider }
