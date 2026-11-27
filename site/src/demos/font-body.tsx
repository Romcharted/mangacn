import { Button } from "@registry/manga/ui/button"
import { Input } from "@registry/manga/ui/input"
import { Label } from "@registry/manga/ui/label"
import type { Example } from "../registry"
import { Panel, SizeTiles, Specimen } from "./font-sample"

export function Preview() {
  return <Specimen font="font-sans" text="Every island deserves a map." />
}

function Paragraph() {
  return (
    <p className="max-w-prose font-sans text-base leading-relaxed">
      Suzu unrolled the chart on the bridge. Kuro sniffed the ink, sneezed, and a new island appeared in the corner of the
      page. Nobody had ever drawn that one before.
    </p>
  )
}

function Characters() {
  return <p className="max-w-md text-center font-sans text-2xl leading-snug">Il1| O0 rn m 5S 8B — 0123456789 · ?!&amp;@</p>
}

function FormFields() {
  return (
    <Panel>
      <Label htmlFor="font-body-name">Pen name</Label>
      <Input id="font-body-name" defaultValue="Suzu" />
      <Button>Save</Button>
    </Panel>
  )
}

export const examples: Example[] = [
  { fn: "Paragraph", title: "Body text", description: "font-sans is the reading face: paragraphs, descriptions, captions.", Component: Paragraph },
  { fn: "Characters", title: "Clear characters", description: "Atkinson Hyperlegible Next keeps look-alike letters and digits apart.", Component: Characters },
  { fn: "FormFields", title: "In form fields", description: "Inputs and help text use it too; labels and buttons switch to the lettering face.", Component: FormFields },
]

export function States() {
  return <SizeTiles font="font-sans" text="Map" />
}
