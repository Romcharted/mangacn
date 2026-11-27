import { Skeleton, SkeletonCard } from "@registry/manga/ui/skeleton"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return <SkeletonCard />
}

function AvatarRow() {
  return (
    <div className="flex w-64 items-center gap-3">
      <Skeleton shape="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton shape="text" className="w-3/4" />
        <Skeleton shape="text" />
      </div>
    </div>
  )
}

function Panel() {
  return (
    <div className="w-64">
      <Skeleton shape="panel" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "AvatarRow", title: "A list row", description: "shape=\"avatar\" stands for the picture and two shape=\"text\" lines stand for the name and the note.", Component: AvatarRow },
  { fn: "Panel", title: "A page panel", description: "shape=\"panel\" keeps the 4:3 frame of a page while the image loads.", Component: Panel },
]

export function States() {
  return (
    <Tiles>
      {(["text", "avatar", "panel", "block"] as const).map((s) => (
        <Tile key={s} label={`shape="${s}"`} size="lg">
          <div className="w-full max-w-48">
            <Skeleton shape={s} className={s === "block" ? "h-20 w-full" : undefined} />
          </div>
        </Tile>
      ))}
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="flex w-48 items-center gap-3">
      <Skeleton shape="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton shape="text" className="w-3/4" />
        <Skeleton shape="text" />
      </div>
    </div>
  )
}
