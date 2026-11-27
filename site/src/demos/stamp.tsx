import { Stamp } from "@registry/manga/signature/stamp"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-6">
      <Stamp>Approved</Stamp>
      <Stamp rotate={6} className="text-3xl">
        Sold out
      </Stamp>
      <Stamp orientation="vertical" rotate={-4}>
        完了
      </Stamp>
    </div>
  )
}

function Tones() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-6">
      <Stamp tone="accent">Sold out</Stamp>
      <Stamp tone="ink">Shipped</Stamp>
    </div>
  )
}

function Vertical() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-6">
      <Stamp orientation="vertical" tone="ink">
        受付
      </Stamp>
      <Stamp orientation="vertical">
        完了
      </Stamp>
    </div>
  )
}

function Tilted() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-6">
      <Stamp rotate={-12} className="text-2xl">
        Approved
      </Stamp>
      <Stamp rotate={10} className="text-2xl">
        Approved
      </Stamp>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Tones", title: "Accent and ink", description: "tone accent is for what must stand out; tone ink draws the seal in ink for everyday statuses.", Component: Tones },
  { fn: "Vertical", title: "Vertical seal", description: "orientation vertical sets the letters top to bottom, as in a Japanese seal.", Component: Vertical },
  { fn: "Tilted", title: "Tilt", description: "rotate sets the tilt in degrees; the frame turns with the lettering.", Component: Tilted },
]

export function States() {
  return (
    <Tiles>
      <Tile label="tone · accent">
        <Stamp animated={false}>Sold out</Stamp>
      </Tile>
      <Tile label="tone · ink">
        <Stamp tone="ink" animated={false}>Shipped</Stamp>
      </Tile>
      <Tile label="orientation · vertical">
        <Stamp orientation="vertical" animated={false}>完了</Stamp>
      </Tile>
      <Tile label="rotate · 0">
        <Stamp rotate={0} animated={false}>Approved</Stamp>
      </Tile>
      <Tile label="rotate · 6">
        <Stamp rotate={6} animated={false}>Approved</Stamp>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Stamp className="text-2xl">Approved</Stamp>
}
