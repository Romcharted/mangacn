import { RadioGroup, RadioGroupItem } from "@registry/manga/ui/radio-group"
import { force, Tile, Tiles } from "../state-grid"

const options = [
  { v: "ltr", t: "Left to right" },
  { v: "rtl", t: "Right to left (manga)" },
  { v: "strip", t: "Vertical strip" },
]

export function Preview() {
  return (
    <RadioGroup defaultValue="rtl" aria-label="Reading order">
      {options.map((o) => (
        <label key={o.v} className="flex items-center gap-3 text-base">
          <RadioGroupItem value={o.v} />
          {o.t}
        </label>
      ))}
    </RadioGroup>
  )
}

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
