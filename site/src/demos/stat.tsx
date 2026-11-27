import { Stat } from "@registry/manga/signature/stat"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <Stat className="w-44" label="Readers" value="12.4k" delta="+8% this week" trend="up" emphasis />
      <Stat className="w-44" label="Chapters" value="48" delta="+2" trend="up" />
      <Stat className="w-44" label="Drop-off" value="3.1%" delta="-0.4 pt" trend="down" />
    </div>
  )
}

function Down() {
  return (
    <div className="flex justify-center">
      <Stat className="w-44" label="Drop-off" value="3.1%" delta="-0.4 pt" trend="down" />
    </div>
  )
}

function Emphasis() {
  return (
    <div className="flex justify-center">
      <Stat className="w-44" label="Readers" value="12.4k" delta="+8% this week" trend="up" emphasis />
    </div>
  )
}

function Flat() {
  return (
    <div className="flex justify-center">
      <Stat className="w-44" label="Chapters" value="48" delta="No change" trend="flat" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Down", title: "A figure going down", description: "trend=\"down\" turns the brush arrow around; the delta gives the change.", Component: Down },
  { fn: "Emphasis", title: "Emphasis", description: "emphasis=\"true\" bursts concentration lines around the case, for the figure that matters.", Component: Emphasis },
  { fn: "Flat", title: "No change", description: "trend=\"flat\", the default, shows no arrow.", Component: Flat },
]

export function States() {
  return (
    <Tiles>
      <Tile label="trend · up" size="lg">
        <Stat className="w-40" label="Readers" value="12.4k" delta="+8%" trend="up" />
      </Tile>
      <Tile label="trend · down" size="lg">
        <Stat className="w-40" label="Drop-off" value="3.1%" delta="-0.4 pt" trend="down" />
      </Tile>
      <Tile label="trend · flat" size="lg">
        <Stat className="w-40" label="Chapters" value="48" delta="No change" trend="flat" />
      </Tile>
      <Tile label="no delta" size="lg">
        <Stat className="w-40" label="Volumes" value="2" />
      </Tile>
      <Tile label="emphasis" size="lg">
        <Stat className="w-40" label="Readers" value="12.4k" delta="+8%" trend="up" emphasis />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Stat label="Readers" value="12.4k" delta="+8%" trend="up" className="w-44" />
}
