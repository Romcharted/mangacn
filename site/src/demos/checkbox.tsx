import { useState } from "react"
import { Checkbox } from "@registry/manga/ui/checkbox"
import type { Example } from "../registry"
import { StateGrid, force } from "../state-grid"

export function Preview() {
  return (
    <label className="flex items-center gap-3">
      <Checkbox defaultChecked />
      <span>Notify me when a chapter drops</span>
    </label>
  )
}

const SETTINGS = ["Notify me when a chapter drops", "Show spoilers", "Read right to left"]

function Group() {
  const [picked, setPicked] = useState([true, false, false])
  const all = picked.every(Boolean)
  const some = picked.some(Boolean)
  return (
    <div className="grid w-64 gap-3">
      <label className="flex items-center gap-3 font-letter tracking-wide uppercase">
        <Checkbox
          checked={all}
          indeterminate={!all && some}
          onCheckedChange={(checked) => setPicked(SETTINGS.map(() => checked))}
        />
        <span>All settings</span>
      </label>
      {SETTINGS.map((label, i) => (
        <label key={label} className="ms-7 flex items-center gap-3">
          <Checkbox
            checked={picked[i]}
            onCheckedChange={(checked) => setPicked((prev) => prev.map((v, j) => (j === i ? checked : v)))}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  )
}

function Disabled() {
  return (
    <div className="grid w-64 gap-3">
      <label className="flex items-center gap-3">
        <Checkbox checked disabled />
        <span>Always on: the reader needs it</span>
      </label>
      <label className="flex items-center gap-3">
        <Checkbox disabled />
        <span>Coming soon</span>
      </label>
    </div>
  )
}

function Invalid() {
  return (
    <div className="grid w-64 gap-3">
      <label className="flex items-center gap-3">
        <Checkbox aria-invalid />
        <span>I am over 18</span>
      </label>
      <p className="text-sm text-destructive">Tick this box to read the mature chapters.</p>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Group", title: "A group with select all", description: "The parent box shows a bar when only some children are ticked; clicking it ticks or clears them all.", Component: Group },
  { fn: "Disabled", title: "Disabled", description: "disabled keeps the box as a dashed frame; a checked one stays readable in ink.", Component: Disabled },
  { fn: "Invalid", title: "Error", description: "aria-invalid draws the box in the accent colour with a 3px frame, next to a message.", Component: Invalid },
]

const STATES = ["default", "hover", "focus", "active", "disabled", "error"] as const

export function States() {
  return (
    <StateGrid
      rows={["unchecked", "checked", "indeterminate"] as const}
      cols={STATES}
      minCol="6rem"
      cell={(row, s) => (
        <Checkbox
          {...force(s)}
          tabIndex={-1}
          aria-label={`${row} ${s}`}
          checked={row === "checked" ? true : row === "indeterminate" ? false : false}
          indeterminate={row === "indeterminate" || undefined}
          disabled={s === "disabled"}
          aria-invalid={s === "error" || undefined}
        />
      )}
    />
  )
}

export function Thumb() {
  return (
    <div className="grid gap-2 text-sm">
      <label className="flex items-center gap-2"><Checkbox defaultChecked /> Notify me</label>
      <label className="flex items-center gap-2"><Checkbox /> Spoilers</label>
    </div>
  )
}
