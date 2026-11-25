import { Checkbox } from "@registry/manga/ui/checkbox"
import { StateGrid, force } from "../state-grid"

export function Preview() {
  return (
    <div className="grid gap-3">
      {["Notify me when a chapter drops", "Show spoilers", "Read right to left"].map((label, i) => (
        <label key={label} className="flex items-center gap-3">
          <Checkbox defaultChecked={i === 0} />
          <span>{label}</span>
        </label>
      ))}
    </div>
  )
}

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
