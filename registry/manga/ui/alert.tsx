import * as React from "react"
import { cn } from "cn"

import { Alert as ShadcnAlert, AlertAction, AlertDescription as ShadcnAlertDescription, AlertTitle as ShadcnAlertTitle } from "@/components/ui/alert"

export type AlertProps = Omit<React.ComponentProps<typeof ShadcnAlert>, "variant"> & {
  /** default: a case (G1) · destructive: accent line, a "!" mark at the start and a shake when it appears (G8) */
  variant?: "default" | "destructive"
}

function Alert({ variant = "default", className, ...props }: AlertProps) {
  return (
    <ShadcnAlert
      data-manga="alert"
      variant={variant}
      className={cn(
        "relative rounded-(--radius) border-[length:var(--mg-bw-panel)] border-border bg-background px-4 py-3 text-base text-foreground tone-shadow animate-pop",
        "*:[svg]:size-5! *:[svg]:translate-y-0",
        variant === "destructive" && [
          "animate-shake border-destructive text-foreground ps-12 *:data-[slot=alert-description]:text-foreground",
          "before:absolute before:inset-y-0 before:start-0 before:grid before:w-8 before:place-items-center before:bg-destructive before:font-sfx before:text-lg before:text-primary-foreground before:content-['!']",
        ],
        className,
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof ShadcnAlertTitle>) {
  return <ShadcnAlertTitle className={cn("font-letter text-lg leading-tight font-normal tracking-wide uppercase", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof ShadcnAlertDescription>) {
  return <ShadcnAlertDescription className={cn("text-base text-foreground [&_a]:decoration-2 [&_a]:hover:decoration-4", className)} {...props} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
