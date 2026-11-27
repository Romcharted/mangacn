import { Bold, Italic } from "lucide-react"
import { Toggle } from "@registry/manga/ui/toggle"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Bold" defaultPressed>
        Bold
      </Toggle>
      <Toggle aria-label="Italic">Italic</Toggle>
      <Toggle aria-label="Captions" variant="outline">
        Captions
      </Toggle>
    </div>
  )
}

function Outline() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Sound effects" variant="outline" defaultPressed>
        SFX
      </Toggle>
      <Toggle aria-label="Captions" variant="outline">
        Captions
      </Toggle>
    </div>
  )
}

function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Small" size="sm" variant="outline">
        Small
      </Toggle>
      <Toggle aria-label="Default" variant="outline">
        Default
      </Toggle>
      <Toggle aria-label="Large" size="lg" variant="outline">
        Large
      </Toggle>
    </div>
  )
}

function WithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Bold" variant="outline" defaultPressed>
        <Bold data-icon="inline-start" /> Bold
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <Italic data-icon="inline-start" /> Italic
      </Toggle>
    </div>
  )
}

function Disabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Locked" disabled variant="outline">
        Locked
      </Toggle>
      <Toggle aria-label="Locked on" disabled variant="outline" defaultPressed>
        Locked on
      </Toggle>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Outline", title: "Outline", description: "variant outline draws a 2px frame, and a pressed toggle floods with ink.", Component: Outline },
  { fn: "Sizes", title: "Sizes", description: "size sm, default and lg set the height: 32, 40 and 48 pixels.", Component: Sizes },
  { fn: "WithIcon", title: "With an icon", description: "An icon goes before the label, and the toggle keeps its ink look when pressed.", Component: WithIcon },
  { fn: "Disabled", title: "Disabled", description: "disabled turns the frame dashed and the label onto paper, pressed or not.", Component: Disabled },
]

export function States() {
  return (
    <Tiles>
      <Tile label="outline · off · rest">
        <Toggle variant="outline" aria-label="Rest">
          Rest
        </Toggle>
      </Tile>
      <Tile label="outline · off · hover">
        <Toggle variant="outline" aria-label="Hover" {...force("hover")}>
          Hover
        </Toggle>
      </Tile>
      <Tile label="outline · off · focus">
        <Toggle variant="outline" aria-label="Focus" {...force("focus")}>
          Focus
        </Toggle>
      </Tile>
      <Tile label="outline · on · rest">
        <Toggle variant="outline" aria-label="On" defaultPressed>
          On
        </Toggle>
      </Tile>
      <Tile label="outline · on · hover">
        <Toggle variant="outline" aria-label="On hover" defaultPressed {...force("hover")}>
          On
        </Toggle>
      </Tile>
      <Tile label="outline · pressed">
        <Toggle variant="outline" aria-label="Pressed" {...force("active")}>
          Press
        </Toggle>
      </Tile>
      <Tile label="outline · disabled">
        <Toggle variant="outline" aria-label="Disabled" disabled>
          Off
        </Toggle>
      </Tile>
      <Tile label="outline · disabled · on">
        <Toggle variant="outline" aria-label="Disabled on" disabled defaultPressed>
          On
        </Toggle>
      </Tile>
      <Tile label="default · off · rest">
        <Toggle aria-label="Frameless rest">Rest</Toggle>
      </Tile>
      <Tile label="default · off · hover">
        <Toggle aria-label="Frameless hover" {...force("hover")}>
          Hover
        </Toggle>
      </Tile>
      <Tile label="default · on">
        <Toggle aria-label="Frameless on" defaultPressed>
          On
        </Toggle>
      </Tile>
      <Tile label="default · disabled">
        <Toggle aria-label="Frameless disabled" disabled>
          Off
        </Toggle>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" variant="outline" aria-label="Bold" defaultPressed>
        Bold
      </Toggle>
      <Toggle size="sm" variant="outline" aria-label="Italic">
        Italic
      </Toggle>
    </div>
  )
}
