import { useId, type ReactNode } from "react"
import { Switch } from "@registry/manga/ui/switch"
import { Code } from "./copy"

/** Preview + controls + the usage code, kept in sync. Showcase only. */
export function Playground({ preview, controls, code }: { preview: ReactNode; controls: ReactNode; code: string }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid min-h-64 place-items-center overflow-hidden border-ink-panel bg-background p-4">{preview}</div>
        <fieldset className="grid content-start gap-4 border-ink p-3">
          <legend className="px-1 font-letter text-sm uppercase">Controls</legend>
          {controls}
        </fieldset>
      </div>
      <Code text={code} />
    </div>
  )
}

/** One frame split into cells, the chosen cell in ink (a radio group). */
export function Choice<T extends string>(props: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  const id = useId()
  return (
    <div className="grid gap-1">
      <span id={id} className="font-mono text-xs">
        {props.label}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap border-ink">
        {props.options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={o === props.value}
            onClick={() => props.onChange(o)}
            className="relative -ms-px flex-auto border-s-[length:var(--mg-bw-fine)] border-border px-2 py-1 font-letter text-sm uppercase first:ms-0 first:border-s-0 hover:shadow-[inset_0_-3px_0_var(--foreground)] focus-ink focus-visible:z-10 aria-checked:ink-fill aria-checked:hover:shadow-none"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Slider(props: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  const id = useId()
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="flex justify-between font-mono text-xs">
        <span>{props.label}</span>
        <output htmlFor={id}>{props.value}</output>
      </label>
      <input
        id={id}
        type="range"
        className="mg-range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  )
}

export function Flag(props: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={id} className="font-mono text-xs">
        {props.label}
      </label>
      <Switch id={id} checked={props.checked} onCheckedChange={(v: boolean) => props.onChange(v)} />
    </div>
  )
}

/** `<Name a="x" b={1}>children</Name>`, leaving out props that equal their default. */
export function jsx(name: string, props: Record<string, string | number | boolean | undefined>, defaults: Record<string, unknown>, children?: string) {
  const attrs = Object.entries(props)
    .filter(([k, v]) => v !== undefined && v !== defaults[k])
    .map(([k, v]) => (v === true ? k : typeof v === "string" ? `${k}="${v}"` : `${k}={${v}}`))
  const open = [name, ...attrs].join(attrs.length > 3 ? "\n  " : " ")
  const sep = attrs.length > 3 ? "\n" : ""
  return children === undefined ? `<${open}${sep} />` : `<${open}${sep}>\n  ${children}\n</${name}>`
}
