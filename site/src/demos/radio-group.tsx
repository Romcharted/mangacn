import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@registry/manga/ui/radio-group"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const options = [
  { v: "ltr", t: "Left to right" },
  { v: "rtl", t: "Right to left (manga)" },
  { v: "strip", t: "Vertical strip" },
]

export function Preview() {
  return (
    <RadioGroup className="w-56" defaultValue="rtl" aria-label="Reading order">
      {options.map((o) => (
        <label key={o.v} className="flex items-center gap-3 text-base">
          <RadioGroupItem value={o.v} />
          {o.t}
        </label>
      ))}
    </RadioGroup>
  )
}

function Row() {
  return (
    <RadioGroup className="flex flex-wrap justify-center gap-x-6 gap-y-3" defaultValue="strip" aria-label="Layout">
      {options.map((o) => (
        <label key={o.v} className="flex items-center gap-2 text-base">
          <RadioGroupItem value={o.v} />
          {o.t}
        </label>
      ))}
    </RadioGroup>
  )
}

function Disabled() {
  return (
    <RadioGroup className="w-56" defaultValue="rtl" disabled aria-label="Reading order, locked">
      {options.map((o) => (
        <label key={o.v} className="flex items-center gap-3 text-base">
          <RadioGroupItem value={o.v} />
          {o.t}
        </label>
      ))}
    </RadioGroup>
  )
}

function Controlled() {
  const [order, setOrder] = useState("rtl")
  return (
    <div className="grid w-56 justify-items-center gap-3">
      <RadioGroup className="w-full" value={order} onValueChange={(v) => setOrder(v)} aria-label="Reading order">
        {options.map((o) => (
          <label key={o.v} className="flex items-center gap-3 text-base">
            <RadioGroupItem value={o.v} />
            {o.t}
          </label>
        ))}
      </RadioGroup>
      <p aria-live="polite" className="font-mono text-sm">
        Reading: {order}
      </p>
    </div>
  )
}

function Invalid() {
  return (
    <div className="grid w-56 gap-3">
      <RadioGroup className="w-full" aria-label="Reading order">
        {options.map((o) => (
          <label key={o.v} className="flex items-center gap-3 text-base">
            <RadioGroupItem value={o.v} aria-invalid />
            {o.t}
          </label>
        ))}
      </RadioGroup>
      <p className="text-sm">Choose one reading order to continue.</p>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Row", title: "In a row", description: "Give the group a flex class to lay the options side by side; each diamond keeps its look.", Component: Row },
  { fn: "Disabled", title: "Disabled group", description: "disabled on the group locks every option: they turn dashed, and the checked one stays ink.", Component: Disabled },
  { fn: "Controlled", title: "Controlled value", description: "value and onValueChange keep the choice in React state, and the line below follows it.", Component: Controlled },
  { fn: "Invalid", title: "Invalid", description: "aria-invalid on each item gives the accent line, for a choice the form still needs.", Component: Invalid },
]

function One({ label, checked, disabled, f }: { label: string; checked?: boolean; disabled?: boolean; f?: "hover" | "focus" }) {
  return (
    <Tile label={label}>
      <RadioGroup defaultValue={checked ? "a" : undefined} disabled={disabled} aria-label={label}>
        <RadioGroupItem value="a" aria-label={label} {...(f ? force(f) : {})} />
      </RadioGroup>
    </Tile>
  )
}

export function States() {
  return (
    <Tiles>
      <One label="rest" />
      <One label="hover" f="hover" />
      <One label="focus" f="focus" />
      <One label="checked" checked />
      <One label="disabled" disabled />
      <One label="disabled · checked" disabled checked />
    </Tiles>
  )
}

export function Thumb() {
  return (
    <RadioGroup defaultValue="rtl" aria-label="Reading order" className="text-sm">
      {options.slice(0, 2).map((o) => (
        <label key={o.v} className="flex items-center gap-2">
          <RadioGroupItem value={o.v} />
          {o.t}
        </label>
      ))}
    </RadioGroup>
  )
}
