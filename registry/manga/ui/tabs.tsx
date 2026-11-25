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

const TabsVariantContext = React.createContext<TabsVariant>("index")

export type TabsProps = React.ComponentProps<typeof ShadcnTabs> & {
  /**
   * index: tabs resting on the top edge of a framed panel, the active tab an ink flat merging with it ·
   * underline: one baseline, a thick bar under the active tab ·
   * boxed: one frame split into cells, the active cell an ink flat
   */
  variant?: TabsVariant
}

function Tabs({ variant = "index", className, ...props }: TabsProps) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <ShadcnTabs
        data-manga="tabs"
        data-tabs-variant={variant}
        className={cn("group/mtabs gap-0", className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
}

const listVariants: Record<TabsVariant, string> = {
  // The line under the tabs is the panel's own 3px top edge (G1, see TabsContent).
  index:
    "relative z-10 w-fit items-end gap-1 ps-3 group-data-[orientation=vertical]/mtabs:items-stretch group-data-[orientation=vertical]/mtabs:ps-0 group-data-[orientation=vertical]/mtabs:pt-3",
  underline:
    "w-full justify-start gap-5 border-b-[length:var(--mg-bw)] border-border group-data-[orientation=vertical]/mtabs:w-fit group-data-[orientation=vertical]/mtabs:items-stretch group-data-[orientation=vertical]/mtabs:gap-2 group-data-[orientation=vertical]/mtabs:border-b-0 group-data-[orientation=vertical]/mtabs:border-e-[length:var(--mg-bw)]",
  boxed: "w-fit items-stretch gap-0 border-[length:var(--mg-bw)] border-border bg-background",
}

function TabsList({ className, ...props }: React.ComponentProps<typeof ShadcnTabsList>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <ShadcnTabsList
      data-manga="tabs-list"
      className={cn(
        "h-auto! rounded-(--radius) bg-transparent p-0 text-foreground group-data-[orientation=vertical]/mtabs:flex-col",
        listVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

// G2: the selected tab is an ink flat that sweeps in over three frames (fill-in).
const flat = "aria-selected:ink-fill aria-selected:fill-in aria-selected:text-primary-foreground! aria-selected:bg-primary!"

const triggerVariants: Record<TabsVariant, string> = {
  // Same height for every tab. The active flat sits on the panel's ink edge, so they read as one.
  // Hover: a heavier top line (no tone shadow per tab: see AGENTS.md, special cases).
  index: [
    "h-10! -mb-[3px] border-[length:var(--mg-bw)] border-b-[3px] border-border bg-background! px-4 hover:border-t-4",
    flat,
    "aria-selected:border-primary aria-selected:hover:border-t-[length:var(--mg-bw)]",
    "group-data-[orientation=vertical]/mtabs:h-auto! group-data-[orientation=vertical]/mtabs:mb-0 group-data-[orientation=vertical]/mtabs:-me-[3px] group-data-[orientation=vertical]/mtabs:justify-start group-data-[orientation=vertical]/mtabs:border-b-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:border-e-[3px] group-data-[orientation=vertical]/mtabs:py-2 group-data-[orientation=vertical]/mtabs:hover:border-t-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:hover:border-s-4",
    "data-disabled:border-dashed data-disabled:[border-bottom-style:solid] data-disabled:tone-frame data-disabled:[--frame-w:4px] data-disabled:hover:border-t-[length:var(--mg-bw)]",
  ].join(" "),
  // One baseline; the active tab gets a thick bar that grows in three frames (G2).
  // Hover (G3, frameless): a thin bar. Disabled: a dashed one.
  underline: [
    "relative border-0 bg-transparent! px-1 pt-1 pb-2",
    "after:block! after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[calc(var(--mg-bw)+1.5px)] after:h-[5px] after:origin-left rtl:after:origin-right after:scale-x-0 after:bg-foreground after:opacity-100! after:transition-none!",
    "hover:after:scale-x-100 hover:after:h-0.5 hover:after:bottom-0.5",
    "aria-selected:after:scale-x-100 aria-selected:after:h-[5px] aria-selected:after:-bottom-[calc(var(--mg-bw)+1.5px)] aria-selected:after:animate-bar-in",
    "data-disabled:after:scale-x-100 data-disabled:after:h-0 data-disabled:after:bottom-0.5 data-disabled:after:border-b-2 data-disabled:after:border-dashed data-disabled:after:border-foreground data-disabled:after:bg-transparent",
    "group-data-[orientation=vertical]/mtabs:justify-start group-data-[orientation=vertical]/mtabs:pe-3 group-data-[orientation=vertical]/mtabs:after:inset-x-auto group-data-[orientation=vertical]/mtabs:after:inset-y-0 group-data-[orientation=vertical]/mtabs:after:-end-[calc(var(--mg-bw)+1.5px)] group-data-[orientation=vertical]/mtabs:after:h-auto group-data-[orientation=vertical]/mtabs:after:w-[5px] group-data-[orientation=vertical]/mtabs:after:origin-top group-data-[orientation=vertical]/mtabs:after:scale-x-100 group-data-[orientation=vertical]/mtabs:after:scale-y-0 group-data-[orientation=vertical]/mtabs:aria-selected:after:scale-y-100 group-data-[orientation=vertical]/mtabs:hover:after:scale-y-100 group-data-[orientation=vertical]/mtabs:hover:after:w-0.5",
  ].join(" "),
  // One frame, cells split by a line, the active cell an ink flat (G2). Hover (G3, cells of a group): the line thickens.
  boxed: [
    "relative border-0 border-s-[length:var(--mg-bw)] border-border bg-background! px-4 py-1.5 first:border-s-0",
    flat,
    "hover-thicken aria-selected:hover:shadow-none",
    "group-data-[orientation=vertical]/mtabs:justify-start group-data-[orientation=vertical]/mtabs:border-s-0 group-data-[orientation=vertical]/mtabs:border-t-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:first:border-t-0",
    "data-disabled:underline data-disabled:decoration-dashed data-disabled:decoration-2 data-disabled:underline-offset-4 data-disabled:hover:shadow-none",
  ].join(" "),
}

// Active tab: Radix and Base UI both set aria-selected="true".
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnTabsTrigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <ShadcnTabsTrigger
      data-manga="tabs-trigger"
      className={cn(
        "h-auto flex-none rounded-(--radius) font-letter text-base tracking-wide text-foreground! uppercase transition-none",
        variant !== "underline" && "after:hidden",
        "shadow-none group-data-[variant=default]/tabs-list:data-active:shadow-none",
        "focus-visible:z-20 focus-visible:ring-0 focus-ink active:translate-y-px",
        "disabled:pointer-events-auto disabled:opacity-100 aria-disabled:pointer-events-auto aria-disabled:opacity-100 data-disabled:cursor-not-allowed data-disabled:active:translate-y-0",
        triggerVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

// G5: the panel enters like a sliding case, in three steps from the inline end
// (from the inline start in RTL writing or manga reading order).
function TabsContent({ className, children, ...props }: React.ComponentProps<typeof ShadcnTabsContent>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <ShadcnTabsContent
      data-manga="tabs-content"
      className={cn(
        "text-base",
        variant === "index"
          ? "overflow-hidden border-ink-panel bg-background p-4"
          : "pt-4 group-data-[orientation=vertical]/mtabs:ps-4 group-data-[orientation=vertical]/mtabs:pt-0",
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
