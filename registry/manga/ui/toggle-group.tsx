"use client"

import * as React from "react"
import { cn } from "cn"

import { ToggleGroup as ShadcnToggleGroup, ToggleGroupItem as ShadcnToggleGroupItem } from "@/components/ui/toggle-group"
import { toggleClassName, type ToggleSize, type ToggleVariant } from "@/components/ui/manga/toggle"
import { ImpactLines, withImpact } from "@/lib/manga/gestures"

type ShadcnGroupProps = React.ComponentProps<typeof ShadcnToggleGroup>
type ShadcnItemProps = React.ComponentProps<typeof ShadcnToggleGroupItem>

const GroupContext = React.createContext<{ variant?: ToggleVariant; size?: ToggleSize }>({})

/*
 * spacing 0 (the default here) joins the toggles in one frame, like the cells of a boxed Tabs: a 2px line
 * between cells, the pressed cell an ink flat (G2), hover thickens the line (G3, cells of a group).
 * spacing above 0 keeps every toggle a framed button of its own.
 */
function ToggleGroup({ className, variant, size, orientation = "horizontal", spacing = 0, children, ...props }: ShadcnGroupProps & {
  variant?: ToggleVariant
  size?: ToggleSize
}) {
  return (
    <GroupContext.Provider value={{ variant, size }}>
      <ShadcnToggleGroup
        data-manga="toggle-group"
        variant={variant}
        size={size}
        orientation={orientation}
        spacing={spacing}
        className={cn(
          "rounded-(--radius) data-[spacing=0]:border-[length:var(--mg-bw)] data-[spacing=0]:border-border data-[spacing=0]:bg-background",
          className,
        )}
        {...props}
      >
        {children}
      </ShadcnToggleGroup>
    </GroupContext.Provider>
  )
}

// Joined cells: no own frame, a separating line from the previous cell, focus stays inside the cell.
const joined = [
  "data-[spacing=0]:rounded-none data-[spacing=0]:border-0 data-[spacing=0]:bg-transparent",
  "group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:border-s-[length:var(--mg-bw)] group-data-[orientation=horizontal]/toggle-group:data-[spacing=0]:first:border-s-0",
  "group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:border-t-[length:var(--mg-bw)] group-data-[orientation=vertical]/toggle-group:data-[spacing=0]:first:border-t-0",
  "data-[spacing=0]:border-border data-[spacing=0]:after:hidden! data-[spacing=0]:hover-thicken data-[spacing=0]:aria-pressed:hover:shadow-none",
  "data-[spacing=0]:focus-visible:outline-solid! data-[spacing=0]:focus-visible:outline-ring! data-[spacing=0]:focus-visible:outline-2! data-[spacing=0]:focus-visible:outline-offset-[-5px]! data-[spacing=0]:focus-visible:shadow-none!",
].join(" ")

function ToggleGroupItem({ className, variant, size, onClick, children, ...props }: ShadcnItemProps & {
  variant?: ToggleVariant
  size?: ToggleSize
}) {
  const group = React.useContext(GroupContext)
  const v = (group.variant ?? variant ?? "default") as ToggleVariant
  const s = (group.size ?? size ?? "default") as ToggleSize
  return (
    <ShadcnToggleGroupItem
      data-manga="toggle-group-item"
      variant={v}
      size={s}
      className={toggleClassName({ variant: v, size: s, className: cn(joined, className) })}
      onClick={withImpact(onClick) as ShadcnItemProps["onClick"]}
      {...props}
    >
      <ImpactLines />
      {children}
    </ShadcnToggleGroupItem>
  )
}

export { ToggleGroup, ToggleGroupItem }
