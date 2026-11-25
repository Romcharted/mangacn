"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Tabs as ShadcnTabs,
  TabsContent as ShadcnTabsContent,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
} from "@/components/ui/tabs"

export type TabsVariant = "index" | "underline" | "boxed"
type Orientation = "horizontal" | "vertical"

const TabsContext = React.createContext<{ variant: TabsVariant; orientation: Orientation }>({
  variant: "index",
  orientation: "horizontal",
})

export type TabsProps = React.ComponentProps<typeof ShadcnTabs> & {
  /**
   * index: tabs resting on the top edge of a framed panel, the active tab an ink flat merging with it ·
   * underline: one 2px baseline, a bar on it under the active tab ·
   * boxed: one frame split into cells, the active cell an ink flat
   */
  variant?: TabsVariant
}

function Tabs({ variant = "index", orientation = "horizontal", className, ...props }: TabsProps) {
  const value = React.useMemo(() => ({ variant, orientation: orientation as Orientation }), [variant, orientation])
  return (
    <TabsContext.Provider value={value}>
      <ShadcnTabs
        data-manga="tabs"
        data-tabs-variant={variant}
        orientation={orientation}
        className={cn("group/mtabs gap-0", className)}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const listVariants: Record<TabsVariant, Record<Orientation, string>> = {
  // The line under the tabs is the panel's own 3px top edge (G1, see TabsContent).
  index: {
    horizontal: "relative z-10 w-fit items-end gap-1 ps-3",
    vertical: "relative z-10 w-fit items-stretch gap-1 pt-3",
  },
  // The 2px baseline every bar rests on.
  underline: {
    horizontal: "w-full justify-start gap-4 border-b-2 border-border",
    vertical: "w-fit items-stretch gap-1 border-e-2 border-border",
  },
  boxed: {
    horizontal: "w-fit items-stretch gap-0 border-[length:var(--mg-bw)] border-border bg-background",
    vertical: "w-fit items-stretch gap-0 border-[length:var(--mg-bw)] border-border bg-background",
  },
}

/*
 * shadcn's Tabs (Radix and Base UI alike) reads `orientation` but does not hand it to the primitive, so
 * a vertical list would announce and behave as horizontal. The list says it is vertical itself and
 * moves with the up / down arrows (selecting like a click, which both libraries honour).
 */
function moveVertically(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
    (t) => !t.hasAttribute("disabled") && t.getAttribute("aria-disabled") !== "true" && !t.hasAttribute("data-disabled"),
  )
  const at = tabs.indexOf(document.activeElement as HTMLElement)
  if (at < 0) return
  event.preventDefault()
  const next = tabs[(at + (event.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length]
  next.focus()
  next.click()
}

function TabsList({ className, onKeyDown, ...props }: React.ComponentProps<typeof ShadcnTabsList>) {
  const { variant, orientation } = React.useContext(TabsContext)
  const vertical = orientation === "vertical"
  return (
    <ShadcnTabsList
      data-manga="tabs-list"
      {...(vertical ? { "aria-orientation": "vertical" as const, "data-orientation": "vertical" } : {})}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event as never)
        if (vertical && !event.defaultPrevented) moveVertically(event)
      }}
      className={cn(
        "h-auto! rounded-(--radius) bg-transparent p-0 text-foreground",
        vertical && "flex-col",
        listVariants[variant][orientation],
        className,
      )}
      {...props}
    />
  )
}

// G2: the selected tab is an ink flat that sweeps in over three frames (fill-in).
const flat = "aria-selected:ink-fill aria-selected:fill-in aria-selected:text-primary-foreground! aria-selected:bg-primary!"

// Hover acts only on a tab that is neither selected nor disabled: [&:hover:not([aria-selected=true]):not([data-disabled])].
// Written out in full each time, so Tailwind sees every class.

/*
 * Underline: every bar rests on the 2px baseline (its outer edge on the baseline's outer edge, whole
 * pixels): hover thickens the line to 4px under the tab, the selected tab gets 6px that grows in three
 * frames (G2). Disabled: no bar, the label is underlined with dashes. The bar's geometry is !important:
 * shadcn's trigger draws its own line with group-data-horizontal/tabs:after:* variants, which would win.
 */
const underline: Record<Orientation, string> = {
  horizontal: [
    "relative border-0 bg-transparent! px-2 pt-1.5 pb-2.5",
    "after:block! after:pointer-events-none after:absolute after:inset-x-0! after:top-auto! after:-bottom-[2px]! after:h-1.5! after:w-auto! after:origin-left rtl:after:origin-right after:scale-x-0 after:bg-foreground after:opacity-100! after:transition-none!",
    "[&:hover:not([aria-selected=true]):not([data-disabled])]:after:scale-x-100 [&:hover:not([aria-selected=true]):not([data-disabled])]:after:h-1!",
    "aria-selected:after:scale-x-100 aria-selected:after:animate-bar-in",
  ].join(" "),
  vertical: [
    "relative justify-start border-0 bg-transparent! py-1.5 ps-1 pe-4",
    "after:block! after:pointer-events-none after:absolute after:inset-y-0! after:start-auto! after:-end-[2px]! after:h-auto! after:w-1.5! after:origin-top after:scale-y-0 after:bg-foreground after:opacity-100! after:transition-none! after:[--bar-from:1_0.34] after:[--bar-mid:1_0.67]",
    "[&:hover:not([aria-selected=true]):not([data-disabled])]:after:scale-y-100 [&:hover:not([aria-selected=true]):not([data-disabled])]:after:w-1!",
    "aria-selected:after:scale-y-100 aria-selected:after:animate-bar-in",
  ].join(" "),
}

