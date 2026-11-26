"use client"

import * as React from "react"
import { cn } from "cn"

/*
 * Reader settings: reading direction, mode (page, double page, strip), fit and background, each a row of
 * choices drawn like boxed tabs (one frame split into cells). Each row is a radio group: arrows move and
 * choose, Tab leaves. Gestures: G1 the panel is a case, G2 the chosen cell is an ink flat that sweeps in
 * (fill-in), G3 hover thickens the line (cells of a group), focus stays inside the cell, pressed 1px down.
 * Put it in a Sheet, a Popover or a page; it only holds the value.
 */

export type ReaderDirection = "rtl" | "ltr"
export type ReaderMode = "single" | "double" | "strip"
export type ReaderFit = "contain" | "width" | "height"
export type ReaderBackground = "paper" | "ink" | "tone"
export type ReaderSettingsValue = { direction: ReaderDirection; mode: ReaderMode; fit: ReaderFit; background: ReaderBackground }
export type ReaderSettingKey = keyof ReaderSettingsValue

export const defaultReaderSettings: ReaderSettingsValue = { direction: "rtl", mode: "single", fit: "contain", background: "paper" }

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const }

/** Small pictograms, 24 × 24, drawn in the current colour. */
const ICONS: Record<string, React.ReactNode> = {
  rtl: (
    <>
      <rect x="5" y="3" width="14" height="18" {...stroke} />
      <path d="M16 12H8m3-3-3 3 3 3" {...stroke} />
    </>
  ),
  ltr: (
    <>
      <rect x="5" y="3" width="14" height="18" {...stroke} />
      <path d="M8 12h8m-3-3 3 3-3 3" {...stroke} />
    </>
  ),
  single: <rect x="6" y="3" width="12" height="18" {...stroke} />,
  double: (
    <>
      <rect x="2" y="4" width="10" height="16" {...stroke} />
      <rect x="12" y="4" width="10" height="16" {...stroke} />
    </>
  ),
  strip: (
    <>
      <rect x="7" y="1" width="10" height="9" {...stroke} />
      <rect x="7" y="12" width="10" height="11" {...stroke} />
    </>
  ),
  contain: (
    <>
      <rect x="2" y="2" width="20" height="20" {...stroke} />
      <rect x="8" y="5" width="8" height="14" fill="currentColor" />
    </>
  ),
  width: (
    <>
      <path d="M2 2v20M22 2v20" {...stroke} />
      <rect x="5" y="6" width="14" height="12" fill="currentColor" />
    </>
  ),
  height: (
    <>
      <path d="M2 2h20M2 22h20" {...stroke} />
      <rect x="7" y="5" width="10" height="14" fill="currentColor" />
    </>
  ),
  paper: <rect x="3" y="3" width="18" height="18" fill="var(--background)" {...{ stroke: "currentColor", strokeWidth: 2 }} />,
  ink: <rect x="3" y="3" width="18" height="18" fill="currentColor" {...{ stroke: "currentColor", strokeWidth: 2 }} />,
}

/** The tone swatch: 24px, the smallest size a tone may have (Rule C). */
function ToneSwatch() {
  return <span aria-hidden className="block size-6 shrink-0 border-2 border-current bg-background tone-35" />
}

type Option<V extends string> = { value: V; label: string }

const GROUPS: { key: ReaderSettingKey; legend: string; options: Option<string>[] }[] = [
  {
    key: "direction",
    legend: "Reading order",
    options: [
      { value: "rtl", label: "Manga · right to left" },
      { value: "ltr", label: "Western · left to right" },
    ],
  },
  {
    key: "mode",
    legend: "Mode",
    options: [
      { value: "single", label: "Page" },
      { value: "double", label: "Double" },
      { value: "strip", label: "Strip" },
    ],
  },
  {
    key: "fit",
    legend: "Fit",
    options: [
      { value: "contain", label: "Whole page" },
      { value: "width", label: "Width" },
      { value: "height", label: "Height" },
    ],
  },
  {
    key: "background",
    legend: "Background",
    options: [
      { value: "paper", label: "Paper" },
      { value: "ink", label: "Ink" },
      { value: "tone", label: "Tone" },
    ],
  },
]

