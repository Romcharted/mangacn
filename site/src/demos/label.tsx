import { Input } from "@registry/manga/ui/input"
import { Label } from "@registry/manga/ui/label"

export function Preview() {
  return (
    <div className="grid max-w-sm gap-5">
      <div className="grid gap-2">
        <Label htmlFor="pen" required>
          Pen name
        </Label>
        <Input id="pen" required defaultValue="Night owl" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pen-off">Locked field</Label>
        <Input id="pen-off" disabled defaultValue="Cannot change" className="peer" />
      </div>
    </div>
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
