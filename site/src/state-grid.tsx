import type { ReactNode } from "react"

/**
 * Frozen state grid: rows × columns, every cell rendered statically.
 * Hover / focus / pressed are forced with data-force (see vite.config.ts).
 */
export type Force = "hover" | "focus" | "active"
export const force = (state: string): { "data-force"?: Force } =>
  state === "hover" || state === "focus" || state === "active" ? { "data-force": state } : {}

export function StateGrid<R extends string, C extends string>(props: {
  rows: readonly R[]
  cols: readonly C[]
  cell: (row: R, col: C) => ReactNode
  rowLabel?: (row: R) => string
  minCol?: string
}) {
  return (
    <div className="overflow-x-auto border-ink" tabIndex={0} role="region" aria-label="States">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="ink-fill">
            <th scope="col" className="px-3 py-1.5 text-start font-letter uppercase">
              <span className="sr-only">Variant</span>
            </th>
            {props.cols.map((c) => (
              <th key={c} scope="col" className="px-3 py-1.5 text-start font-letter uppercase">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((r) => (
            <tr key={r} className="border-t-[length:var(--mg-bw-fine)] border-border">
              <th scope="row" className="px-3 py-3 text-start align-middle font-mono text-xs font-normal">
                {props.rowLabel ? props.rowLabel(r) : r}
              </th>
              {props.cols.map((c) => (
                <td key={c} className="px-3 py-4 align-middle" style={{ minWidth: props.minCol ?? "8rem" }}>
                  {props.cell(r, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
