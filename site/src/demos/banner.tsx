import { Banner } from "@registry/manga/signature/banner"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return <Banner lines>Chapter 12 is out</Banner>
}

function Variants() {
  return (
    <div className="grid justify-items-center gap-6">
      <Banner>Ink</Banner>
      <Banner variant="paper">Paper</Banner>
      <Banner variant="accent">Accent</Banner>
    </div>
  )
}

function Ends() {
  return (
    <div className="grid justify-items-center gap-6">
      <Banner variant="paper">Season two</Banner>
      <Banner variant="paper" ends="straight">
        Last day of the sale
      </Banner>
    </div>
  )
}

function SpeedLines() {
  return (
    <div className="grid justify-items-center">
      <Banner variant="accent" lines>
        Chapter 12 is out
      </Banner>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "variant sets the ribbon: ink (the default), paper with an ink line, or accent for the news that matters.", Component: Variants },
  { fn: "Ends", title: "Ends", description: "ends notched gives a swallowtail; straight gives square ends for a sale line.", Component: Ends },
  { fn: "SpeedLines", title: "Speed lines", description: "lines runs speed lines out of both ends of the ribbon, never under the text.", Component: SpeedLines },
]

export function States() {
  return (
    <Tiles>
      <Tile label="ink · notched">
        <Banner>Chapter 12</Banner>
      </Tile>
      <Tile label="paper · notched">
        <Banner variant="paper">Chapter 12</Banner>
      </Tile>
      <Tile label="accent · notched">
        <Banner variant="accent">Chapter 12</Banner>
      </Tile>
      <Tile label="ink · straight">
        <Banner ends="straight">Chapter 12</Banner>
      </Tile>
      <Tile label="ink · speed lines" size="lg">
        <Banner lines>Chapter 12</Banner>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Banner className="text-base">Chapter 12</Banner>
}
