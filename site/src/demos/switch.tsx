import { useState } from "react"
import { Switch } from "@registry/manga/ui/switch"
import type { Example } from "../registry"
import { StateGrid, force } from "../state-grid"

export function Preview() {
  return (
    <label className="flex w-64 items-center justify-between gap-4 text-base">
      <span>Auto-scroll pages</span>
      <Switch defaultChecked />
    </label>
  )
}

function Settings() {
  return (
    <div className="grid w-64 gap-4">
      <label className="flex items-center justify-between gap-4 text-base">
        <span>Auto-scroll pages</span>
        <Switch defaultChecked />
      </label>
      <label className="flex items-center justify-between gap-4 text-base">
        <span>Double-page spread</span>
        <Switch />
      </label>
    </div>
  )
}

function Controlled() {
  const [on, setOn] = useState(false)
  return (
    <div className="grid w-64 justify-items-center gap-3">
      <label className="flex w-full items-center justify-between gap-4 text-base">
        <span>Sound effects</span>
        <Switch checked={on} onCheckedChange={(next) => setOn(next)} />
      </label>
      <p aria-live="polite" className="font-mono text-sm">
        SFX {on ? "on" : "off"}
      </p>
    </div>
  )
}

function Disabled() {
  return (
    <label className="flex w-64 items-center justify-between gap-4 text-base">
      <span>Locked by the editor</span>
      <Switch disabled defaultChecked />
    </label>
  )
}

function Invalid() {
  return (
    <label className="flex w-64 items-center justify-between gap-4 text-base">
      <span>Accept the spoiler warning</span>
      <Switch aria-invalid />
    </label>
  )
}

export const examples: Example[] = [
  { fn: "Settings", title: "A list of settings", description: "Switches stacked in a column, each with its own label beside it.", Component: Settings },
  { fn: "Controlled", title: "Controlled state", description: "checked and onCheckedChange keep the value in React state, and the line below follows it.", Component: Controlled },
  { fn: "Disabled", title: "Disabled", description: "disabled keeps the switch dashed and on paper, for a setting the reader cannot change.", Component: Disabled },
  { fn: "Invalid", title: "Invalid", description: "aria-invalid turns the switch's line to the accent colour, for a choice the form still needs.", Component: Invalid },
]

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

export function Thumb() {
  return (
    <div className="flex items-center gap-4">
      <Switch aria-label="Off" />
      <Switch defaultChecked aria-label="On" />
    </div>
  )
}
