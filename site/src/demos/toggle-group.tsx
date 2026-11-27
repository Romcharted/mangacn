import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@registry/manga/ui/toggle-group"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <ToggleGroup aria-label="Alignment" defaultValue={["center"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align centre">
        Centre
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

function Several() {
  return (
    <ToggleGroup aria-label="Reading" multiple defaultValue={["sfx", "bubbles"]} spacing={2} variant="outline">
      <ToggleGroupItem value="sfx">SFX</ToggleGroupItem>
      <ToggleGroupItem value="bubbles">Bubbles</ToggleGroupItem>
      <ToggleGroupItem value="captions">Captions</ToggleGroupItem>
    </ToggleGroup>
  )
}

function Vertical() {
  return (
    <ToggleGroup aria-label="Panel order" orientation="vertical" defaultValue={["ltr"]} variant="outline">
      <ToggleGroupItem value="ltr">Left to right</ToggleGroupItem>
      <ToggleGroupItem value="rtl">Right to left</ToggleGroupItem>
    </ToggleGroup>
  )
}

function Controlled() {
  const [panel, setPanel] = useState<string[]>(["ltr"])
  return (
    <div className="grid justify-items-center gap-3">
      <ToggleGroup aria-label="Panel order" value={panel} onValueChange={(next) => setPanel(next)}>
        <ToggleGroupItem value="ltr">Left to right</ToggleGroupItem>
        <ToggleGroupItem value="rtl">Right to left</ToggleGroupItem>
      </ToggleGroup>
      <p aria-live="polite" className="font-mono text-sm">
        Order: {panel.join(", ") || "none"}
      </p>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Several", title: "Several at once", description: "multiple lets more than one cell stay pressed, and spacing gives each toggle its own frame.", Component: Several },
  { fn: "Vertical", title: "Vertical column", description: "orientation vertical stacks the cells, and the dividing line turns horizontal.", Component: Vertical },
  { fn: "Controlled", title: "Controlled value", description: "value and onValueChange keep the pressed cells in React state; the line below lists them.", Component: Controlled },
]

export function States() {
  return (
    <Tiles>
      <Tile label="joined · rest" size="lg">
        <ToggleGroup aria-label="Rest" defaultValue={["b"]}>
          <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
          <ToggleGroupItem value="b">Beta</ToggleGroupItem>
          <ToggleGroupItem value="c">Gamma</ToggleGroupItem>
        </ToggleGroup>
      </Tile>
      <Tile label="joined · hover" size="lg">
        <ToggleGroup aria-label="Hover" defaultValue={["b"]}>
          <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
          <ToggleGroupItem value="b" {...force("hover")}>
            Beta
          </ToggleGroupItem>
          <ToggleGroupItem value="c">Gamma</ToggleGroupItem>
        </ToggleGroup>
      </Tile>
      <Tile label="joined · focus" size="lg">
        <ToggleGroup aria-label="Focus">
          <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
          <ToggleGroupItem value="b" {...force("focus")}>
            Beta
          </ToggleGroupItem>
          <ToggleGroupItem value="c">Gamma</ToggleGroupItem>
        </ToggleGroup>
      </Tile>
      <Tile label="joined · disabled cell" size="lg">
        <ToggleGroup aria-label="Disabled cell" defaultValue={["a"]}>
          <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
          <ToggleGroupItem value="b" disabled>
            Beta
          </ToggleGroupItem>
          <ToggleGroupItem value="c">Gamma</ToggleGroupItem>
        </ToggleGroup>
      </Tile>
      <Tile label="spaced · outline · on" size="lg">
        <ToggleGroup aria-label="Spaced" spacing={2} variant="outline" defaultValue={["a"]}>
          <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
          <ToggleGroupItem value="b">Beta</ToggleGroupItem>
        </ToggleGroup>
      </Tile>
      <Tile label="vertical · joined" size="lg">
        <ToggleGroup aria-label="Vertical" orientation="vertical" defaultValue={["b"]}>
          <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
          <ToggleGroupItem value="b">Beta</ToggleGroupItem>
          <ToggleGroupItem value="c">Gamma</ToggleGroupItem>
        </ToggleGroup>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div>
      <ToggleGroup aria-label="Alignment" defaultValue={["center"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align centre">
          Centre
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
