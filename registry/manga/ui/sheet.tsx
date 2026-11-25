import * as React from "react"
import { cn } from "cn"

import {
  Sheet,
  SheetClose,
  SheetContent as ShadcnSheetContent,
  SheetDescription as ShadcnSheetDescription,
  SheetFooter as ShadcnSheetFooter,
  SheetHeader,
  SheetTitle as ShadcnSheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/*
 * A case (G1) docked to an edge: a 3px line on the open side and a tone shadow thrown onto the page.
 * It slides in over three frames (G5, like a panel sliding into view). The veil comes from base.
 * data-side is set by both versions of shadcn.
 */
function SheetContent({ className, ...props }: React.ComponentProps<typeof ShadcnSheetContent>) {
  return (
    <ShadcnSheetContent
      data-manga="sheet"
      className={cn(
        "gap-0 border-0 bg-popover text-base text-popover-foreground shadow-none transition-none duration-0",
        "data-[side=right]:border-s-[length:var(--mg-bw-panel)] data-[side=left]:border-e-[length:var(--mg-bw-panel)] data-[side=top]:border-b-[length:var(--mg-bw-panel)] data-[side=bottom]:border-t-[length:var(--mg-bw-panel)] border-border",
        "data-[side=right]:shadow-[-8px_0_0_-2px_var(--background),-8px_0_0_0_var(--foreground)] data-[side=left]:shadow-[8px_0_0_-2px_var(--background),8px_0_0_0_var(--foreground)]",
        "data-[side=top]:shadow-[0_8px_0_-2px_var(--background),0_8px_0_0_var(--foreground)] data-[side=bottom]:shadow-[0_-8px_0_-2px_var(--background),0_-8px_0_0_var(--foreground)]",
        "data-starting-style:opacity-100 data-ending-style:opacity-100 data-open:animate-sheet-in data-[state=open]:animate-sheet-in data-closed:animate-none data-[state=closed]:animate-none",
        "data-[side=right]:[--sheet-x:100%] data-[side=left]:[--sheet-x:-100%] data-[side=top]:[--sheet-y:-100%] data-[side=bottom]:[--sheet-y:100%]",
        "[&_[data-slot=sheet-close]]:rounded-none [&_[data-slot=sheet-close]]:border-[length:var(--mg-bw)] [&_[data-slot=sheet-close]]:border-border [&_[data-slot=sheet-close]:hover]:bg-foreground [&_[data-slot=sheet-close]:hover]:text-background",
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof ShadcnSheetTitle>) {
  return <ShadcnSheetTitle className={cn("font-letter text-2xl leading-tight font-normal tracking-wide uppercase", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof ShadcnSheetDescription>) {
  return <ShadcnSheetDescription className={cn("text-base text-foreground", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<typeof ShadcnSheetFooter>) {
  return <ShadcnSheetFooter className={cn("border-t-[length:var(--mg-bw)] border-border", className)} {...props} />
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger }
