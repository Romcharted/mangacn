import { Input } from "@registry/manga/ui/input"
import { StateGrid, force } from "../state-grid"

export function Preview() {
  return (
    <div className="grid max-w-md gap-4">
      <label className="grid gap-1.5">
        <span className="font-letter text-base uppercase">Pen name</span>
        <Input placeholder="Your name on the cover" />
      </label>
      <label className="grid gap-1.5">
        <span className="font-letter text-base uppercase">Email</span>
        <Input type="email" defaultValue="reader@" aria-invalid />
        <span className="text-sm text-destructive">! That email is missing its domain.</span>
      </label>
    </div>
  )
}

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
