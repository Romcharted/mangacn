import * as React from "react"
import { cn } from "cn"

import {
  ContextMenu,
  ContextMenuCheckboxItem as ShadcnContextMenuCheckboxItem,
  ContextMenuContent as ShadcnContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem as ShadcnContextMenuItem,
  ContextMenuLabel as ShadcnContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem as ShadcnContextMenuRadioItem,
  ContextMenuSeparator as ShadcnContextMenuSeparator,
  ContextMenuShortcut as ShadcnContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent as ShadcnContextMenuSubContent,
  ContextMenuSubTrigger as ShadcnContextMenuSubTrigger,
  ContextMenuTrigger as ShadcnContextMenuTrigger,
} from "@/components/ui/context-menu"

/*
 * Same recipe as DropdownMenu (G1 case, G2 ink rows, G3 hover, G5 pop, G8 marks) but no notch (G6):
 * the menu opens at the pointer. Rows are 44px under 640 px. Stock classes that stay (shadow, ring,
 * fade) are overridden with literal classes; data-open and data-[state=open] are both covered.
 */
const panel =
  "ink-case relative rounded-(--radius) p-1 text-base shadow-none ring-0 duration-0 overflow-visible! min-w-44 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none"

const row = [
  "rounded-none px-2 py-1.5 text-base max-sm:min-h-11",
  "focus:bg-foreground focus:text-background data-highlighted:bg-foreground data-highlighted:text-background not-data-[variant=destructive]:focus:**:text-background",
  "data-disabled:pointer-events-auto data-disabled:cursor-not-allowed data-disabled:opacity-100 data-disabled:underline data-disabled:decoration-dashed data-disabled:decoration-2 data-disabled:underline-offset-4",
  "data-disabled:focus:bg-transparent data-disabled:focus:text-foreground data-disabled:data-highlighted:bg-transparent data-disabled:data-highlighted:text-foreground",
].join(" ")

const destructiveRow =
  "data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive data-[variant=destructive]:focus:text-primary-foreground data-[variant=destructive]:data-highlighted:bg-destructive data-[variant=destructive]:data-highlighted:text-primary-foreground dark:data-[variant=destructive]:focus:bg-destructive"

const checkRow = "pe-9 [&_svg]:hidden aria-checked:after:mark-check after:absolute after:end-2 after:text-lg"

const radioRow =
  "pe-9 [&_svg]:hidden after:absolute after:end-3 after:size-2 after:rotate-45 after:border-[length:var(--mg-bw)] after:border-current after:content-[''] aria-checked:after:bg-current aria-checked:after:animate-pop"

const subRow =
  "data-popup-open:bg-foreground data-popup-open:text-background data-[state=open]:bg-foreground data-[state=open]:text-background [&>svg:last-child]:hidden after:ms-auto after:mark-chevron after:-rotate-90 rtl:after:rotate-90 after:text-sm"

function ContextMenuTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuTrigger>) {
  return (
    <ShadcnContextMenuTrigger data-manga="context-menu" className={cn("select-none", className)} {...props} />
  )
}

function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuContent>) {
  return <ShadcnContextMenuContent data-manga="context-menu" className={cn(panel, className)} {...props} />
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuSubContent>) {
  return <ShadcnContextMenuSubContent className={cn(panel, "min-w-40", className)} {...props} />
}

function ContextMenuItem({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuItem>) {
  return <ShadcnContextMenuItem className={cn(row, destructiveRow, className)} {...props} />
}

function ContextMenuCheckboxItem({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuCheckboxItem>) {
  return <ShadcnContextMenuCheckboxItem className={cn(row, checkRow, "after:text-lg", className)} {...props} />
}

function ContextMenuRadioItem({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuRadioItem>) {
  return <ShadcnContextMenuRadioItem className={cn(row, radioRow, className)} {...props} />
}

function ContextMenuSubTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuSubTrigger>) {
  return <ShadcnContextMenuSubTrigger className={cn(row, subRow, className)} {...props} />
}

function ContextMenuLabel({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuLabel>) {
  return (
    <ShadcnContextMenuLabel
      className={cn("px-2 pt-1.5 pb-1 font-letter text-sm font-normal tracking-wide text-foreground uppercase underline decoration-2 underline-offset-4", className)}
      {...props}
    />
  )
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuSeparator>) {
  return <ShadcnContextMenuSeparator className={cn("h-[length:var(--mg-bw-fine)] bg-border", className)} {...props} />
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<typeof ShadcnContextMenuShortcut>) {
  return <ShadcnContextMenuShortcut className={cn("font-mono text-xs tracking-normal text-current", className)} {...props} />
}

/*
 * Static look-alike of an open menu, for State grids (no portal, no positioning). Rows are plain
 * elements with the same classes; the frozen state is an attribute (highlighted, checked, disabled).
 */
function ContextMenuTwin({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="menu" data-manga="context-menu" className={cn(panel, "w-56", className)} {...props} />
}

function ContextMenuTwinRow({
  className,
  highlighted,
  checked,
  radio,
  disabled,
  destructive,
  sub,
  ...props
}: React.ComponentProps<"div"> & {
  highlighted?: boolean
  checked?: boolean
  radio?: boolean
  disabled?: boolean
  destructive?: boolean
  sub?: boolean
}) {
  return (
    <div
      role="menuitem"
      aria-checked={checked || radio ? true : undefined}
      aria-disabled={disabled || undefined}
      data-highlighted={highlighted ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-variant={destructive ? "destructive" : undefined}
      className={cn(
        row,
        destructive && destructiveRow,
        checked && checkRow,
        radio && radioRow,
        sub && subRow,
        className,
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuTwin,
  ContextMenuTwinRow,
}
