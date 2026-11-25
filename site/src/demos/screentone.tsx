import { Choice, Playground, Slider, jsx } from "../playground"
import { useState } from "react"
import { Screentone, type ScreentonePattern } from "@registry/manga/signature/screentone"
import { Tile, Tiles } from "../state-grid"

const PATTERNS = ["dots", "lines", "cross", "noise"] as const
const FADES = ["none", "top", "bottom", "start", "end"] as const

export function Preview() {
  const [pattern, setPattern] = useState<ScreentonePattern>("dots")
  const [density, setDensity] = useState(35)
  const [angle, setAngle] = useState(45)
  const [size, setSize] = useState(6)
  const [fade, setFade] = useState<(typeof FADES)[number]>("bottom")
  const props = { pattern, density, angle, size, fade }
  return (
    <div className="grid gap-8">
      <Playground
        preview={<Screentone {...props} className="h-56 w-full max-w-md border-ink" />}
        controls={
          <>
            <Choice label="pattern" value={pattern} options={PATTERNS} onChange={setPattern} />
            <Slider label="density (%)" value={density} min={5} max={60} onChange={setDensity} />
            <Slider label="angle (°)" value={angle} min={0} max={90} onChange={setAngle} />
            <Slider label="size (px)" value={size} min={4} max={14} onChange={setSize} />
            <Choice label="fade" value={fade} options={FADES} onChange={setFade} />
          </>
        }
        code={jsx("Screentone", { ...props, className: "h-56 border-ink" }, { pattern: "dots", density: 20, angle: 45, size: 6, fade: "none" })}
      />
      <Examples />
    </div>
  )
}

function Examples() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Screentone density={35} fade="bottom" className="grid h-48 place-items-center border-ink-panel">
        <span className="on-tone font-letter text-3xl uppercase">Night falls</span>
      </Screentone>
      <div className="relative h-48 border-ink-panel bg-background">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 size-full text-foreground" aria-hidden>
          <path d="M0 100V60l30-20 30 26 40-40 50 50 50-30v54z" fill="currentColor" />
        </svg>
        <Screentone as="layer" pattern="lines" density={18} angle={-20} fade="start" className="text-background" />
      </div>
    </div>
  )
}

export function States() {
  const patterns: ScreentonePattern[] = ["dots", "lines", "cross", "noise"]
  return (
    <Tiles>
      {patterns.flatMap((p) =>
        [10, 35].map((d) => (
          <Tile key={p + d} label={`${p} · ${d}%`}>
            <Screentone pattern={p} density={d} className="h-20 w-full border-ink" />
          </Tile>
        )),
      )}
      {(["top", "bottom", "start", "end"] as const).map((fade) => (
        <Tile key={fade} label={`fade · ${fade}`}>
          <Screentone density={45} fade={fade} className="h-20 w-full border-ink" />
        </Tile>
      ))}
      {[0, 15, 60].map((angle) => (
        <Tile key={angle} label={`angle · ${angle}° · size 9`}>
          <Screentone density={25} angle={angle} size={9} className="h-20 w-full border-ink" />
        </Tile>
      ))}
    </Tiles>
  )
}

export function Thumb() {
  const [hover, setHover] = useState(false)
  return (
    <Screentone
      density={hover ? 60 : 30}
      fade="bottom"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="h-28 w-48 border-ink"
    />
  )
}
