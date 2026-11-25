import * as React from "react"
import { cn } from "cn"

import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuContent as ShadcnNavigationMenuContent,
  NavigationMenuIndicator as ShadcnNavigationMenuIndicator,
  NavigationMenuItem as ShadcnNavigationMenuItem,
  NavigationMenuLink as ShadcnNavigationMenuLink,
  NavigationMenuList as ShadcnNavigationMenuList,
  NavigationMenuTrigger as ShadcnNavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

/*
 * Grammar: top-level triggers are frameless lettering. The open trigger is an ink flat that sweeps in (G2)
 * and its brush chevron turns in two steps (G8). The panel is a case (G1) that pops in (G5). Links hover
 * with a thick underline (G3, frameless); the current link is an ink flat (G2). The indicator notch shows
 * only while a menu is open. Focus: the ink double line of focus-ink, drawn inside the shape.
 * The notch toward the trigger (G6) needs data-side on the stock viewport, which is not reachable from
 * here in both libraries, so it is left out.
 */

const focusRing = "focus-ink focus-visible:shadow-[0_0_0_2px_var(--ring),0_0_0_4px_var(--background)]!"

const triggerClasses = [
  "group/navigation-menu-trigger inline-flex h-10 w-max items-center justify-center rounded-(--radius) px-3",
  "font-letter text-lg tracking-wide text-foreground uppercase transition-none outline-none",
  "bg-transparent! hover:bg-transparent! focus:bg-transparent!",
  "decoration-transparent decoration-2 underline-offset-4 hover:underline hover:decoration-current hover:decoration-4",
  "[&>svg]:hidden after:mark-chevron after:ms-1.5 after:shrink-0 after:text-base",
  "aria-expanded:after:rotate-180 aria-expanded:after:animate-chevron",
  "aria-expanded:bg-primary! aria-expanded:hover:bg-primary! aria-expanded:focus:bg-primary! aria-expanded:text-primary-foreground! aria-expanded:ink-fill aria-expanded:fill-in",
  focusRing,
  "disabled:pointer-events-auto disabled:opacity-100 disabled:cursor-not-allowed disabled:underline disabled:decoration-dashed disabled:decoration-current",
].join(" ")

const linkClasses = [
  "flex items-center gap-2 rounded-(--radius) p-2 text-base text-foreground transition-none outline-none",
  "underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-current hover:decoration-4",
  "bg-transparent! hover:bg-transparent! focus:bg-transparent!",
  "data-[active]:ink-fill data-[active]:bg-primary! data-[active]:hover:bg-primary! data-[active]:focus:bg-primary! data-[active]:text-primary-foreground! data-[active]:decoration-transparent",
  focusRing,
].join(" ")

const contentClasses = [
  "ink-case relative m-1.5 me-3 mb-3 w-max min-w-64 p-2 text-base text-foreground",
  "animate-pop data-[motion^=from-]:animate-pop data-[motion^=to-]:animate-none",
].join(" ")

/** Trigger classes as a function, for triggers that are not built with NavigationMenuTrigger (and frozen states). */
function navigationMenuTriggerStyle(): string {
  return triggerClasses
}

/** Link classes as a function, for frozen states and plain anchors. Set data-active="" for the current link. */
function navigationMenuLinkStyle(): string {
  return linkClasses
}

function NavigationMenu({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenu>) {
  return (
    <ShadcnNavigationMenu
      data-manga="navigation-menu"
      className={cn(
        // Radix draws its viewport with a ring, a radius and a shadow: the case (NavigationMenuContent) draws them instead.
        "[&_[data-slot=navigation-menu-viewport]]:rounded-none! [&_[data-slot=navigation-menu-viewport]]:bg-transparent! [&_[data-slot=navigation-menu-viewport]]:shadow-none! [&_[data-slot=navigation-menu-viewport]]:ring-0!",
        className,
      )}
      {...props}
    />
  )
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenuList>) {
  return (
    <ShadcnNavigationMenuList
      data-manga="navigation-menu-list"
      className={cn("gap-1", className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenuItem>) {
  return (
    <ShadcnNavigationMenuItem
      data-manga="navigation-menu-item"
      className={cn("group/nm-item", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenuTrigger>) {
  return (
    <ShadcnNavigationMenuTrigger
      data-manga="navigation-menu-trigger"
      className={cn(triggerClasses, className)}
      {...props}
    />
  )
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenuContent>) {
  return (
    <ShadcnNavigationMenuContent
      data-manga="navigation-menu-content"
      className={cn(contentClasses, className)}
      {...props}
    />
  )
}

/** The panel's look without the library: a static twin for frozen states (same classes as NavigationMenuContent). */
function NavigationMenuPanel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-manga="navigation-menu-panel" className={cn(contentClasses, className)} {...props} />
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenuLink>) {
  return (
    <ShadcnNavigationMenuLink
      data-manga="navigation-menu-link"
      className={cn(linkClasses, className)}
      {...props}
    />
  )
}

function NavigationMenuIndicator({ className, ...props }: React.ComponentProps<typeof ShadcnNavigationMenuIndicator>) {
  return (
    <ShadcnNavigationMenuIndicator
      data-manga="navigation-menu-indicator"
      className={cn(
        // Only while a menu of this item is open (its trigger has aria-expanded="true").
        "hidden group-has-[[aria-expanded=true]]/nm-item:flex h-2 overflow-hidden [&>div]:rounded-none! [&>div]:bg-foreground! [&>div]:shadow-none!",
        className,
      )}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanel,
  NavigationMenuTrigger,
  navigationMenuLinkStyle,
  navigationMenuTriggerStyle,
}