const triggerVariants: Record<TabsVariant, Record<Orientation, string>> = {
  // Same height for every tab. The active flat sits on the panel's ink edge, so they read as one.
  // Hover: a heavier outer line (no tone shadow per tab: see AGENTS.md, special cases).
  index: {
    horizontal: [
      "h-10! -mb-[3px] border-2 border-b-[3px] border-border bg-background! px-4",
      "[&:hover:not([aria-selected=true]):not([data-disabled])]:border-t-4",
      flat,
      "aria-selected:border-primary",
      "data-disabled:border-dashed data-disabled:[border-bottom-style:solid] data-disabled:tone-frame data-disabled:[--frame-w:4px]",
    ].join(" "),
    vertical: [
      "-me-[3px] justify-start border-2 border-e-[3px] border-border bg-background! px-4 py-2",
      "[&:hover:not([aria-selected=true]):not([data-disabled])]:border-s-4",
      flat,
      "aria-selected:border-primary",
      "data-disabled:border-dashed data-disabled:[border-inline-end-style:solid] data-disabled:tone-frame data-disabled:[--frame-w:4px]",
    ].join(" "),
  },
  underline: {
    horizontal: underline.horizontal,
    vertical: underline.vertical,
  },
  // One frame, cells split by a line, the active cell an ink flat (G2). Hover (G3, cells of a group): the line thickens.
  boxed: {
    horizontal: ["relative border-0 border-s-[length:var(--mg-bw)] border-border bg-background! px-4 py-2 first:border-s-0", flat, "hover-thicken aria-selected:hover:shadow-none"].join(" "),
    vertical: ["relative justify-start border-0 border-t-[length:var(--mg-bw)] border-border bg-background! px-4 py-2 first:border-t-0", flat, "hover-thicken aria-selected:hover:shadow-none"].join(" "),
  },
}

// Focus stays inside the tab: it never overlaps a neighbour or the panel.
const focusInside: Record<TabsVariant, string> = {
  index: "focus-visible:outline-2! focus-visible:outline-offset-[-6px]! focus-visible:shadow-none!",
  underline: "focus-visible:outline-2! focus-visible:outline-offset-[-2px]! focus-visible:shadow-none!",
  boxed: "focus-visible:outline-2! focus-visible:outline-offset-[-5px]! focus-visible:shadow-none!",
}

// Active tab: Radix and Base UI both set aria-selected="true".
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnTabsTrigger>) {
  const { variant, orientation } = React.useContext(TabsContext)
  return (
    <ShadcnTabsTrigger
      data-manga="tabs-trigger"
      className={cn(
        "h-auto flex-none rounded-(--radius) font-letter text-base tracking-wide text-foreground! uppercase transition-none",
        variant !== "underline" && "after:hidden",
        "shadow-none group-data-[variant=default]/tabs-list:data-active:shadow-none",
        "focus-visible:z-20 focus-visible:ring-0 focus-ink active:translate-y-px",
        focusInside[variant],
        "disabled:pointer-events-auto disabled:opacity-100 aria-disabled:pointer-events-auto aria-disabled:opacity-100 data-disabled:cursor-not-allowed data-disabled:active:translate-y-0",
        triggerVariants[variant][orientation],
        variant !== "index" &&
          "data-disabled:after:hidden! data-disabled:underline data-disabled:decoration-dashed data-disabled:decoration-2 data-disabled:underline-offset-4 data-disabled:hover:shadow-none",
        className,
      )}
      {...props}
    />
  )
}

// G5: the panel enters like a sliding case, in three steps from the inline end
// (from the inline start in RTL writing or manga reading order).
function TabsContent({ className, children, ...props }: React.ComponentProps<typeof ShadcnTabsContent>) {
  const { variant, orientation } = React.useContext(TabsContext)
  return (
    <ShadcnTabsContent
      data-manga="tabs-content"
      className={cn(
        "text-base",
        variant === "index" ? "overflow-hidden border-ink-panel bg-background p-4" : orientation === "vertical" ? "ps-4" : "pt-4",
        className,
      )}
      {...props}
    >
      <div data-manga="tabs-panel" className="animate-slide-in rtl:[--slide-dir:-1] reading-rtl:[--slide-dir:-1]">
        {children}
      </div>
    </ShadcnTabsContent>
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
