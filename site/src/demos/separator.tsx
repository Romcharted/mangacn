import { Separator } from "@registry/manga/ui/separator"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="grid w-80 gap-4 text-center text-base">
      <p>Chapter 11 ends here.</p>
      <Separator variant="double" />
      <p>Chapter 12 begins.</p>
      <Separator />
      <div className="flex h-6 items-center justify-center gap-3 font-letter uppercase">
        Read
        <Separator orientation="vertical" />
        Share
        <Separator orientation="vertical" variant="fine" />
        Save
      </div>
    </div>
  )
}

function Variants() {
  return (
    <div className="grid w-80 gap-5 text-center text-base">
      <p className="font-letter uppercase">ink · 2px</p>
      <Separator />
      <p className="font-letter uppercase">fine · 1px</p>
      <Separator variant="fine" />
      <p className="font-letter uppercase">double · a break between chapters</p>
      <Separator variant="double" />
    </div>
  )
}

function Vertical() {
  return (
    <div className="flex h-10 w-80 items-center justify-center gap-4 font-letter uppercase">
      Read
      <Separator orientation="vertical" />
      Share
      <Separator orientation="vertical" variant="fine" />
      Save
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Weights", description: "ink is the default 2px rule, fine a 1px line, double two lines for a break between chapters.", Component: Variants },
  { fn: "Vertical", title: "Vertical", description: "orientation=\"vertical\" draws the rule between items of a row, with the same weights.", Component: Vertical },
]

export function States() {
  return (
    <Tiles>
      <Tile label="horizontal · ink" size="lg">
        <div className="w-full">
          <Separator />
        </div>
      </Tile>
      <Tile label="horizontal · fine" size="lg">
        <div className="w-full">
          <Separator variant="fine" />
        </div>
      </Tile>
      <Tile label="horizontal · double" size="lg">
        <div className="w-full">
          <Separator variant="double" />
        </div>
      </Tile>
      <Tile label="vertical · ink" size="lg">
        <div className="flex h-12 w-full justify-center">
          <Separator orientation="vertical" />
        </div>
      </Tile>
      <Tile label="vertical · fine" size="lg">
        <div className="flex h-12 w-full justify-center">
          <Separator orientation="vertical" variant="fine" />
        </div>
      </Tile>
      <Tile label="vertical · double" size="lg">
        <div className="flex h-12 w-full justify-center">
          <Separator orientation="vertical" variant="double" />
        </div>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid w-48 gap-3">
      <Separator />
      <Separator variant="fine" />
      <Separator variant="double" />
    </div>
  )
}
