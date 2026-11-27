import { Choice, Flag, Playground, Slider, jsx } from "../playground"
import { useState } from "react"
import { SpeedLines } from "@registry/manga/signature/speed-lines"
import type { Example } from "../registry"

export function Preview() {
  const [variant, setVariant] = useState<"focus" | "motion">("focus")
  const [density, setDensity] = useState(0.6)
  const [originX, setOriginX] = useState(50)
  const [originY, setOriginY] = useState(50)
  const [hole, setHole] = useState(0.35)
  const [direction, setDirection] = useState(0)
  const [animated, setAnimated] = useState(true)
  const focus = variant === "focus"
  const props = focus ? { variant, density, originX, originY, hole, animated } : { variant, density, direction, animated }
  return (
    <div className="grid gap-8">
      <Playground
        preview={
          <SpeedLines {...props} className="grid h-60 w-full max-w-md place-items-center border-ink">
            <span aria-hidden className="font-sfx text-5xl">
              {focus ? "ドン!" : "ZOOM"}
            </span>
          </SpeedLines>
        }
        controls={
          <>
            <Choice label="variant" value={variant} options={["focus", "motion"] as const} onChange={setVariant} />
            <Slider label="density" value={density} min={0.1} max={1} step={0.05} onChange={setDensity} />
            {focus ? (
              <>
                <Slider label="originX (%)" value={originX} min={0} max={100} onChange={setOriginX} />
                <Slider label="originY (%)" value={originY} min={0} max={100} onChange={setOriginY} />
                <Slider label="hole" value={hole} min={0} max={0.9} step={0.05} onChange={setHole} />
              </>
            ) : (
              <Slider label="direction (°)" value={direction} min={-90} max={90} onChange={setDirection} />
            )}
            <Flag label="animated" checked={animated} onChange={setAnimated} />
          </>
        }
        code={jsx(
          "SpeedLines",
          { ...props, className: "grid h-60 place-items-center" },
          { variant: "focus", density: 0.6, originX: 50, originY: 50, hole: 0.35, direction: 0, animated: false },
          `<span aria-hidden className="font-sfx text-5xl">${focus ? "ドン!" : "ZOOM"}</span>`,
        )}
      />
    </div>
  )
}

function Hit() {
  return (
    <div className="flex w-full justify-center">
      <SpeedLines animated className="grid h-56 w-full max-w-md place-items-center border-ink-panel">
        <span aria-hidden className="font-sfx text-6xl">
          ドン!
        </span>
      </SpeedLines>
    </div>
  )
}

function Motion() {
  return (
    <div className="flex w-full justify-center">
      <SpeedLines variant="motion" direction={-12} className="grid h-56 w-full max-w-md place-items-center border-ink-panel">
        <span aria-hidden className="-rotate-6 font-sfx text-5xl">
          ZOOM
        </span>
      </SpeedLines>
    </div>
  )
}

function Quiet() {
  return (
    <div className="flex w-full justify-center">
      <SpeedLines animated="slow" className="grid h-56 w-full max-w-md place-items-center border-ink-panel">
        <span className="font-letter text-3xl uppercase">Chapter three</span>
      </SpeedLines>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Hit", title: "Focus on a hit", description: "variant focus draws lines from the centre, for the moment of impact; hole keeps the centre clear.", Component: Hit },
  { fn: "Motion", title: "Motion lines", description: "variant motion draws parallel lines at direction degrees, for a fast move across the panel.", Component: Motion },
  { fn: "Quiet", title: "Slow background", description: "animated slow redraws the lines about twice a second, quiet enough to sit behind text.", Component: Quiet },
]

export function States() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[
        { label: "focus · hole 0.2", props: { hole: 0.2 } },
        { label: "focus · origin 20/75", props: { originX: 20, originY: 75 } },
        { label: "focus · density 0.3", props: { density: 0.3 } },
        { label: "focus · density 1", props: { density: 1 } },
        { label: "motion · 0°", props: { variant: "motion" as const } },
        { label: "motion · 90°", props: { variant: "motion" as const, direction: 90 } },
        { label: "motion · 30°", props: { variant: "motion" as const, direction: 30 } },
        { label: "motion · density 0.2", props: { variant: "motion" as const, density: 0.2 } },
      ].map(({ label, props }) => (
        <figure key={label} className="space-y-1">
          <SpeedLines {...props} className="h-28 border-ink" />
          <figcaption className="font-mono text-xs">{label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export function Thumb() {
  const [hover, setHover] = useState(false)
  return (
    <SpeedLines
      animated={hover}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid h-28 w-48 place-items-center border-ink"
    >
      <span aria-hidden className="font-sfx text-3xl">ドン!</span>
    </SpeedLines>
  )
}

/** The Playground takes the whole width of the frame, its controls on the right. */
export const previewWide = true
