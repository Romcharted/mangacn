import { RefreshCwIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@registry/manga/ui/marker"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex max-w-lg flex-col gap-5">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <RefreshCwIcon />
        </MarkerIcon>
        <MarkerContent>
          Model switched to <a href="#">Claude Haiku 5.5</a>
        </MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Chapter 12 · draft 3 · context compacted</MarkerContent>
      </Marker>
    </div>
  )
}

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
            Model switched to <a href="#">Claude Haiku 5.5</a>
          </MarkerContent>
        </Marker>
      </Tile>
      <Tile label="default · link hover" size="lg">
        <Marker className="w-full">
          <MarkerContent>
            Model switched to <a href="#" {...force("hover")}>Claude Haiku 5.5</a>
          </MarkerContent>
        </Marker>
      </Tile>
      <Tile label="default · link focus" size="lg">
        <Marker className="w-full">
          <MarkerContent>
            Model switched to <a href="#" {...force("focus")}>Claude Haiku 5.5</a>
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
