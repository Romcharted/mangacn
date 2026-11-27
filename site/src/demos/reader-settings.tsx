import { useState } from "react"
import { ReaderSettings, defaultReaderSettings, type ReaderSettingsValue } from "@registry/manga/signature/reader-settings"
import type { Example } from "../registry"
import { Tile } from "../state-grid"
import { ForceInside } from "../force-inside"

export function Preview() {
  const [value, setValue] = useState<ReaderSettingsValue>(defaultReaderSettings)
  return (
    <div className="mx-auto grid w-full max-w-md gap-4">
      <div className="ink-case p-4">
        <ReaderSettings value={value} onValueChange={setValue} />
      </div>
      <pre className="w-full overflow-x-auto border-ink-fine p-3 font-mono text-sm">{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}

function ModeOnly() {
  return (
    <div className="mx-auto w-80">
      <ReaderSettings hide={["direction", "fit", "background"]} />
    </div>
  )
}

function ModeLocked() {
  return (
    <div className="mx-auto w-80">
      <ReaderSettings disabled={["mode"]} />
    </div>
  )
}

function StartingValues() {
  return (
    <div className="mx-auto w-80">
      <ReaderSettings defaultValue={{ direction: "rtl", mode: "double", fit: "width", background: "tone" }} />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "ModeOnly", title: "Reading mode only", description: "hide removes the settings you do not want to show; here only the mode is left.", Component: ModeOnly },
  { fn: "ModeLocked", title: "A locked setting", description: "disabled greys a setting out, so it can be seen but not changed.", Component: ModeLocked },
  { fn: "StartingValues", title: "Starting values", description: "defaultValue sets the choices at first; the reader then keeps its own.", Component: StartingValues },
]

export function States() {
  const row = (state?: "hover" | "focus" | "active", selector = "[role=radio][aria-checked=false]") => {
    const el = <ReaderSettings hide={["direction", "fit", "background"]} className="w-full max-w-xs" />
    return state ? (
      <ForceInside state={state} selector={selector}>
        {el}
      </ForceInside>
    ) : (
      el
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Tile label="cell · rest (Page chosen)" size="lg">{row()}</Tile>
      <Tile label="cell · hover (Double)" size="lg">{row("hover")}</Tile>
      <Tile label="cell · focus (Double)" size="lg">{row("focus")}</Tile>
      <Tile label="chosen cell · focus" size="lg">{row("focus", "[role=radio][aria-checked=true]")}</Tile>
      <Tile label="cell · pressed (Double)" size="lg">{row("active")}</Tile>
      <Tile label="setting · disabled (Mode)" size="lg">
        <ReaderSettings hide={["direction", "fit", "background"]} disabled={["mode"]} className="w-full max-w-xs" />
      </Tile>
      <Tile label="every setting · manga, double, width, tone" size="full">
        <ReaderSettings defaultValue={{ direction: "rtl", mode: "double", fit: "width", background: "tone" }} className="w-full max-w-sm" />
      </Tile>
    </div>
  )
}

/** Live: switch the reading mode. */
export function Thumb() {
  return (
    <div className="w-40">
      <ReaderSettings hide={["direction", "fit", "background"]} />
    </div>
  )
}
