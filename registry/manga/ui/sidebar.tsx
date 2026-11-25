"use client"

/*
 * Grammar: the panel is a case (G1) with a 3px ink edge on its open side, like Sheet. Rows are frameless
 * and invert to ink on hover (G3); the current row is an ink flat that sweeps in (G2, like Tabs). Labels are
 * underlined lettering. Clicks hit (G4). Badges are paper plates with an ink frame. The trigger and the rail
 * are ink. Collapsed: square icon cells. On mobile the panel is a sheet that slides in (G5).
 */
import * as React from "react"
import { cn } from "cn"

import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarGroup as ShadcnSidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel as ShadcnSidebarGroupLabel,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarInput as ShadcnSidebarInput,
  SidebarInset as ShadcnSidebarInset,
  SidebarMenu as ShadcnSidebarMenu,
  SidebarMenuAction as ShadcnSidebarMenuAction,
  SidebarMenuBadge as ShadcnSidebarMenuBadge,
  SidebarMenuButton as ShadcnSidebarMenuButton,
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub as ShadcnSidebarMenuSub,
  SidebarMenuSubButton as ShadcnSidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail as ShadcnSidebarRail,
  SidebarSeparator as ShadcnSidebarSeparator,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar as useShadcnSidebar,
} from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { withImpact } from "@/lib/manga/gestures"

const MOBILE_WIDTH = "18rem"

// The 3px panel edge on the open side (the sheet's own edge, drawn on the desktop container too).
const edge = "border-border group-data-[side=left]:border-e-[length:var(--mg-bw-panel)] group-data-[side=right]:border-s-[length:var(--mg-bw-panel)]"

// Mobile: the kit Sheet look. Offset second frame on the open side, slides in over three steps.
const sheetLook = [
  "gap-0 border-0 bg-sidebar p-0 text-sidebar-foreground shadow-none transition-none duration-0 [&>button]:hidden",
  "border-border data-[side=left]:border-e-[length:var(--mg-bw-panel)] data-[side=right]:border-s-[length:var(--mg-bw-panel)]",
  "data-[side=left]:shadow-[8px_0_0_-2px_var(--background),8px_0_0_0_var(--foreground)] data-[side=right]:shadow-[-8px_0_0_-2px_var(--background),-8px_0_0_0_var(--foreground)]",
  "data-starting-style:opacity-100 data-ending-style:opacity-100 data-open:animate-sheet-in data-[state=open]:animate-sheet-in data-closed:animate-none data-[state=closed]:animate-none",
  "data-[side=left]:[--sheet-x:-100%] data-[side=right]:[--sheet-x:100%]",
].join(" ")

