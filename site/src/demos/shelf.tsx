import { useState } from "react"
import { Shelf, type ShelfVolume } from "@registry/manga/signature/shelf"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"
import { VolumeCover } from "../mapless"
import type { Example } from "../registry"

// "Mapless", the showcase's series: volumes 1 and 2 out, volume 3 coming (its cover is a crop).
const VOLUMES: ShelfVolume[] = [
  { id: "m-1", title: "Mapless", volume: 1, author: "Studio Mapless", cover: <VolumeCover volume={1} />, status: "completed", read: 8, total: 8, thickness: 2, spine: "band" },
  { id: "m-2", title: "Mapless", volume: 2, author: "Studio Mapless", cover: <VolumeCover volume={2} />, status: "ongoing", read: 3, total: 8, thickness: 3, spine: "tone" },
  { id: "m-3", title: "Mapless", volume: 3, author: "Studio Mapless", cover: <VolumeCover volume={3} />, status: "new", read: 0, total: 8, thickness: 1, spine: "plain" },
]

export function Preview() {
  const [opened, setOpened] = useState<string | null>(null)
  const [order, setOrder] = useState<"ltr" | "rtl">("ltr")
  return (
    <div className="mx-auto grid w-full max-w-xl gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
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
      <Shelf volumes={VOLUMES} direction={order} defaultSelected="m-2" openLabel="Read" onOpen={(v) => setOpened(`${v.title}, vol. ${v.volume}`)} />
      <p aria-live="polite" className="text-center font-mono text-sm">
        {opened ? `Opening ${opened}…` : "Pull a volume, then Read."}
      </p>
    </div>
  )
}

function Spines() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Shelf volumes={VOLUMES} />
    </div>
  )
}

function Pulled() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Shelf volumes={VOLUMES} defaultSelected="m-1" openLabel="Read" />
    </div>
  )
}

function MangaOrder() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Shelf volumes={VOLUMES} direction="rtl" defaultSelected="m-3" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Spines", title: "Spines on the shelf", description: "Each volume is a spine: its band and its tone tell the volumes apart. A click pulls one out.", Component: Spines },
  { fn: "Pulled", title: "A volume pulled out", description: "defaultSelected opens one volume at first; its Read button opens it.", Component: Pulled },
  { fn: "MangaOrder", title: "Manga order", description: "direction=\"rtl\" puts volume 1 at the right, as manga is read.", Component: MangaOrder },
]

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
        <Shelf volumes={[VOLUMES[2], VOLUMES[0], VOLUMES[1]]} className="w-full max-w-60" />
      </Tile>
      <Tile label="spine · hover (first)" size="lg">{forced("hover")}</Tile>
      <Tile label="spine · focus (first)" size="lg">{forced("focus")}</Tile>
      <Tile label="spine · pressed (first)" size="lg">{forced("active")}</Tile>
      <Tile label="pulled out · card open" size="full">
        <Shelf volumes={few} defaultSelected="m-1" className="w-full max-w-md" />
      </Tile>
      <Tile label="manga order · vol. 1 at the right" size="lg">
        <Shelf volumes={few} direction="rtl" className="w-full max-w-60" />
      </Tile>
    </div>
  )
}

/** Live: pull a volume out of the shelf. */
export function Thumb() {
  return (
    <div className="w-32">
      <Shelf volumes={VOLUMES} openLabel="Read" className="[&_ul]:px-1 [&_ul]:pt-2" />
    </div>
  )
}
