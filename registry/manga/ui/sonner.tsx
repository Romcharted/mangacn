import * as React from "react"
import { cn } from "cn"
import { toast, type ToasterProps } from "sonner"

import { Toaster as ShadcnToaster } from "@/components/ui/sonner"

function Mark({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("grid size-6 shrink-0 place-items-center border-[length:var(--mg-bw)] border-border font-sfx text-sm leading-none", className)}
    >
      {children}
    </span>
  )
}

/** Optional onomatopoeia for a toast: `toast("Saved", { icon: <ToastSfx>DON!</ToastSfx> })`. */
function ToastSfx({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="inline-block -rotate-6 animate-sfx font-sfx text-xl leading-none knockout rtl:rotate-6">
      {children}
    </span>
  )
}

const icons: ToasterProps["icons"] = {
  success: <Mark className="bg-primary text-primary-foreground">✓</Mark>,
  info: <Mark>i</Mark>,
  warning: <Mark className="tone-35">!</Mark>,
  error: <Mark className="border-destructive bg-destructive text-primary-foreground">!</Mark>,
  loading: (
    <span aria-hidden className="block size-6 animate-spin-steps rounded-full focus-lines [--focus-hole:28%_28%]" />
  ),
}

/** Sonner, inked: 3px panel, tone shadow, stepped entrance, shake on error. */
function Toaster({ toastOptions, ...props }: ToasterProps) {
  return (
    <ShadcnToaster
      icons={icons}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          toast: cn(
            // Sonner owns ::before/::after on the toast, so the shadow is a second, offset frame (no fill, no blur).
            "group/toast relative flex w-full items-center gap-3 border-ink-panel bg-popover p-4 font-sans text-base text-popover-foreground",
            "shadow-[6px_6px_0_-2px_var(--background),6px_6px_0_0_var(--foreground)] rtl:shadow-[-6px_6px_0_-2px_var(--background),-6px_6px_0_0_var(--foreground)]",
            "transition-none! animate-enter data-[type=error]:animate-shake data-[type=error]:border-destructive",
          ),
          title: "font-letter text-lg leading-tight tracking-wide uppercase",
          description: "text-sm text-popover-foreground!",
          icon: "shrink-0",
          content: "flex-1",
          actionButton:
            "ms-auto h-8 shrink-0 border-[length:var(--mg-bw)] border-primary bg-primary px-3 font-letter text-sm uppercase text-primary-foreground focus-ink active:animate-impact",
          cancelButton:
            "h-8 shrink-0 border-[length:var(--mg-bw)] border-border bg-background px-3 font-letter text-sm uppercase text-foreground hover:tone-20 focus-ink",
          closeButton:
            "absolute -top-2.5 -end-2.5 grid size-6 place-items-center border-[length:var(--mg-bw)] border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground focus-ink",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

export { Toaster, ToastSfx, toast }
