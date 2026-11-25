import * as React from "react"
import { cn } from "cn"

import {
  Menubar as ShadcnMenubar,
  MenubarCheckboxItem as ShadcnMenubarCheckboxItem,
  MenubarContent as ShadcnMenubarContent,
  MenubarGroup,
  MenubarItem as ShadcnMenubarItem,
  MenubarLabel as ShadcnMenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem as ShadcnMenubarRadioItem,
  MenubarSeparator as ShadcnMenubarSeparator,
  MenubarShortcut as ShadcnMenubarShortcut,
  MenubarSub,
  MenubarSubContent as ShadcnMenubarSubContent,
  MenubarSubTrigger as ShadcnMenubarSubTrigger,
  MenubarTrigger as ShadcnMenubarTrigger,
} from "@/components/ui/menubar"

/*
 * The bar is a 2px frame (no tone). Triggers are cells of a lettering group: hover thickens the cell
 * line (G3), an open trigger is an ink flat (G2), focus is drawn inside the cell. Menus are the
 * DropdownMenu panel with the notch toward the trigger (G6). Works with Base UI (menu parts) and Radix.
 * On phones the bar wraps, so every trigger keeps a 44px target and the page never scrolls sideways.
 */
const bar = "flex h-auto items-stretch gap-0 border-ink bg-background p-0.5! max-sm:flex-wrap"

const trigger = [
  "min-h-8 rounded-(--radius) px-3 py-1 font-letter text-sm tracking-wide uppercase max-sm:min-h-11 max-sm:px-3.5",
  "hover:bg-transparent! hover-thicken",
  "aria-expanded:bg-foreground! aria-expanded:text-background! aria-expanded:fill-in data-popup-open:bg-foreground! data-popup-open:text-background! data-[state=open]:bg-foreground! data-[state=open]:text-background!",
  "focus-visible:outline-solid! focus-visible:outline-2! focus-visible:outline-offset-[-4px]! focus-visible:outline-ring! focus-visible:shadow-none!",
].join(" ")

const panel =
  "ink-case relative rounded-(--radius) p-1 text-base shadow-none ring-0 duration-0 data-open:animate-pop data-[state=open]:animate-pop data-closed:animate-none data-[state=closed]:animate-none"

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

function Menubar({ className, ...props }: React.ComponentProps<typeof ShadcnMenubar>) {
  return <ShadcnMenubar data-manga="menubar" className={cn(bar, className)} {...props} />
}

function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarTrigger>) {
  return <ShadcnMenubarTrigger className={cn(trigger, className)} {...props} />
}

function MenubarContent({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarContent>) {
  return (
    <ShadcnMenubarContent
      className={cn(panel, "case-notch overflow-visible! min-w-44", className)}
      {...props}
    />
  )
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarSubContent>) {
  return <ShadcnMenubarSubContent className={cn(panel, "min-w-40", className)} {...props} />
}

function MenubarItem({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarItem>) {
  return <ShadcnMenubarItem className={cn(row, destructiveRow, className)} {...props} />
}

function MenubarCheckboxItem({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarCheckboxItem>) {
  return <ShadcnMenubarCheckboxItem className={cn(row, checkRow, "after:text-lg", className)} {...props} />
}

function MenubarRadioItem({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarRadioItem>) {
  return <ShadcnMenubarRadioItem className={cn(row, radioRow, className)} {...props} />
}

function MenubarSubTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarSubTrigger>) {
  return <ShadcnMenubarSubTrigger className={cn(row, subRow, className)} {...props} />
}

function MenubarLabel({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarLabel>) {
  return (
    <ShadcnMenubarLabel
      className={cn("px-2 pt-1.5 pb-1 font-letter text-sm font-normal tracking-wide text-foreground uppercase underline decoration-2 underline-offset-4", className)}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarSeparator>) {
  return <ShadcnMenubarSeparator className={cn("h-[length:var(--mg-bw-fine)] bg-border", className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<typeof ShadcnMenubarShortcut>) {
  return <ShadcnMenubarShortcut className={cn("font-mono text-xs tracking-normal text-current", className)} {...props} />
}

/* Static look-alikes for State grids: a trigger in its open state and a menu panel, no portal. */
function MenubarTriggerTwin({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-manga="menubar"
      aria-expanded="true"
      data-popup-open=""
      className={cn(trigger, className)}
      {...props}
    />
  )
}

function MenubarTwin({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="menu" data-side="bottom" className={cn(panel, "case-notch overflow-visible! w-56", className)} {...props} />
}

function MenubarTwinRow({
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
      className={cn(row, destructive && destructiveRow, checked && checkRow, radio && radioRow, sub && subRow, className)}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarTriggerTwin,
  MenubarTwin,
  MenubarTwinRow,
}
