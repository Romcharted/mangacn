import { useState } from "react"
import { Shelf, type ShelfVolume } from "@registry/manga/signature/shelf"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { coverUrl } from "./reader-art"

// Invented series, drawn covers.
const VOLUMES: ShelfVolume[] = [
  { id: "ls-1", title: "Lantern Street", volume: 1, author: "N. Arai", cover: coverUrl(1, "Lantern St."), status: "completed", read: 8, total: 8, thickness: 2, spine: "band" },
  { id: "ls-2", title: "Lantern Street", volume: 2, author: "N. Arai", cover: coverUrl(2, "Lantern St."), status: "completed", read: 8, total: 8, thickness: 2, spine: "band" },
  { id: "ls-3", title: "Lantern Street", volume: 3, author: "N. Arai", cover: coverUrl(3, "Lantern St."), status: "ongoing", read: 3, total: 9, thickness: 3, spine: "band" },
  { id: "pb-1", title: "Paper Boats", volume: 1, author: "K. Ueno", cover: coverUrl(4, "Paper Boats"), status: "ongoing", read: 0, total: 7, thickness: 1, spine: "plain" },
  { id: "pb-2", title: "Paper Boats", volume: 2, author: "K. Ueno", cover: coverUrl(5, "Paper Boats"), status: "new", read: 0, total: 7, thickness: 1, spine: "plain" },
  { id: "tf-1", title: "Tidal Forge", volume: 1, author: "R. Sato", cover: coverUrl(6, "Tidal Forge"), status: "hiatus", read: 5, total: 10, thickness: 3, spine: "tone" },
  { id: "tf-2", title: "Tidal Forge", volume: 2, author: "R. Sato", cover: coverUrl(7, "Tidal Forge"), status: "hiatus", read: 0, total: 10, thickness: 3, spine: "tone" },
]

export function Preview() {
  const [opened, setOpened] = useState<string | null>(null)
  const [order, setOrder] = useState<"ltr" | "rtl">("ltr")
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
        <span>Order:</span>
        {(["ltr", "rtl"] as const).map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={order === o}
            onClick={() => setOrder(o)}
            className="min-h-11 border-ink px-3 font-letter uppercase aria-pressed:ink-fill focus-ink sm:min-h-9"
          >
            {o === "rtl" ? "Vol. 1 at the right" : "Vol. 1 at the left"}
          </button>
        ))}
      </div>
      <Shelf volumes={VOLUMES} direction={order} defaultSelected="ls-3" openLabel="Read" onOpen={(v) => setOpened(`${v.title}, vol. ${v.volume}`)} />
      <p aria-live="polite" className="font-mono text-sm">
        {opened ? `Opening ${opened}…` : "Pull a volume, then Read."}
      </p>
    </div>
  )
}

export function States() {
  const few = VOLUMES.slice(0, 3)
  const forced = (state: "hover" | "focus" | "active") => (
    <ForceInside state={state} selector="[data-slot=shelf-spine]">
      <Shelf volumes={few} className="w-full max-w-60" />
    </ForceInside>
  )
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Tile label="spines · plain, band, tone" size="lg">
        <Shelf volumes={[VOLUMES[3], VOLUMES[0], VOLUMES[5]]} className="w-full max-w-60" />
      </Tile>
      <Tile label="spine · hover (first)" size="lg">{forced("hover")}</Tile>
      <Tile label="spine · focus (first)" size="lg">{forced("focus")}</Tile>
      <Tile label="spine · pressed (first)" size="lg">{forced("active")}</Tile>
      <Tile label="pulled out · card open" size="full">
        <Shelf volumes={few} defaultSelected="ls-2" className="w-full max-w-md" />
      </Tile>
      <Tile label="manga order · vol. 1 at the right" size="lg">
        <Shelf volumes={few} direction="rtl" className="w-full max-w-60" />
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="pointer-events-none w-28" inert>
      <Shelf volumes={VOLUMES.slice(0, 3)} className="[&_ul]:px-1 [&_ul]:pt-2" />
    </div>
  )
}
