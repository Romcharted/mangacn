import { useEffect, useState, useSyncExternalStore } from "react"
import { cn } from "cn"
import { Choice, Playground, Slider, jsx } from "../playground"
import { Tile, Tiles } from "../state-grid"
import { TonedImage, type TonedPattern } from "@registry/manga/signature/toned-image"
import type { Example } from "../registry"
import { artSrc } from "../mapless"

/** A picture from "Mapless", the showcase's series (AI-generated, see public/art/CREDITS.md): already inked, toned here only to show the effect. */
const SCENE = artSrc("lighthouse-night", 320)

const PATTERNS = ["dots", "lines", "cross", "noise"] as const

/* The playground settings live outside Preview so a click on a state tile below can load them. */
type Settings = { pattern: TonedPattern; density: number; contrast: number; threshold: number }
const DEFAULTS: Settings = { pattern: "dots", density: 6, contrast: 1, threshold: 0 }
let current = DEFAULTS
const listeners = new Set<() => void>()
const store = {
  subscribe: (fn: () => void) => (listeners.add(fn), () => void listeners.delete(fn)),
  get: () => current,
  set: (patch: Partial<Settings>) => {
    current = { ...current, ...patch }
    listeners.forEach((fn) => fn())
  },
}
const useSettings = () => useSyncExternalStore(store.subscribe, store.get)

const STATES: { label: string; settings: Settings }[] = [
  ...PATTERNS.map((pattern) => ({ label: `pattern · ${pattern}`, settings: { ...DEFAULTS, pattern } })),
  { label: "contrast · 0.5", settings: { ...DEFAULTS, contrast: 0.5 } },
  { label: "contrast · 2", settings: { ...DEFAULTS, contrast: 2 } },
  { label: "threshold · 0.4", settings: { ...DEFAULTS, threshold: 0.4 } },
]
const same = (a: Settings, b: Settings) =>
  a.pattern === b.pattern && a.density === b.density && a.contrast === b.contrast && a.threshold === b.threshold

function DropZone({ onFile }: { onFile: (file: File) => void }) {
  const [over, setOver] = useState(false)
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const file = e.dataTransfer.files[0]
        if (file) onFile(file)
      }}
      className={cn(
        "hover-invert grid cursor-pointer place-items-center gap-1 border-ink-fine p-6 text-center focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ring",
        over && "ink-fill",
      )}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]
          if (file) onFile(file)
        }}
      />
      <span className="font-letter text-lg uppercase">Drop your own picture here, or click to choose one</span>
      <span className="text-sm">It is toned in your browser and never uploaded.</span>
    </label>
  )
}

export function Preview() {
  const settings = useSettings()
  const { pattern, density, contrast, threshold } = settings
  return (
    <div className="grid gap-8">
      <Playground
        preview={
          <TonedImage src={SCENE} alt="A lighthouse on a floating island at night" {...settings} className="aspect-[4/3] w-full max-w-sm border-ink" />
        }
        controls={
          <>
            <Choice label="pattern" value={pattern} options={PATTERNS} onChange={(pattern) => store.set({ pattern })} />
            <Slider
              label="density (px)"
              value={density}
              min={3}
              max={20}
              step={1}
              onChange={(density) => store.set({ density })}
            />
            <Slider
              label="contrast"
              value={contrast}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(contrast) => store.set({ contrast })}
            />
            <Slider
              label="threshold"
              value={threshold}
              min={0}
              max={0.9}
              step={0.05}
              onChange={(threshold) => store.set({ threshold })}
            />
          </>
        }
        code={jsx("TonedImage", { src: "/picture.jpg", alt: "Picture" }, { pattern, density, contrast, threshold })}
      />
    </div>
  )
}

function Lines() {
  return (
    <div className="flex w-full justify-center">
      <TonedImage src={SCENE} alt="A lighthouse on a floating island at night" pattern="lines" density={10} contrast={1.4} className="aspect-[4/3] w-full max-w-sm border-ink" />
    </div>
  )
}

function Threshold() {
  return (
    <div className="flex w-full justify-center">
      <TonedImage src={SCENE} alt="A lighthouse on a floating island at night" density={8} threshold={0.4} className="aspect-[4/3] w-full max-w-sm border-ink" />
    </div>
  )
}

function OwnPicture() {
  const settings = useSettings()
  const [own, setOwn] = useState<string | null>(null)

  // the object URL of a previous pick is released when a new one replaces it, or on unmount
  useEffect(
    () => () => {
      if (own) URL.revokeObjectURL(own)
    },
    [own],
  )

  const pick = (file: File) => {
    if (file.type.startsWith("image/")) setOwn(URL.createObjectURL(file))
  }

  return (
    <div className="flex w-full justify-center">
      <div className="grid w-full max-w-sm gap-3">
        <DropZone onFile={pick} />
        {own && <TonedImage src={own} alt="Your picture, toned" {...settings} className="aspect-[4/3] w-full border-ink" />}
      </div>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Lines", title: "Bars instead of dots", description: "pattern lines draws parallel bars; contrast above 1 pushes the lights and the shadows apart.", Component: Lines },
  { fn: "Threshold", title: "Solid ink in the dark", description: "threshold above 0 turns the darkest areas solid ink first, for a bolder drawing.", Component: Threshold },
  { fn: "OwnPicture", title: "Your own picture", description: "Drop a picture on the frame or choose one: it is toned in the browser and never uploaded.", Component: OwnPicture },
]

export function States() {
  const settings = useSettings()
  return (
    <Tiles>
      {STATES.map((state) => (
        <Tile
          key={state.label}
          label={state.label}
          picked={same(settings, state.settings)}
          onPick={() => {
            store.set(state.settings)
            document.querySelector("[data-playground]")?.scrollIntoView({ behavior: "smooth", block: "center" })
          }}
        >
          <TonedImage src={SCENE} alt="" {...state.settings} className="size-28 border-ink" />
        </Tile>
      ))}
    </Tiles>
  )
}

/** Live: a click changes the pattern. */
export function Thumb() {
  const [i, setI] = useState(0)
  return (
    <button type="button" aria-label={`Pattern: ${PATTERNS[i]}. Next pattern`} onClick={() => setI((n) => (n + 1) % PATTERNS.length)} className="focus-ink">
      <TonedImage src={SCENE} alt="" density={5} pattern={PATTERNS[i]} className="h-32 w-44 border-ink" />
    </button>
  )
}

/** The Playground takes the whole width of the frame, its controls on the right. */
export const previewWide = true