export type ReaderSettingsProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: ReaderSettingsValue
  defaultValue?: ReaderSettingsValue
  onValueChange?: (value: ReaderSettingsValue) => void
  /** Settings to leave out (e.g. ["fit"] for a strip reader). */
  hide?: ReaderSettingKey[]
  /** Settings shown but not changeable (e.g. a mode the screen cannot show). */
  disabled?: ReaderSettingKey[]
}

function ReaderSettings({ value: valueProp, defaultValue = defaultReaderSettings, onValueChange, hide = [], disabled = [], className, ...props }: ReaderSettingsProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const id = React.useId()
  const set = <K extends ReaderSettingKey>(key: K, v: ReaderSettingsValue[K]) => {
    if (value[key] === v) return
    const nextValue = { ...value, [key]: v }
    if (valueProp === undefined) setInner(nextValue)
    onValueChange?.(nextValue)
  }

  // radio group keys: arrows move and choose, following the writing direction
  const onKeyDown = (key: ReaderSettingKey, options: Option<string>[]) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl"
    const step: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }
    const at = options.findIndex((o) => o.value === value[key])
    let to = -1
    if (e.key in step) to = (at + step[e.key] + options.length) % options.length
    else if (e.key === "Home") to = 0
    else if (e.key === "End") to = options.length - 1
    if (to < 0) return
    e.preventDefault()
    set(key, options[to].value as never)
    e.currentTarget.querySelectorAll<HTMLElement>("[role=radio]")[to]?.focus()
  }

  return (
    <div data-manga="reader-settings" className={cn("grid gap-4 text-foreground", className)} {...props}>
      {GROUPS.filter((g) => !hide.includes(g.key)).map((g) => {
        const off = disabled.includes(g.key)
        return (
          <div key={g.key} className="grid gap-1.5">
            <span id={`${id}-${g.key}`} className="font-letter text-sm tracking-wide uppercase">
              {g.legend}
            </span>
            <div
              role="radiogroup"
              aria-labelledby={`${id}-${g.key}`}
              aria-disabled={off || undefined}
              onKeyDown={off ? undefined : onKeyDown(g.key, g.options)}
              className={cn(
                "grid auto-cols-fr grid-flow-col border-[length:var(--mg-bw)] border-border bg-background",
                off && "border-dashed",
              )}
            >
              {g.options.map((o) => {
                const checked = value[g.key] === o.value
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    aria-disabled={off || undefined}
                    tabIndex={checked ? 0 : -1}
                    data-value={o.value}
                    onClick={() => !off && set(g.key, o.value as never)}
                    className={cn(
                      "relative flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 border-s-[length:var(--mg-bw)] border-border px-1.5 py-1.5 text-center first:border-s-0",
                      "font-letter text-xs leading-tight tracking-wide text-foreground uppercase",
                      "aria-checked:ink-fill aria-checked:fill-in",
                      "[&:hover:not([aria-checked=true]):not([aria-disabled=true])]:hover-thicken active:translate-y-px",
                      "focus-visible:z-10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-ring aria-checked:focus-visible:outline-primary-foreground",
                      // disabled: label on paper, tone frame, not-allowed cursor (dashes on the group frame)
                      "aria-disabled:cursor-not-allowed aria-disabled:tone-frame aria-disabled:[--frame-w:4px] aria-disabled:active:translate-y-0 aria-disabled:aria-checked:bg-none aria-disabled:aria-checked:bg-background aria-disabled:aria-checked:text-foreground aria-disabled:aria-checked:underline aria-disabled:aria-checked:decoration-2 aria-disabled:aria-checked:underline-offset-2",
                    )}
                  >
                    {o.value === "tone" ? (
                      <ToneSwatch />
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0">
                        {ICONS[o.value]}
                      </svg>
                    )}
                    <span className="break-words">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ReaderSettings }
