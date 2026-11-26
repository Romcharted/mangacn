import { ToggleGroup, ToggleGroupItem } from "@registry/manga/ui/toggle-group"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-col items-start gap-6 pb-48">
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
      <ToggleGroup aria-label="Reading" multiple defaultValue={["sfx", "bubbles"]} spacing={2} variant="outline">
        <ToggleGroupItem value="sfx">SFX</ToggleGroupItem>
        <ToggleGroupItem value="bubbles">Bubbles</ToggleGroupItem>
        <ToggleGroupItem value="captions">Captions</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Panel order" orientation="vertical" defaultValue={["ltr"]} variant="outline">
        <ToggleGroupItem value="ltr">Left to right</ToggleGroupItem>
        <ToggleGroupItem value="rtl">Right to left</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

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