function Sidebar({ className, dir, ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
  const { isMobile, openMobile, setOpenMobile } = useShadcnSidebar()
  const { side = "left", collapsible = "offcanvas", children } = props

  if (isMobile && collapsible !== "none") {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          dir={dir}
          data-manga="sidebar"
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          side={side}
          className={cn("w-(--sidebar-width)", sheetLook, className)}
          style={{ "--sidebar-width": MOBILE_WIDTH } as React.CSSProperties}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return <ShadcnSidebar data-manga="sidebar" dir={dir} className={cn(edge, className)} {...props} />
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof ShadcnSidebarTrigger>) {
  return (
    <ShadcnSidebarTrigger
      data-manga="sidebar-trigger"
      className={cn(
        "size-8 rounded-(--radius) border-2 border-border bg-primary text-primary-foreground shadow-none transition-none focus-visible:ring-0 focus-ink",
        "hover:bg-background hover:text-foreground dark:hover:bg-background data-[impact]:animate-hit",
        className,
      )}
      onClick={withImpact(onClick) as typeof onClick}
      {...props}
    />
  )
}

// The rail is an ink line on the panel's edge; it thickens on hover (G3).
function SidebarRail({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarRail>) {
  return (
    <ShadcnSidebarRail
      data-manga="sidebar-rail"
      className={cn("after:w-[3px] after:bg-border hover:after:w-[6px] hover:after:bg-border hover:bg-transparent", className)}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarInset>) {
  return <ShadcnSidebarInset data-manga="sidebar-inset" className={cn("bg-background", className)} {...props} />
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarInput>) {
  return (
    <ShadcnSidebarInput
      data-manga="sidebar-input"
      className={cn(
        "h-8 rounded-(--radius) border-2 border-input bg-background shadow-none focus-visible:border-ring focus-visible:ring-0 focus-ink",
        className,
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarHeader>) {
  return (
    <ShadcnSidebarHeader
      data-manga="sidebar-header"
      className={cn("border-b-[length:var(--mg-bw)] border-border p-3", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarFooter>) {
  return (
    <ShadcnSidebarFooter
      data-manga="sidebar-footer"
      className={cn("border-t-[length:var(--mg-bw)] border-border p-3", className)}
      {...props}
    />
  )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarSeparator>) {
  return (
    <ShadcnSidebarSeparator
      data-manga="sidebar-separator"
      className={cn("mx-2 w-auto bg-border h-[length:var(--mg-bw-fine)]", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarContent>) {
  return <ShadcnSidebarContent data-manga="sidebar-content" className={cn("py-1", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarGroup>) {
  return <ShadcnSidebarGroup data-manga="sidebar-group" className={cn("p-2", className)} {...props} />
}

// Group labels: underlined lettering on paper, as the Select labels.
function SidebarGroupLabel({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarGroupLabel>) {
  return (
    <ShadcnSidebarGroupLabel
      data-manga="sidebar-group-label"
      className={cn(
        "h-auto px-2 pt-2 pb-1 font-letter text-sm tracking-wide text-foreground uppercase underline decoration-2 underline-offset-4",
        className,
      )}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarMenu>) {
  return <ShadcnSidebarMenu data-manga="sidebar-menu" className={cn("gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarMenuItem>) {
  return <ShadcnSidebarMenuItem data-manga="sidebar-menu-item" className={cn(className)} {...props} />
}

/*
 * A row: frameless, inverts on hover (G3). Current (data-active, set by both libraries as "true" or an
 * empty attribute) is an ink flat that sweeps in (G2). Disabled: dashed frame and tone frame, label on paper.
 * Every row is a click (G4): the press hits and the row negates for a frame.
 */
const row = [
  "relative min-w-0 h-9 w-full items-center gap-2 overflow-visible rounded-(--radius) border-2 border-transparent px-2.5 text-start",
  "font-letter text-base tracking-wide uppercase text-foreground transition-none outline-hidden focus-ink focus-visible:ring-0",
  "hover:bg-foreground hover:text-background [&_svg]:size-4 [&_svg]:shrink-0",
  "data-[active=true]:ink-fill data-[active=true]:fill-in data-[active=true]:font-normal",
  "data-[active='']:ink-fill data-[active='']:fill-in data-[active='']:font-normal",
  "data-[impact]:animate-hit group-data-[collapsible=icon]:overflow-hidden",
  "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100 disabled:tone-frame disabled:[--frame-w:4px] disabled:border-dashed disabled:border-border disabled:hover:bg-transparent disabled:hover:text-foreground",
  "aria-disabled:pointer-events-auto aria-disabled:opacity-100",
].join(" ")

function SidebarMenuButton({ className, onClick, ...props }: React.ComponentProps<typeof ShadcnSidebarMenuButton>) {
  return (
    <ShadcnSidebarMenuButton
      data-manga="sidebar-menu-button"
      className={cn(row, className)}
      onClick={withImpact(onClick) as typeof onClick}
      {...props}
    />
  )
}

function SidebarMenuAction({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarMenuAction>) {
  return (
    <ShadcnSidebarMenuAction
      data-manga="sidebar-menu-action"
      className={cn(
        "rounded-(--radius) text-foreground hover:bg-transparent hover:text-foreground hover-thicken data-[impact]:animate-hit",
        className,
      )}
      {...props}
    />
  )
}

// Badges: a paper plate with an ink frame, lettering inside (they stay visible on an inverted or ink row).
function SidebarMenuBadge({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarMenuBadge>) {
  return (
    <ShadcnSidebarMenuBadge
      data-manga="sidebar-menu-badge"
      className={cn(
        "h-5 min-w-5 rounded-(--radius) border-2 border-foreground bg-background px-1 font-letter text-sm leading-none tracking-wide text-foreground tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

// Nested rows sit on a 2px ink line, as a list inside a case.
function SidebarMenuSub({ className, ...props }: React.ComponentProps<typeof ShadcnSidebarMenuSub>) {
  return (
    <ShadcnSidebarMenuSub
      data-manga="sidebar-menu-sub"
      className={cn("mx-3.5 gap-1 border-s-[length:var(--mg-bw)] border-border px-2.5 py-0.5", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({ className, onClick, ...props }: React.ComponentProps<typeof ShadcnSidebarMenuSubButton>) {
  return (
    <ShadcnSidebarMenuSubButton
      data-manga="sidebar-menu-sub-button"
      className={cn(row, "h-8 text-sm", className)}
      onClick={withImpact(onClick) as typeof onClick}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useShadcnSidebar as useSidebar,
}
