"use client"

import * as React from "react"
import { cn } from "cn"
import { Separator, type SeparatorProps } from "react-resizable-panels"

import { ResizablePanel, ResizablePanelGroup as ShadcnResizablePanelGroup } from "@/components/ui/resizable"

/*
 * The handle is a 2px ink line (G1 frame, no tone: Rule C). Hover thickens the line by 1px (G3, third
 * case). Focus is the focus-ink ring. Dragging (data-separator="active") turns the grip into an ink flat.
 * The hit area is 24px wide, 44px under 640 px, and the visible line stays where it is.
 * The stock handle's classes would fight these (w-px, after:, bg-border), so the handle is drawn here on
 * the same react-resizable-panels Separator; the group and panel are the stock parts.
 */
const handle = [
  "group/handle relative flex shrink-0 items-center justify-center focus-ink",
  "w-6 max-sm:w-11 aria-[orientation=horizontal]:h-6 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:max-sm:h-11",
  "before:absolute before:inset-y-0 before:start-[calc(50%-1px)] before:w-[length:var(--mg-bw)] before:bg-border before:content-['']",
  "hover:before:start-[calc(50%-2px)] hover:before:w-[calc(var(--mg-bw)*2)]",
  "aria-[orientation=horizontal]:before:inset-x-0 aria-[orientation=horizontal]:before:inset-y-auto aria-[orientation=horizontal]:before:top-[calc(50%-1px)] aria-[orientation=horizontal]:before:h-[length:var(--mg-bw)] aria-[orientation=horizontal]:before:w-auto",
  "aria-[orientation=horizontal]:hover:before:top-[calc(50%-2px)] aria-[orientation=horizontal]:hover:before:h-[calc(var(--mg-bw)*2)]",
  "data-[separator=active]:before:bg-foreground",
].join(" ")

const grip = [
  "relative z-10 flex h-7 w-4 flex-col items-center justify-center gap-[3px] border-ink bg-background",
  "group-data-[separator=active]/handle:bg-foreground",
  "aria-[orientation=horizontal]:h-4 aria-[orientation=horizontal]:w-7 aria-[orientation=horizontal]:flex-row",
].join(" ")

const gripLine = "block h-[length:var(--mg-bw-fine)] w-2 bg-foreground group-data-[separator=active]/handle:bg-background aria-[orientation=horizontal]:h-2 aria-[orientation=horizontal]:w-[length:var(--mg-bw-fine)]"

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof ShadcnResizablePanelGroup>) {
  return <ShadcnResizablePanelGroup data-manga="resizable" className={className} {...props} />
}

function ResizableHandle({ withHandle, className, ...props }: SeparatorProps & { withHandle?: boolean }) {
  return (
    <Separator data-manga="resizable" data-slot="resizable-handle" className={cn(handle, className)} {...props}>
      {withHandle && (
        <span aria-hidden className={grip}>
          <span className={gripLine} />
          <span className={gripLine} />
        </span>
      )}
    </Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
