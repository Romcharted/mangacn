import * as React from "react"
import { cn } from "cn"

import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton"

export type SkeletonShape = "text" | "avatar" | "panel" | "block"

export type SkeletonProps = React.ComponentProps<typeof ShadcnSkeleton> & {
  /** text: one line · avatar: square face frame · panel: a manga panel · block: free size */
  shape?: SkeletonShape
}

const shapes: Record<SkeletonShape, string> = {
  text: "h-4 w-full",
  avatar: "size-12",
  panel: "aspect-[4/3] w-full border-ink-fine",
  block: "",
}

// Light screentone (bg-muted) that flickers in steps instead of pulsing in opacity.
function Skeleton({ shape = "block", className, ...props }: SkeletonProps) {
  return (
    <ShadcnSkeleton
      data-manga="skeleton"
      data-shape={shape}
      aria-hidden
      className={cn("rounded-(--radius) bg-muted tone-10 animate-tone-flicker", shapes[shape], className)}
      {...props}
    />
  )
}

/** A card-shaped placeholder: panel, title line and two text lines. */
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-manga="skeleton-card" aria-hidden className={cn("w-full max-w-xs space-y-3 border-ink-fine p-3", className)} {...props}>
      <Skeleton shape="panel" />
      <Skeleton shape="text" className="h-5 w-2/3" />
      <Skeleton shape="text" />
      <Skeleton shape="text" className="w-4/5" />
    </div>
  )
}

export { Skeleton, SkeletonCard }
