import { Slider } from "@registry/manga/ui/slider"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="grid max-w-md gap-8 py-2">
      <Slider defaultValue={[60]} max={100} aria-label="Volume" />
      <Slider defaultValue={[20, 70]} max={100} aria-label="Range" />
    </div>
  )
}

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
