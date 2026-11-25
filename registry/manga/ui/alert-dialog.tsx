"use client"

import * as React from "react"
import { cn } from "cn"

import {
  AlertDialog,
  AlertDialogAction as ShadcnAlertDialogAction,
  AlertDialogCancel as ShadcnAlertDialogCancel,
  AlertDialogContent as ShadcnAlertDialogContent,
  AlertDialogDescription as ShadcnAlertDialogDescription,
  AlertDialogFooter as ShadcnAlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia as ShadcnAlertDialogMedia,
  AlertDialogTitle as ShadcnAlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonClassName } from "@/components/ui/manga/button"
import { FocusFlash, ImpactLines, withImpact } from "@/lib/manga/gestures"

/*
 * Like Dialog: a case (G1) that pops in (G5) with a flash of concentration lines behind it. The veil comes
 * from base. Action and Cancel are drawn as manga buttons and hit on click (G4).
 */
function AlertDialogContent({ className, children, ...props }: React.ComponentProps<typeof ShadcnAlertDialogContent>) {
  return (
    <ShadcnAlertDialogContent
      data-manga="alert-dialog"
      className={cn(
        "overflow-visible rounded-(--radius) border-ink-panel bg-popover p-5 text-base shadow-none ring-0 tone-shadow",
        "duration-0 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none",
        className,
      )}
      {...props}
    >
      <FocusFlash />
      {children}
    </ShadcnAlertDialogContent>
  )
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<typeof ShadcnAlertDialogMedia>) {
  return <ShadcnAlertDialogMedia className={cn("rounded-none border-[length:var(--mg-bw)] border-border bg-background", className)} {...props} />
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof ShadcnAlertDialogTitle>) {
  return <ShadcnAlertDialogTitle className={cn("font-letter text-2xl leading-tight font-normal tracking-wide uppercase", className)} {...props} />
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof ShadcnAlertDialogDescription>) {
  return <ShadcnAlertDialogDescription className={cn("text-base text-foreground", className)} {...props} />
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<typeof ShadcnAlertDialogFooter>) {
  return (
    <ShadcnAlertDialogFooter
      className={cn("-mx-5 -mb-5 rounded-none border-t-[length:var(--mg-bw)] border-border bg-background p-4", className)}
      {...props}
    />
  )
}

type ActionProps = React.ComponentProps<typeof ShadcnAlertDialogAction> & {
  /** Drawn as the manga button variant. "destructive" for irreversible actions. */
  tone?: "default" | "destructive"
}

function AlertDialogAction({ tone = "default", className, children, onClick, ...props }: ActionProps) {
  return (
    <ShadcnAlertDialogAction
      data-manga="button"
      data-variant={tone}
      className={cn(buttonClassName({ variant: tone }), className)}
      onClick={withImpact(onClick as never) as never}
      {...props}
    >
      {children}
      <ImpactLines />
    </ShadcnAlertDialogAction>
  )
}

function AlertDialogCancel({ className, children, ...props }: React.ComponentProps<typeof ShadcnAlertDialogCancel>) {
  return (
    <ShadcnAlertDialogCancel data-manga="button" data-variant="outline" className={cn(buttonClassName({ variant: "outline" }), className)} {...props}>
      {children}
    </ShadcnAlertDialogCancel>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
}
