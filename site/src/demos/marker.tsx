import { RefreshCwIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@registry/manga/ui/marker"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

// A link inside a marker is 44px tall on phones (sm: the kit size).
const LINK = "inline-flex min-h-11 items-center sm:min-h-8"

export function Preview() {
  return (
    <div className="flex w-80 flex-col gap-5">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <RefreshCwIcon />
        </MarkerIcon>
        <MarkerContent>
          Model switched to <a href="#" className={LINK}>Claude Haiku 5.5</a>
        </MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Chapter 12 · draft 3 · context compacted</MarkerContent>
      </Marker>
    </div>
  )
}

function Variants() {
  return (
    <div className="flex w-80 flex-col gap-5">
      <Marker variant="separator">
        <MarkerContent>separator · a rule on both sides</MarkerContent>
      </Marker>
      <Marker>
        <MarkerContent>default · no rule</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>border · a rule under the line</MarkerContent>
      </Marker>
    </div>
  )
}

function WithIcon() {
  return (
    <div className="flex w-80 flex-col gap-5">
      <Marker>
        <MarkerIcon>
          <RefreshCwIcon />
        </MarkerIcon>
        <MarkerContent>Context compacted</MarkerContent>
      </Marker>
    </div>
  )
}

function LinkInside() {
  return (
    <div className="flex w-80 flex-col gap-5">
      <Marker variant="separator">
        <MarkerContent>
          Chapter 12 is ready to <a href="#" className={LINK}>read it now</a>
        </MarkerContent>
      </Marker>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "separator draws a rule on both sides, border a rule under the line, default no rule.", Component: Variants },
  { fn: "WithIcon", title: "With an icon", description: "MarkerIcon places a small icon in ink before the text, for a switch or a compaction.", Component: WithIcon },
  { fn: "LinkInside", title: "A link inside", description: "A link takes the underline on hover and the focus ring, so the line can lead somewhere.", Component: LinkInside },
]

export function States() {
  return (
    <Tiles>
      <Tile label="separator · rest" size="lg">
        <Marker variant="separator" className="w-full">
          <MarkerContent>Today</MarkerContent>
        </Marker>
      </Tile>
      <Tile label="default · link rest" size="lg">
        <Marker className="w-full">
          <MarkerContent>
            Model switched to <a href="#" className={LINK}>Claude Haiku 5.5</a>
          </MarkerContent>
        </Marker>
      </Tile>
      <Tile label="default · link hover" size="lg">
        <Marker className="w-full">
          <MarkerContent>
            Model switched to <a href="#" className={LINK} {...force("hover")}>Claude Haiku 5.5</a>
          </MarkerContent>
        </Marker>
      </Tile>
      <Tile label="default · link focus" size="lg">
        <Marker className="w-full">
          <MarkerContent>
            Model switched to <a href="#" className={LINK} {...force("focus")}>Claude Haiku 5.5</a>
          </MarkerContent>
        </Marker>
      </Tile>
      <Tile label="border · rest" size="lg">
        <Marker variant="border" className="w-full">
          <MarkerContent>Chapter 12 · draft 3</MarkerContent>
        </Marker>
      </Tile>
      <Tile label="icon · rest" size="lg">
        <Marker className="w-full">
          <MarkerIcon>
            <RefreshCwIcon />
          </MarkerIcon>
          <MarkerContent>Context compacted</MarkerContent>
        </Marker>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Marker variant="separator" className="w-52">
      <MarkerContent>Today</MarkerContent>
    </Marker>
  )
}
