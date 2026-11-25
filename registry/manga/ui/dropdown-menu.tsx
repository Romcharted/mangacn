import * as React from "react"
import { cn } from "cn"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem as ShadcnDropdownMenuCheckboxItem,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem as ShadcnDropdownMenuRadioItem,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuShortcut as ShadcnDropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent as ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger as ShadcnDropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/*
 * Same grammar as Select: the menu is a case (G1) with a notch toward the trigger (G6), popping in (G5).
 * Rows invert on hover or keyboard focus (G3). Checked rows get a brush check, radio rows an ink diamond
 * (G8). aria-checked and data-highlighted are set by Radix and Base UI alike.
 */
const panel =
  "ink-case rounded-(--radius) p-1 text-base shadow-none ring-0 duration-0 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none"

const row = [
  "rounded-none px-2 py-1.5 text-base",
  "focus:bg-foreground focus:text-background data-highlighted:bg-foreground data-highlighted:text-background not-data-[variant=destructive]:focus:**:text-background",
  "data-disabled:pointer-events-auto data-disabled:cursor-not-allowed data-disabled:opacity-100 data-disabled:underline data-disabled:decoration-dashed data-disabled:decoration-2 data-disabled:underline-offset-4",
  "data-disabled:focus:bg-transparent data-disabled:focus:text-foreground data-disabled:data-highlighted:bg-transparent data-disabled:data-highlighted:text-foreground",
].join(" ")

function DropdownMenuContent({ className, sideOffset = 10, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuContent>) {
  return (
    <ShadcnDropdownMenuContent
      data-manga="dropdown-menu"
      sideOffset={sideOffset}
      className={cn(panel, "case-notch overflow-visible! min-w-44", className)}
      {...props}
    />
  )
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuSubContent>) {
  return <ShadcnDropdownMenuSubContent className={cn(panel, "min-w-40", className)} {...props} />
}

function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuItem>) {
  return (
    <ShadcnDropdownMenuItem
      className={cn(
        row,
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive data-[variant=destructive]:focus:text-primary-foreground data-[variant=destructive]:data-highlighted:bg-destructive data-[variant=destructive]:data-highlighted:text-primary-foreground dark:data-[variant=destructive]:focus:bg-destructive",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuCheckboxItem>) {
  return (
    <ShadcnDropdownMenuCheckboxItem
      className={cn(row, "pe-9 [&_svg]:hidden aria-checked:after:mark-check after:absolute after:end-2 after:text-lg", className)}
      {...props}
    />
  )
}

function DropdownMenuRadioItem({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuRadioItem>) {
  return (
    <ShadcnDropdownMenuRadioItem
      className={cn(
        row,
        "pe-9 [&_svg]:hidden after:absolute after:end-3 after:size-2 after:rotate-45 after:border-[length:var(--mg-bw)] after:border-current after:content-[''] aria-checked:after:bg-current aria-checked:after:animate-pop",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuSubTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuSubTrigger>) {
  return (
    <ShadcnDropdownMenuSubTrigger
      className={cn(
        row,
        "data-popup-open:bg-foreground data-popup-open:text-background data-[state=open]:bg-foreground data-[state=open]:text-background",
        "[&>svg:last-child]:hidden after:ms-auto after:mark-chevron after:-rotate-90 rtl:after:rotate-90 after:text-sm",
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuLabel>) {
  return (
    <ShadcnDropdownMenuLabel
      className={cn("px-2 pt-1.5 pb-1 font-letter text-sm font-normal tracking-wide text-foreground uppercase underline decoration-2 underline-offset-4", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuSeparator>) {
  return <ShadcnDropdownMenuSeparator className={cn("h-[length:var(--mg-bw-fine)] bg-border", className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<typeof ShadcnDropdownMenuShortcut>) {
  return <ShadcnDropdownMenuShortcut className={cn("font-mono text-xs tracking-normal text-current", className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
