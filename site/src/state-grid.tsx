import type { ReactNode } from "react"

/**
 * Frozen states as labelled tiles (variant · state) that wrap: no table, no horizontal scroll.
 * Hover / focus / pressed are forced with data-force (see vite.config.ts, showcase only).
 */
export type Force = "hover" | "focus" | "active"
export const force = (state: string): { "data-force"?: Force } =>
  state === "hover" || state === "focus" || state === "active" ? { "data-force": state } : {}

export function Tile({
  label,
  children,
  size = "md",
  onPick,
  picked,
}: {
  label: string
  children: ReactNode
  size?: "md" | "lg" | "full"
  /** Makes the tile a button that loads this state into the live preview above. */
  onPick?: () => void
  picked?: boolean
}) {
  const basis = size === "full" ? "basis-full" : size === "lg" ? "grow basis-72" : "grow basis-36"
  if (onPick)
    return (
      <button
        type="button"
        aria-pressed={picked}
        title="Load this state in the preview"
        onClick={onPick}
        className={`group flex min-w-0 cursor-pointer flex-col border-ink-fine bg-background text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-ink ${basis}`}
      >
        <span className="grid min-h-24 w-full flex-1 place-items-center p-4">{children}</span>
        <span className="flex w-full items-center justify-between gap-2 border-t-[length:var(--mg-bw-fine)] border-border px-2 py-1 font-mono text-xs group-hover:bg-foreground group-hover:text-background group-aria-pressed:bg-foreground group-aria-pressed:text-background">
          {label}
          <span aria-hidden>{picked ? "● shown" : "→ try it"}</span>
        </span>
      </button>
    )
  return (
    <figure className={`flex min-w-0 flex-col border-ink-fine bg-background ${basis}`}>
      <div className="grid min-h-24 flex-1 place-items-center p-4">{children}</div>
      <figcaption className="border-t-[length:var(--mg-bw-fine)] border-border px-2 py-1 font-mono text-xs">{label}</figcaption>
    </figure>
  )
}

export function StateGrid<R extends string, C extends string>(props: {
  rows: readonly R[]
  cols: readonly C[]
  cell: (row: R, col: C) => ReactNode
  rowLabel?: (row: R) => string
  minCol?: string
}) {
  return (
    <div className="space-y-4">
      {props.rows.map((r) => (
        <div key={r} className="flex flex-wrap gap-2" role="group" aria-label={props.rowLabel ? props.rowLabel(r) : r}>
          {props.cols.map((c) => (
            <Tile key={c} label={`${props.rowLabel ? props.rowLabel(r) : r} · ${c}`}>
              {props.cell(r, c)}
            </Tile>
          ))}
        </div>
      ))}
    </div>
  )
}

export function Tiles({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}
