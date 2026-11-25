import * as React from "react"
import { cn } from "cn"

import {
  Select,
  SelectContent as ShadcnSelectContent,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectSeparator as ShadcnSelectSeparator,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/*
 * Grammar: the trigger is drawn like Input; the list is a case (G1) with a notch toward the trigger
 * (G6) that pops in (G5); the highlighted option inverts (G3); the chosen one gets a brush check (G8).
 * States come from attributes both Radix and Base UI set: aria-expanded, data-highlighted,
 * data-disabled, data-side; chosen = [data-selected] (Base UI; not the data-selected: variant, which shadcn maps to ="true") or data-state="checked" (Radix).
 */

function SelectTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnSelectTrigger>) {
  return (
    <ShadcnSelectTrigger
      data-manga="select-trigger"
      className={cn(
        "relative h-10! max-w-full min-w-40 gap-3 rounded-(--radius) border-[length:var(--mg-bw)] border-input bg-background px-3 text-base text-foreground shadow-none transition-none dark:bg-background dark:hover:bg-background",
        "data-[size=sm]:h-8! data-[size=sm]:text-sm data-placeholder:text-foreground data-placeholder:italic",
        // the stock chevron is replaced by a brush chevron that turns in two steps when open
        "[&>svg]:hidden after:mark-chevron after:shrink-0 after:text-sm aria-expanded:after:rotate-180 aria-expanded:after:animate-chevron",
        "hover-thicken", // G3, third case: a field
        "focus-visible:border-ring focus-visible:ring-0 focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        "aria-expanded:border-[3px] aria-expanded:px-[11px]",
        "disabled:opacity-100 disabled:border-dashed disabled:tone-frame disabled:cursor-not-allowed data-disabled:opacity-100 data-disabled:border-dashed data-disabled:tone-frame disabled:hover:border-[length:var(--mg-bw)] disabled:hover:px-3",
        "aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]",
        className,
      )}
      {...props}
    />
  )
}

function SelectContent({ className, ...props }: React.ComponentProps<typeof ShadcnSelectContent>) {
  return (
    <ShadcnSelectContent
      data-manga="select-content"
      className={cn(
        "ink-case case-notch overflow-visible! rounded-(--radius) p-1 text-base shadow-none ring-0",
        // the list scrolls inside the case, so the notch and the shadow are not clipped
        "[&>[role=presentation]]:max-h-[min(20rem,var(--available-height,20rem))] [&>[role=presentation]]:overflow-y-auto [&>[role=listbox]]:max-h-[min(20rem,var(--available-height,20rem))] [&>[role=listbox]]:overflow-y-auto",
        "duration-0 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none",
        className,
      )}
      {...props}
    />
  )
}

function SelectItem({ className, ...props }: React.ComponentProps<typeof ShadcnSelectItem>) {
  return (
    <ShadcnSelectItem
      data-manga="select-item"
      className={cn(
        "rounded-none py-1.5 ps-2 pe-9 text-base",
        // G3: the highlighted option (mouse or keyboard) inverts
        "focus:bg-foreground focus:text-background data-highlighted:bg-foreground data-highlighted:text-background",
        "not-data-[variant=destructive]:focus:**:text-background",
        // G8: the chosen option gets a brush check that draws itself (the stock check is hidden)
        "[&_svg]:hidden",
        "data-[selected]:after:mark-check data-[state=checked]:after:mark-check after:absolute after:end-2 after:text-lg",
        // disabled: label kept on paper, dashed underline, not-allowed cursor
        "data-disabled:pointer-events-auto data-disabled:cursor-not-allowed data-disabled:opacity-100 data-disabled:underline data-disabled:decoration-dashed data-disabled:decoration-2 data-disabled:underline-offset-4",
        "data-disabled:data-highlighted:bg-transparent data-disabled:data-highlighted:text-foreground data-disabled:focus:bg-transparent data-disabled:focus:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function SelectGroup({ className, ...props }: React.ComponentProps<typeof ShadcnSelectGroup>) {
  return <ShadcnSelectGroup className={cn("p-0 not-first:mt-1", className)} {...props} />
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof ShadcnSelectLabel>) {
  return (
    <ShadcnSelectLabel
      className={cn("px-2 pt-1.5 pb-1 font-letter text-sm tracking-wide text-foreground uppercase underline decoration-2 underline-offset-4", className)}
      {...props}
    />
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnSelectSeparator>) {
  return <ShadcnSelectSeparator className={cn("-mx-1 my-1 h-[length:var(--mg-bw-fine)] bg-border", className)} {...props} />
}

/** Shown inside SelectContent when there is nothing to choose: a “…” mark and a short line. */
function SelectEmpty({ className, children = "Nothing here yet.", ...props }: React.ComponentProps<"div">) {
  return (
    <div data-manga="select-empty" role="status" className={cn("flex items-center gap-3 px-2 py-3 text-sm", className)} {...props}>
      <span aria-hidden className="font-sfx text-2xl leading-none">
        …
      </span>
      {children}
    </div>
  )
}

/** Shown inside SelectContent while options load: turning concentration lines (G7). */
function SelectLoading({ className, children = "Loading…", ...props }: React.ComponentProps<"div">) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const inner = i % 3 === 0 ? 4 : 6
    const w = i % 2 ? 0.08 : 0.13
    const p = (r: number, d = 0) => `${(12 + Math.cos(a + d) * r).toFixed(2)} ${(12 + Math.sin(a + d) * r).toFixed(2)}`
    return `M${p(inner)}L${p(12, w)}L${p(12, -w)}Z`
  }).join("")
  return (
    <div data-manga="select-loading" role="status" aria-live="polite" className={cn("flex items-center gap-3 px-2 py-3 text-sm", className)} {...props}>
      <svg viewBox="0 0 24 24" aria-hidden className="size-5 shrink-0 animate-spin-steps">
        <path d={rays} fill="currentColor" />
      </svg>
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectEmpty, SelectGroup, SelectItem, SelectLabel, SelectLoading, SelectSeparator, SelectTrigger, SelectValue }
