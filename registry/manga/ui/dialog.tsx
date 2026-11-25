import * as React from "react"
import { cn } from "cn"

import {
  Dialog,
  DialogClose,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogHeader,
  DialogOverlay as ShadcnDialogOverlay,
  DialogPortal,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type DialogSize = "sm" | "default" | "lg" | "full"

const sizes: Record<DialogSize, string> = {
  sm: "sm:max-w-sm",
  default: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  full: "sm:max-w-[calc(100%-4rem)]",
}

// Open/close: Base UI sets data-open/data-closed, Radix sets data-state. Both are covered.
const stepped =
  "duration-0 data-open:animate-impact data-[state=open]:animate-impact data-closed:animate-none data-[state=closed]:animate-none"

// The overlay look (screentone, no blur) comes from the base item, for every shadcn overlay.
function DialogOverlay({ className, ...props }: React.ComponentProps<typeof ShadcnDialogOverlay>) {
  return (
    <ShadcnDialogOverlay
      className={cn("duration-0 data-open:animate-none data-[state=open]:animate-none data-closed:animate-none data-[state=closed]:animate-none", className)}
      {...props}
    />
  )
}

export type DialogContentProps = React.ComponentProps<typeof ShadcnDialogContent> & {
  size?: DialogSize
}

/** The panel: 3px frame, tone shadow, opens on an impact frame. Long content goes in <DialogBody>. */
function DialogContent({ size = "default", className, ...props }: DialogContentProps) {
  return (
    <ShadcnDialogContent
      data-manga="dialog"
      data-size={size}
      className={cn(
        "max-h-[calc(100dvh-3rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 overflow-visible rounded-(--radius) border-ink-panel bg-popover p-5 text-base shadow-none ring-0 tone-shadow",
        stepped,
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

/** Scrolling region inside DialogContent (keeps the tone shadow outside the scroll box). */
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      tabIndex={0}
      className={cn("-mx-5 min-h-0 overflow-y-auto px-5 focus-visible:outline-2 focus-visible:-outline-offset-2", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<typeof ShadcnDialogFooter>) {
  return (
    <ShadcnDialogFooter
      className={cn("-mx-5 -mb-5 rounded-t-none rounded-b-(--radius) border-t-[length:var(--mg-bw)] border-border bg-background p-4 tone-10", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof ShadcnDialogTitle>) {
  return (
    <ShadcnDialogTitle
      className={cn("font-letter text-2xl leading-none font-normal tracking-wide uppercase", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof ShadcnDialogDescription>) {
  return <ShadcnDialogDescription className={cn("text-base text-foreground", className)} {...props} />
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
