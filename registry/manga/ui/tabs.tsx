import * as React from "react"
import { cn } from "cn"

import {
  Tabs as ShadcnTabs,
  TabsContent as ShadcnTabsContent,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
} from "@/components/ui/tabs"

export type TabsVariant = "index" | "underline" | "pills"

const TabsVariantContext = React.createContext<TabsVariant>("index")

export type TabsProps = React.ComponentProps<typeof ShadcnTabs> & {
  /** index: chapter dividers · underline: thick ink line · pills: boxed tabs on a light tone */
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
  index: "items-end gap-1 border-b-[length:var(--mg-bw)] border-border group-data-[orientation=vertical]/mtabs:items-stretch group-data-[orientation=vertical]/mtabs:border-b-0 group-data-[orientation=vertical]/mtabs:border-e-[length:var(--mg-bw)]",
  underline: "gap-5 border-b-[length:var(--mg-bw)] border-border group-data-[orientation=vertical]/mtabs:gap-2 group-data-[orientation=vertical]/mtabs:border-b-0 group-data-[orientation=vertical]/mtabs:border-e-[length:var(--mg-bw)]",
  pills: "gap-1 border-[length:var(--mg-bw)] border-border bg-muted p-1",
}

function TabsList({ className, ...props }: React.ComponentProps<typeof ShadcnTabsList>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <ShadcnTabsList
      data-manga="tabs-list"
      className={cn(
        "h-auto! w-fit rounded-(--radius) bg-transparent p-0 text-foreground",
        "group-data-[orientation=vertical]/mtabs:flex-col",
        listVariants[variant],
        className,
      )}
      {...props}
    />
  )
}

const triggerVariants: Record<TabsVariant, string> = {
  index: [
    "-mb-[var(--mg-bw)] border-[length:var(--mg-bw)] border-b-0 border-border bg-background px-4 py-1.5 hover:-translate-y-0.5 hover:border-t-4",
    "group-data-[orientation=vertical]/mtabs:mb-0 group-data-[orientation=vertical]/mtabs:-me-[var(--mg-bw)] group-data-[orientation=vertical]/mtabs:border-b-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:border-e-0",
    "aria-selected:bg-primary! aria-selected:bg-none! aria-selected:pt-3 aria-selected:text-primary-foreground! aria-selected:border-primary!",
  ].join(" "),
  underline: [
    "border-0 border-b-4 border-transparent px-1 pt-1 pb-1.5 hover:border-b-foreground hover:[border-bottom-style:double] focus-visible:border-transparent",
    "group-data-[orientation=vertical]/mtabs:border-b-0 group-data-[orientation=vertical]/mtabs:border-e-4 group-data-[orientation=vertical]/mtabs:pe-3",
    "aria-selected:border-foreground! aria-selected:bg-transparent!",
  ].join(" "),
  pills:
    "border-[length:var(--mg-bw)] border-transparent bg-background px-3 py-1 hover:border-border aria-selected:bg-primary! aria-selected:bg-none! aria-selected:text-primary-foreground! aria-selected:border-primary!",
}

// Active tab: Radix and Base UI both set aria-selected="true".
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnTabsTrigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <ShadcnTabsTrigger
      data-manga="tabs-trigger"
      className={cn(
        "h-auto flex-none rounded-(--radius) font-letter text-base tracking-wide text-foreground! uppercase shadow-none transition-none after:hidden",
        "focus-visible:ring-0 focus-ink active:animate-impact aria-selected:[text-shadow:none]!",
        "data-disabled:border-dashed data-disabled:border-border data-disabled:opacity-100 disabled:opacity-100 aria-disabled:opacity-100 data-disabled:tone-frame data-disabled:[--frame-w:4px] data-disabled:cursor-not-allowed data-disabled:hover:translate-y-0",
        triggerVariants[variant],
        "aria-selected:text-primary-foreground!",
        variant === "underline" && "aria-selected:text-foreground!",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof ShadcnTabsContent>) {
  return <ShadcnTabsContent className={cn("pt-4 text-base", "group-data-[orientation=vertical]/mtabs:ps-4 group-data-[orientation=vertical]/mtabs:pt-0", className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
