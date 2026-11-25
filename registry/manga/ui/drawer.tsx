"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Drawer,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
  DrawerContent as ShadcnDrawerContent,
  DrawerDescription as ShadcnDrawerDescription,
  DrawerFooter as ShadcnDrawerFooter,
  DrawerHeader as ShadcnDrawerHeader,
  DrawerTitle as ShadcnDrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

/*
 * Gestures: G1 case docked to an edge (like Sheet: paper, 3px line on the open side, an offset second frame
 * thrown onto the page), G5 slide. The grab handle is a 2px ink bar with square ends; the title is lettering;
 * the footer sits above a 2px rule. The veil comes from base.
 * Both libraries drive the slide and the drag with transforms: the wrapper keeps them and only makes the
 * timing stepped (steps(5), ~11 fps), so dragging still follows the finger.
 * The side comes from Base UI (data-swipe-direction on the popup) or vaul (data-vaul-drawer-direction).
 */

// Shared by DrawerContent and the static twin DrawerCard.
const surface = "bg-popover text-base! text-popover-foreground border-border outline-none rounded-(--radius)! [filter:none]!"

const title = "font-letter text-2xl! leading-tight font-normal! tracking-wide text-foreground uppercase"
const description = "text-base! text-foreground!"
const footer = "border-t-[length:var(--mg-bw)] border-border pt-4!"

const sides = {
  // open side up: 3px line on top, the offset frame above it
  bottom: "border-t-[length:var(--mg-bw-panel)] shadow-[0_-8px_0_-2px_var(--background),0_-8px_0_0_var(--foreground)]",
  top: "border-b-[length:var(--mg-bw-panel)] shadow-[0_8px_0_-2px_var(--background),0_8px_0_0_var(--foreground)]",
  left: "border-e-[length:var(--mg-bw-panel)] shadow-[8px_0_0_-2px_var(--background),8px_0_0_0_var(--foreground)]",
  right: "border-s-[length:var(--mg-bw-panel)] shadow-[-8px_0_0_-2px_var(--background),-8px_0_0_0_var(--foreground)]",
} as const

const content = [
  surface,
  // Base UI (swipe-direction on the popup)
  "data-[swipe-direction=down]:border-t-[length:var(--mg-bw-panel)]! data-[swipe-direction=down]:shadow-[0_-8px_0_-2px_var(--background),0_-8px_0_0_var(--foreground)]!",
  "data-[swipe-direction=up]:border-b-[length:var(--mg-bw-panel)]! data-[swipe-direction=up]:shadow-[0_8px_0_-2px_var(--background),0_8px_0_0_var(--foreground)]!",
  "data-[swipe-direction=left]:border-e-[length:var(--mg-bw-panel)]! data-[swipe-direction=left]:shadow-[8px_0_0_-2px_var(--background),8px_0_0_0_var(--foreground)]!",
  "data-[swipe-direction=right]:border-s-[length:var(--mg-bw-panel)]! data-[swipe-direction=right]:shadow-[-8px_0_0_-2px_var(--background),-8px_0_0_0_var(--foreground)]!",
  // vaul (Radix version)
  "data-[vaul-drawer-direction=bottom]:border-t-[length:var(--mg-bw-panel)]! data-[vaul-drawer-direction=bottom]:shadow-[0_-8px_0_-2px_var(--background),0_-8px_0_0_var(--foreground)]!",
  "data-[vaul-drawer-direction=top]:border-b-[length:var(--mg-bw-panel)]! data-[vaul-drawer-direction=top]:shadow-[0_8px_0_-2px_var(--background),0_8px_0_0_var(--foreground)]!",
  "data-[vaul-drawer-direction=left]:border-r-[length:var(--mg-bw-panel)]! data-[vaul-drawer-direction=left]:shadow-[8px_0_0_-2px_var(--background),8px_0_0_0_var(--foreground)]!",
  "data-[vaul-drawer-direction=right]:border-l-[length:var(--mg-bw-panel)]! data-[vaul-drawer-direction=right]:shadow-[-8px_0_0_-2px_var(--background),-8px_0_0_0_var(--foreground)]!",
  // Opening and closing: stepped timing on the library's own transform (transition in Base UI, transition +
  // keyframes in vaul). Dragging: the drawer follows the finger with no steps and no delay (grammar rule:
  // what a finger drags follows the finger). Base UI marks the drag with data-swiping; vaul sets an inline
  // `transition: none` while dragging.
  "ease-[steps(5)]! [animation-timing-function:steps(5)]! motion-reduce:transition-none! motion-reduce:animate-none!",
  "data-swiping:transition-none! data-swiping:animate-none!",
  // grab handle, Base UI: the swipe handle draws its bar with ::after
  "[&>[data-slot=drawer-swipe-handle]]:after:rounded-(--radius)! [&>[data-slot=drawer-swipe-handle]]:after:bg-foreground!",
  "data-[swipe-axis=y]:[&>[data-slot=drawer-swipe-handle]]:h-5! data-[swipe-axis=y]:[&>[data-slot=drawer-swipe-handle]]:after:h-0.5! data-[swipe-axis=y]:[&>[data-slot=drawer-swipe-handle]]:after:w-16!",
  "data-[swipe-axis=x]:[&>[data-slot=drawer-swipe-handle]]:w-5! data-[swipe-axis=x]:[&>[data-slot=drawer-swipe-handle]]:after:w-0.5! data-[swipe-axis=x]:[&>[data-slot=drawer-swipe-handle]]:after:h-16!",
  // grab handle, vaul: the first child without a data-slot (shown on bottom drawers only)
  "[&>div:first-child:not([data-slot])]:h-0.5 [&>div:first-child:not([data-slot])]:w-16 [&>div:first-child:not([data-slot])]:rounded-(--radius) [&>div:first-child:not([data-slot])]:bg-foreground",
].join(" ")

