import * as React from "react"
import { cn } from "cn"
import { toast, type ToasterProps } from "sonner"

import { Toaster as ShadcnToaster } from "@/components/ui/sonner"

export type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading"

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

function LoadingMark() {
  // Concentration lines turning in steps (same mark as the button spinner).
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const inner = i % 3 === 0 ? 4 : 6
    const w = i % 2 ? 0.08 : 0.13
    const p = (r: number, d = 0) => `${(12 + Math.cos(a + d) * r).toFixed(2)} ${(12 + Math.sin(a + d) * r).toFixed(2)}`
    return `M${p(inner)}L${p(12, w)}L${p(12, -w)}Z`
  }).join("")
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0 animate-spin-steps">
      <path d={rays} fill="currentColor" />
    </svg>
  )
}

const icons: Record<Exclude<ToastType, "default">, React.ReactNode> = {
  success: <Mark className="bg-primary text-primary-foreground">✓</Mark>,
  info: <Mark>i</Mark>,
  warning: <Mark className="border-dashed">!</Mark>,
  error: <Mark className="border-destructive bg-destructive text-primary-foreground">!</Mark>,
  loading: <LoadingMark />,
}

/** Optional onomatopoeia for a toast: `toast("Saved", { icon: <ToastSfx>DON!</ToastSfx> })`. Gets its own column. */
function ToastSfx({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden className="inline-block -rotate-6 animate-sfx font-sfx text-xl leading-none whitespace-nowrap rtl:rotate-6">
      {children}
    </span>
  )
}

/** Shared look: used by the live Toaster and by the static ToastCard. */
const toastClasses = {
  // Sonner owns ::before/::after on the toast, so the shadow is a second, offset frame (no fill, no blur).
  toast: cn(
    "group/toast relative flex w-full items-center gap-3 rounded-(--radius) border-ink-panel bg-popover p-4 font-sans text-base text-popover-foreground",
    "shadow-[6px_6px_0_-2px_var(--background),6px_6px_0_0_var(--foreground)] rtl:shadow-[-6px_6px_0_-2px_var(--background),-6px_6px_0_0_var(--foreground)]",
    "data-[type=error]:border-destructive",
  ),
  // The title also carries the entrance's motion lines (under the toast, hidden once it has landed).
  title: cn(
    "font-letter text-lg leading-tight tracking-wide uppercase",
    "before:pointer-events-none before:invisible before:absolute before:inset-x-6 before:top-[calc(100%+6px)] before:h-10 before:origin-top before:text-foreground before:content-['']",
    "before:[background-image:repeating-linear-gradient(to_right,currentColor_0_2px,transparent_2px_13px),repeating-linear-gradient(to_right,transparent_0_6px,currentColor_6px_7px,transparent_7px_21px)]",
    "before:[background-size:100%_100%,100%_60%] before:bg-no-repeat",
  ),
  description: "text-sm text-popover-foreground!",
  // a column of its own, wide enough for an SFX
  icon: "m-0! flex h-auto! w-auto! min-w-6 shrink-0 items-center justify-center",
  content: "min-w-0 flex-1",
  actionButton:
    "ms-auto h-8 shrink-0 rounded-(--radius) border-[length:var(--mg-bw)] border-primary bg-primary px-3 font-letter text-sm uppercase text-primary-foreground focus-ink active:bg-background active:text-foreground",
  cancelButton:
    "h-8 shrink-0 rounded-(--radius) border-[length:var(--mg-bw)] border-border bg-background px-3 font-letter text-sm uppercase text-foreground hover:border-[3px] focus-ink",
  closeButton:
    "absolute -top-2.5 -end-2.5 grid size-6 place-items-center border-[length:var(--mg-bw)] border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground focus-ink",
}

/** Sonner, inked: 3px panel, offset frame, stepped entrance, shake on error. */
function Toaster({ toastOptions, ...props }: ToasterProps) {
  return (
    <ShadcnToaster
      icons={icons}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          ...toastClasses,
          toast: cn(toastClasses.toast, "transition-none! animate-toast-in data-[type=error]:animate-shake [&_[data-title]]:before:animate-trail-v"),
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

export type ToastCardProps = React.ComponentProps<"div"> & {
  type?: ToastType
  title: React.ReactNode
  description?: React.ReactNode
  /** Replaces the type mark, e.g. <ToastSfx>. */
  icon?: React.ReactNode
  action?: React.ReactNode
}

/** A static toast, same look as the live one: for previews, docs and empty states. */
function ToastCard({ type = "default", title, description, icon, action, className, ...props }: ToastCardProps) {
  const mark = icon ?? (type === "default" ? null : icons[type])
  return (
    <div data-manga="toast" data-type={type} role="status" className={cn(toastClasses.toast, className)} {...props}>
      {mark && <div className={toastClasses.icon}>{mark}</div>}
      <div className={toastClasses.content}>
        <div className={toastClasses.title}>{title}</div>
        {description && <div className={toastClasses.description}>{description}</div>}
      </div>
      {action}
    </div>
  )
}

export { Toaster, ToastCard, ToastSfx, toast }
