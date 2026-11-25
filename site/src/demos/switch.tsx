import { Switch } from "@registry/manga/ui/switch"
import { StateGrid, force } from "../state-grid"

export function Preview() {
  return (
    <div className="grid gap-3">
      <label className="flex items-center gap-3">
        <Switch defaultChecked /> <span>Auto-scroll pages</span>
      </label>
      <label className="flex items-center gap-3">
        <Switch /> <span>Double-page spread</span>
      </label>
    </div>
  )
}

export function States() {
  return (
    <StateGrid
      rows={["off", "on"] as const}
      cols={["default", "hover", "focus", "active", "disabled"] as const}
      minCol="6rem"
      cell={(row, s) => (
        <Switch {...force(s)} tabIndex={-1} aria-label={`${row} ${s}`} checked={row === "on"} disabled={s === "disabled"} />
      )}
    />
  )
}