function DrawerContent({ className, ...props }: React.ComponentProps<typeof ShadcnDrawerContent>) {
  return <ShadcnDrawerContent data-manga="drawer" className={cn(content, className)} {...props} />
}

function DrawerHeader({ className, ...props }: React.ComponentProps<typeof ShadcnDrawerHeader>) {
  return <ShadcnDrawerHeader className={cn("gap-1", className)} {...props} />
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof ShadcnDrawerTitle>) {
  return <ShadcnDrawerTitle className={cn(title, className)} {...props} />
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof ShadcnDrawerDescription>) {
  return <ShadcnDrawerDescription className={cn(description, className)} {...props} />
}

function DrawerFooter({ className, ...props }: React.ComponentProps<typeof ShadcnDrawerFooter>) {
  return <ShadcnDrawerFooter className={cn(footer, className)} {...props} />
}

export type DrawerCardProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The edge the drawer is docked to; the 3px line and the offset frame go on the opposite (open) side. */
  side?: "bottom" | "top" | "left" | "right"
  /** Shows the grab handle (bottom and top only). */
  handle?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  /** Actions shown above a 2px rule. */
  footer?: React.ReactNode
}

/** A static look-alike of an open drawer (no portal, no veil), for frozen states and previews. */
function DrawerCard({ side = "bottom", handle = true, title: t, description: d, footer: f, className, children, ...props }: DrawerCardProps) {
  const axisY = side === "bottom" || side === "top"
  return (
    <div data-manga="drawer-card" data-side={side} className={cn("relative flex flex-col", surface, sides[side], className)} {...props}>
      {handle && side === "bottom" && <div aria-hidden className="mx-auto mt-4 h-0.5 w-16 shrink-0 bg-foreground" />}
      {(t || d) && (
        <div className={cn("flex flex-col gap-1 p-4", axisY && "text-center")}>
          {t && <h2 className={title}>{t}</h2>}
          {d && <p className={description}>{d}</p>}
        </div>
      )}
      {children}
      {f && <div className={cn("mt-auto flex flex-col gap-2 p-4", footer)}>{f}</div>}
      {handle && side === "top" && <div aria-hidden className="mx-auto mb-4 h-0.5 w-16 shrink-0 bg-foreground" />}
    </div>
  )
}

export { Drawer, DrawerCard, DrawerClose, DrawerContent, DrawerOverlay, DrawerPortal, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger }
