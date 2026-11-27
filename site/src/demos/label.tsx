import { Checkbox } from "@registry/manga/ui/checkbox"
import { Input } from "@registry/manga/ui/input"
import { Label } from "@registry/manga/ui/label"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="grid w-72 gap-2">
      <Label htmlFor="pen" required>
        Pen name
      </Label>
      <Input id="pen" required defaultValue="Night owl" />
    </div>
  )
}

function Locked() {
  return (
    <div className="grid w-72 gap-2">
      <Label htmlFor="pen-off">Locked field</Label>
      <Input id="pen-off" disabled defaultValue="Cannot change" className="peer" />
    </div>
  )
}

function Optional() {
  return (
    <div className="grid w-72 gap-2">
      <Label htmlFor="nick">Nickname</Label>
      <Input id="nick" placeholder="Leave empty to skip" />
      <p className="text-sm">Without required, the label has no asterisk.</p>
    </div>
  )
}

function CheckRow() {
  return (
    <div className="flex w-72 items-center gap-3">
      <Checkbox id="news" defaultChecked />
      <Label htmlFor="news">Send me new chapters</Label>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Optional", title: "Optional field", description: "Without required, the label is plain lettering: no asterisk.", Component: Optional },
  { fn: "Locked", title: "Disabled field", description: "A disabled field keeps its label readable, with a not-allowed cursor.", Component: Locked },
  { fn: "CheckRow", title: "Next to a checkbox", description: "A Label with htmlFor names a checkbox; clicking the text toggles it.", Component: CheckRow },
]

export function States() {
  return (
    <Tiles>
      <Tile label="label · rest" size="lg">
        <div className="grid w-64 gap-2">
          <Label htmlFor="s-rest">Pen name</Label>
          <Input id="s-rest" placeholder="Pen name" tabIndex={-1} />
        </div>
      </Tile>
      <Tile label="label · required" size="lg">
        <div className="grid w-64 gap-2">
          <Label htmlFor="s-req" required>
            Pen name
          </Label>
          <Input id="s-req" placeholder="Pen name" tabIndex={-1} />
        </div>
      </Tile>
      <Tile label="input · focus" size="lg">
        <div className="grid w-64 gap-2">
          <Label htmlFor="s-focus">Pen name</Label>
          <Input id="s-focus" placeholder="Pen name" {...force("focus")} />
        </div>
      </Tile>
      <Tile label="field · disabled" size="lg">
        <div className="grid w-64 gap-2">
          <Label htmlFor="s-off">Locked field</Label>
          <Input id="s-off" defaultValue="Cannot change" disabled className="peer" />
        </div>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid w-48 gap-2">
      <Label htmlFor="thumb-pen" required>
        Pen name
      </Label>
      <Input id="thumb-pen" inputSize="sm" defaultValue="Night owl" />
    </div>
  )
}
