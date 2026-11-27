import { useState } from "react"
import { Slider } from "@registry/manga/ui/slider"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="w-64">
      <Slider defaultValue={[60]} max={100} aria-label="Volume" />
    </div>
  )
}

function Range() {
  return (
    <div className="w-64">
      <Slider defaultValue={[20, 70]} max={100} aria-label="Range" />
    </div>
  )
}

function Steps() {
  return (
    <div className="w-64">
      <Slider defaultValue={[30]} step={10} max={100} aria-label="Volume in tens" />
    </div>
  )
}

function Controlled() {
  const [page, setPage] = useState(4)
  return (
    <div className="grid w-64 gap-3">
      <Slider value={[page]} min={1} max={12} onValueChange={(v) => setPage(typeof v === "number" ? v : v[0])} aria-label="Page" />
      <p aria-live="polite" className="font-mono text-sm">
        Page {page} of 12
      </p>
    </div>
  )
}

function Disabled() {
  return (
    <div className="w-64">
      <Slider defaultValue={[50]} disabled aria-label="Locked" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Range", title: "A range", description: "Pass two values to get a range: drag either thumb, and the filled part sits between them.", Component: Range },
  { fn: "Steps", title: "Steps", description: "step sets the increments: here the thumb jumps in tens, and the arrow keys follow.", Component: Steps },
  { fn: "Controlled", title: "Controlled value", description: "value and onValueChange keep the page number in React state, and the line below follows it.", Component: Controlled },
  { fn: "Disabled", title: "Disabled", description: "disabled locks the rail: it turns dashed, and the thumb sits on paper.", Component: Disabled },
]

export function States() {
  return (
    <Tiles>
      <Tile label="value" size="lg"><Slider defaultValue={[35]} aria-label="Value" /></Tile>
      <Tile label="range" size="lg"><Slider defaultValue={[25, 75]} aria-label="Range" /></Tile>
      <Tile label="disabled" size="lg"><Slider defaultValue={[50]} disabled aria-label="Disabled" /></Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Slider defaultValue={[60]} className="w-48" aria-label="Volume" />
}
