"use client"

import * as React from "react"
import { cn } from "cn"

import {
  ButtonGroup as ShadcnButtonGroup,
  ButtonGroupSeparator as ShadcnButtonGroupSeparator,
  ButtonGroupText as ShadcnButtonGroupText,
} from "@/components/ui/button-group"

/*
 * Buttons (the kit Button, or Input) joined in one row or column. Shared edges collapse to one 2px line:
 * the stock rules drop the second border, and a button in front of a separator gives up its edge to the
 * separator, which is the ink rule. Focus stays inside its own button (never over a neighbour).
 */
function ButtonGroup({ className, orientation = "horizontal", ...props }: React.ComponentProps<typeof ShadcnButtonGroup>) {
  return (
    <ShadcnButtonGroup
      data-manga="button-group"
      orientation={orientation}
      className={cn(
        "rounded-(--radius) items-stretch",
        "*:focus-visible:outline-solid! *:focus-visible:outline-ring! *:focus-visible:outline-2! *:focus-visible:outline-offset-[-5px]! *:focus-visible:shadow-none!",
        "[&[data-orientation=horizontal]>:has(+[data-slot=button-group-separator])]:border-e-0",
        "[&[data-orientation=vertical]>:has(+[data-slot=button-group-separator])]:border-b-0",
        className,
      )}
      {...props}
    />
  )
}

/** The ink rule between two buttons: a 2px line, no screentone, no grey. */
function ButtonGroupSeparator({ className, orientation = "vertical", ...props }: React.ComponentProps<typeof ShadcnButtonGroupSeparator>) {
  return (
    <ShadcnButtonGroupSeparator
      data-manga="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-border data-horizontal:mx-0 data-horizontal:h-[length:var(--mg-bw)] data-horizontal:w-auto data-vertical:my-0 data-vertical:w-[length:var(--mg-bw)] data-vertical:h-auto",
        className,
      )}
      {...props}
    />
  )
}

/** A label cell in the group: paper with the same 2px line, lettering instead of a grey fill. */
function ButtonGroupText({ className, ...props }: React.ComponentProps<typeof ShadcnButtonGroupText>) {
  return (
    <ShadcnButtonGroupText
      data-manga="button-group-text"
      className={cn("border-[length:var(--mg-bw)] border-border bg-background font-letter text-sm tracking-wide uppercase text-foreground", className)}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
