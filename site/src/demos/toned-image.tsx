import { useEffect, useState } from "react"
import { cn } from "cn"
import { Choice, Playground, Slider, jsx } from "../playground"
import { Tile, Tiles } from "../state-grid"
import { TonedImage, type TonedPattern } from "@registry/manga/signature/toned-image"

/** A drawn city at dusk, as a data URL: no external photo. */
const SCENE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><radialGradient id="s" cx=".7" cy=".3" r=".7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#6b6b6b"/></radialGradient></defs><rect width="400" height="300" fill="url(#s)"/><circle cx="280" cy="90" r="46" fill="#1d1d1d"/><path d="M0 260 L60 180 L100 230 L160 150 L220 240 L280 190 L340 250 L400 170 L400 300 L0 300Z" fill="#444"/><circle cx="140" cy="130" r="26" fill="#111"/><path d="M104 300 C104 200 176 200 176 300Z" fill="#111"/></svg>`,
)}`

const PATTERNS = ["dots", "lines", "cross", "noise"] as const

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
  const [pattern, setPattern] = useState<TonedPattern>("dots")
  const [density, setDensity] = useState(6)
  const [contrast, setContrast] = useState(1)
  const [threshold, setThreshold] = useState(0)
  const [own, setOwn] = useState<string | null>(null)

  // the object URL of a previous pick is released when a new one replaces it, or on unmount
  useEffect(() => () => {
    if (own) URL.revokeObjectURL(own)
  }, [own])

  const settings = { pattern, density, contrast, threshold }
  const pick = (file: File) => {
    if (file.type.startsWith("image/")) setOwn(URL.createObjectURL(file))
  }

  return (
    <div className="grid gap-8">
      <Playground
        preview={
          <TonedImage src={SCENE} alt="A drawn city at dusk" {...settings} className="aspect-[4/3] w-full max-w-sm border-ink" />
        }
        controls={
          <>
            <Choice label="pattern" value={pattern} options={PATTERNS} onChange={setPattern} />
            <Slider label="density (px)" value={density} min={3} max={20} step={1} onChange={setDensity} />
            <Slider label="contrast" value={contrast} min={0.5} max={2} step={0.1} onChange={setContrast} />
            <Slider label="threshold" value={threshold} min={0} max={0.9} step={0.05} onChange={setThreshold} />
          </>
        }
        code={jsx("TonedImage", { src: "/picture.jpg", alt: "Picture" }, { pattern: "dots", density: 6, contrast: 1, threshold: 0 })}
      />
      <div className="grid max-w-sm gap-3">
        <DropZone onFile={pick} />
        {own && <TonedImage src={own} alt="Your picture, toned" {...settings} className="aspect-[4/3] w-full border-ink" />}
      </div>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      {PATTERNS.map((p) => (
        <Tile key={p} label={`pattern · ${p}`}>
          <TonedImage src={SCENE} alt="" pattern={p} className="size-28 border-ink" />
        </Tile>
      ))}
      <Tile label="contrast · 0.5">
        <TonedImage src={SCENE} alt="" contrast={0.5} className="size-28 border-ink" />
      </Tile>
      <Tile label="contrast · 2">
        <TonedImage src={SCENE} alt="" contrast={2} className="size-28 border-ink" />
      </Tile>
      <Tile label="threshold · 0.4">
        <TonedImage src={SCENE} alt="" threshold={0.4} className="size-28 border-ink" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <TonedImage src={SCENE} alt="" density={5} className="h-32 w-44 border-ink" />
}
