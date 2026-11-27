import { Input } from "@registry/manga/ui/input"
import type { Example } from "../registry"
import { StateGrid, force } from "../state-grid"

export function Preview() {
  return (
    <label className="grid w-72 gap-1.5">
      <span className="font-letter text-base uppercase">Pen name</span>
      <Input placeholder="Your name on the cover" />
    </label>
  )
}

function Sizes() {
  return (
    <div className="grid w-72 gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Input key={size} inputSize={size} placeholder={`inputSize="${size}"`} aria-label={`Input, ${size}`} />
      ))}
    </div>
  )
}

function Invalid() {
  return (
    <label className="grid w-72 gap-1.5">
      <span className="font-letter text-base uppercase">Email</span>
      <Input type="email" defaultValue="reader@" aria-invalid />
      <span className="text-sm text-destructive">! That email is missing its domain.</span>
    </label>
  )
}

function Locked() {
  return (
    <div className="grid w-72 gap-4">
      <Input aria-label="Locked name" defaultValue="Cannot change" disabled />
      <Input aria-label="Read-only chapter" defaultValue="Chapter 12" readOnly />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sizes", title: "Sizes", description: "inputSize sets the height and the text size: sm, default and lg.", Component: Sizes },
  { fn: "Invalid", title: "Error", description: "aria-invalid gives the stamp-red line, a serrated edge and a \"!\" mark at the end.", Component: Invalid },
  { fn: "Locked", title: "Disabled and read-only", description: "disabled gives a dashed line; readOnly keeps a fine line, and the text stays readable.", Component: Locked },
]

const STATES = ["default", "hover", "focus", "filled", "error", "read-only", "disabled"] as const

export function States() {
  return (
    <div className="space-y-6">
      <StateGrid
        rows={["sm", "default", "lg"] as const}
        cols={STATES}
        minCol="10rem"
        cell={(size, s) => (
          <Input
            inputSize={size}
            {...force(s)}
            tabIndex={-1}
            aria-label={`${size} ${s}`}
            placeholder={s === "default" || s === "hover" || s === "focus" ? "Placeholder" : undefined}
            defaultValue={s === "default" || s === "hover" || s === "focus" ? undefined : "Chapter 12"}
            aria-invalid={s === "error" || undefined}
            readOnly={s === "read-only"}
            disabled={s === "disabled"}
          />
        )}
      />
    </div>
  )
}

export function Thumb() {
  return (
    <div className="grid w-48 gap-2">
      <Input inputSize="sm" placeholder="Pen name" aria-label="Pen name" />
      <Input inputSize="sm" defaultValue="reader@" aria-invalid aria-label="Email" />
    </div>
  )
}
