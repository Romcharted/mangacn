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
   * index: tabs resting on the top edge of a framed panel, the active one merges with it ·
   * underline: one baseline, a thick bar under the active tab ·
   * boxed: one frame split into cells, the active cell is an ink flat
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
  // The line under the tabs is the panel's own 3px top edge (see TabsContent).
  index:
    "z-10 w-fit items-end gap-1 ps-3 group-data-[orientation=vertical]/mtabs:items-stretch group-data-[orientation=vertical]/mtabs:ps-0 group-data-[orientation=vertical]/mtabs:pt-3",
  underline:
    "w-full justify-start gap-5 border-b-[length:var(--mg-bw)] border-border group-data-[orientation=vertical]/mtabs:w-fit group-data-[orientation=vertical]/mtabs:items-stretch group-data-[orientation=vertical]/mtabs:gap-2 group-data-[orientation=vertical]/mtabs:border-b-0 group-data-[orientation=vertical]/mtabs:border-e-[length:var(--mg-bw)]",
  boxed:
    "w-fit items-stretch gap-0 border-[length:var(--mg-bw)] border-border bg-background group-data-[orientation=vertical]/mtabs:items-stretch",
}

// The moving flat (boxed) or bar (underline). Measured in JS so it works with Radix and Base UI alike,
// and it travels to the new tab in three steps.
const indicatorVariants: Partial<Record<TabsVariant, string>> = {
  boxed: "top-0 left-0 h-(--ih) w-(--iw) [translate:var(--ix)_var(--iy)] bg-primary",
  underline: [
    "left-0 bottom-[calc(var(--mg-bw)*-1-1.5px)] h-[5px] w-(--iw) [translate:var(--ix)_0] bg-foreground",
    "group-data-[orientation=vertical]/mtabs:top-0 group-data-[orientation=vertical]/mtabs:bottom-auto group-data-[orientation=vertical]/mtabs:left-auto group-data-[orientation=vertical]/mtabs:end-[calc(var(--mg-bw)*-1-1.5px)] group-data-[orientation=vertical]/mtabs:h-(--ih) group-data-[orientation=vertical]/mtabs:w-[5px] group-data-[orientation=vertical]/mtabs:[translate:0_var(--iy)]",
  ].join(" "),
}

type Box = { x: number; y: number; w: number; h: number }

function TabsList({ className, children, ref, ...props }: React.ComponentProps<typeof ShadcnTabsList>) {
  const variant = React.useContext(TabsVariantContext)
  const local = React.useRef<HTMLDivElement | null>(null)
  const [box, setBox] = React.useState<Box | null>(null)
  const hasIndicator = variant in indicatorVariants

  React.useLayoutEffect(() => {
    const list = local.current
    if (!list || !hasIndicator) return
    const update = () => {
      const tab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
      setBox(tab ? { x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight } : null)
    }
    update()
    const mo = new MutationObserver(update)
    mo.observe(list, { subtree: true, attributes: true, attributeFilter: ["aria-selected"] })
    const ro = new ResizeObserver(update)
    ro.observe(list)
    return () => {
      mo.disconnect()
      ro.disconnect()
    }
  }, [hasIndicator])

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      local.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node
    },
    [ref],
  )

  return (
    <ShadcnTabsList
      ref={setRef}
      data-manga="tabs-list"
      data-indicator={box ? "on" : undefined}
      className={cn(
        "group/mlist relative h-auto! rounded-(--radius) bg-transparent p-0 text-foreground",
        "group-data-[orientation=vertical]/mtabs:flex-col",
        listVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
      {hasIndicator && box && (
        <span
          aria-hidden
          data-manga="tabs-indicator"
          className={cn(
            "pointer-events-none absolute z-0 transition-[translate,width,height] duration-[249ms] ease-[steps(3,jump-start)]",
            indicatorVariants[variant],
          )}
          style={{ "--ix": `${box.x}px`, "--iy": `${box.y}px`, "--iw": `${box.w}px`, "--ih": `${box.h}px` } as React.CSSProperties}
        />
      )}
    </ShadcnTabsList>
  )
}

const triggerVariants: Record<TabsVariant, string> = {
  // Same height for every tab; the active one opens its bottom edge onto the panel.
  index: [
    "h-10! -mb-[3px] border-[length:var(--mg-bw)] border-b-[3px] border-border bg-background! px-4 hover:border-t-4",
    "aria-selected:border-x-[3px] aria-selected:border-t-[3px] aria-selected:border-b-background! aria-selected:hover:border-t-[3px]",
    "group-data-[orientation=vertical]/mtabs:h-auto! group-data-[orientation=vertical]/mtabs:mb-0 group-data-[orientation=vertical]/mtabs:-me-[3px] group-data-[orientation=vertical]/mtabs:justify-start group-data-[orientation=vertical]/mtabs:border-b-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:border-e-[3px] group-data-[orientation=vertical]/mtabs:py-2 group-data-[orientation=vertical]/mtabs:hover:border-t-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:hover:border-s-4",
    "group-data-[orientation=vertical]/mtabs:aria-selected:border-y-[3px] group-data-[orientation=vertical]/mtabs:aria-selected:border-s-[3px] group-data-[orientation=vertical]/mtabs:aria-selected:border-e-background!",
    "data-disabled:border-dashed data-disabled:[border-bottom-style:solid] data-disabled:tone-frame data-disabled:[--frame-w:4px] data-disabled:hover:border-t-[length:var(--mg-bw)]",
  ].join(" "),
  // Hover: a thin second line just above the baseline. Disabled: the same line, dashed.
  underline: [
    "relative border-0 bg-transparent! px-1 pt-1 pb-2",
    "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0.5 before:h-0.5",
    "hover:before:bg-foreground aria-selected:hover:before:bg-transparent",
    "data-disabled:before:h-0 data-disabled:before:border-b-2 data-disabled:before:border-dashed data-disabled:before:border-foreground data-disabled:hover:before:bg-transparent",
    "group-data-[orientation=vertical]/mtabs:justify-start group-data-[orientation=vertical]/mtabs:pe-3 group-data-[orientation=vertical]/mtabs:before:inset-x-auto group-data-[orientation=vertical]/mtabs:before:inset-y-0 group-data-[orientation=vertical]/mtabs:before:end-0.5 group-data-[orientation=vertical]/mtabs:before:h-auto group-data-[orientation=vertical]/mtabs:before:w-0.5",
    "group-data-[orientation=vertical]/mtabs:data-disabled:before:w-0 group-data-[orientation=vertical]/mtabs:data-disabled:before:border-b-0 group-data-[orientation=vertical]/mtabs:data-disabled:before:border-e-2",
  ].join(" "),
  // One frame, cells split by a line. The flat is the moving indicator; the label turns to paper
  // once it has arrived (colour change delayed by two frames).
  boxed: [
    "relative z-10 border-0 border-s-[length:var(--mg-bw)] border-border px-4 py-1.5 first:border-s-0",
    "bg-transparent! aria-selected:bg-primary! group-data-[indicator=on]/mlist:aria-selected:bg-transparent!",
    "transition-[color]! duration-0! delay-[166ms]! aria-selected:text-primary-foreground!",
    // hover: a second line under the label (paper gap, then ink)
    "hover:shadow-[inset_0_-3px_0_var(--background),inset_0_-6px_0_var(--foreground)] aria-selected:hover:shadow-none",
    "group-data-[orientation=vertical]/mtabs:justify-start group-data-[orientation=vertical]/mtabs:border-s-0 group-data-[orientation=vertical]/mtabs:border-t-[length:var(--mg-bw)] group-data-[orientation=vertical]/mtabs:first:border-t-0",
    // disabled: a light tone band along the bottom of the cell and a dashed underline; no inner frame
    "data-disabled:underline data-disabled:decoration-dashed data-disabled:decoration-2 data-disabled:underline-offset-4 data-disabled:hover:shadow-none",
    "data-disabled:before:pointer-events-none data-disabled:before:absolute data-disabled:before:inset-x-0 data-disabled:before:bottom-0 data-disabled:before:h-1.5 data-disabled:before:tone-35",
  ].join(" "),
}

// Active tab: Radix and Base UI both set aria-selected="true".
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnTabsTrigger>) {
  const variant = React.useContext(TabsVariantContext)
  return (
    <ShadcnTabsTrigger
      data-manga="tabs-trigger"
      className={cn(
        "h-auto flex-none rounded-(--radius) font-letter text-base tracking-wide text-foreground! uppercase transition-none after:hidden",
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

// The panel enters like a sliding panel of a page: three steps from the inline end
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
