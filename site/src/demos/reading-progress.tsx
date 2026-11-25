import { useRef, useState } from "react"
import { Tile, Tiles } from "../state-grid"
import { Slider } from "@registry/manga/ui/slider"
import { ReadingProgress } from "@registry/manga/signature/reading-progress"

const CHAPTER = [
  "The last train left without her. Mio counted the lights of the platform, one by one, until the station went dark.",
  "Above the city, the moon hung low and round, close enough to touch from the roof of the old water tower.",
  "She climbed. Rung after rung, the wind pulled at her coat, and the streets below turned into lines of ink.",
  "At the top, someone was already waiting: a figure in a long scarf, facing the skyline, perfectly still.",
  "“You are late,” it said, without turning around. “The city does not wait for anyone.”",
  "Mio caught her breath. Far away, a siren rose and fell, and every window on the avenue went out at once.",
  "“Then we run,” she said. The figure smiled for the first time, and the roof began to shake.",
  "To be continued in chapter 13.",
]

function ScrollBox() {
  const box = useRef<HTMLDivElement>(null)
  return (
    <div className="grid gap-2">
      <ReadingProgress target={box} label="Chapter 12 read" showValue />
      <div
        ref={box}
        tabIndex={0}
        aria-label="Chapter 12 text"
        className="h-64 overflow-y-auto border-ink bg-background p-4 focus-ink"
      >
        <h3 className="mb-3 font-letter text-xl tracking-wide uppercase">Chapter 12 · Night Run</h3>
        <div className="grid gap-4 leading-relaxed">
          {CHAPTER.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

const PAGES = 8

export function Preview() {
  const [page, setPage] = useState(3)
  return (
    <div className="grid max-w-xl gap-8">
      <ScrollBox />
      <div className="grid gap-3">
        <span id="rp-pages" className="font-letter text-base tracking-wide uppercase">
          Pages read
        </span>
        <ReadingProgress
          value={(page / PAGES) * 100}
          label="Pages read"
          showValue
          valueText={`Page ${page} / ${PAGES}`}
        />
        <Slider
          value={[page]}
          min={0}
          max={PAGES}
          step={1}
          aria-labelledby="rp-pages"
          onValueChange={(v: number | readonly number[]) => setPage(Array.isArray(v) ? (v as readonly number[])[0] : (v as number))}
        />
      </div>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="0 %" size="lg">
        <ReadingProgress value={0} showValue />
      </Tile>
      <Tile label="42 %" size="lg">
        <ReadingProgress value={42} showValue />
      </Tile>
      <Tile label="100 %" size="lg">
        <ReadingProgress value={100} showValue />
      </Tile>
      <Tile label="reading rtl · 42 %" size="lg">
        <div data-reading="rtl" className="w-full">
          <ReadingProgress value={42} showValue />
        </div>
      </Tile>
      <Tile label="page text · 3 / 8" size="lg">
        <ReadingProgress value={37.5} showValue valueText="Page 3 / 8" />
      </Tile>
      <Tile label="no text" size="lg">
        <ReadingProgress value={62} />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div aria-hidden className="grid w-48 gap-2">
      <ReadingProgress value={62} showValue />
      <div className="grid gap-1.5 border-ink-fine bg-background p-2">
        <span className="h-1.5 w-full bg-foreground" />
        <span className="h-1.5 w-4/5 bg-foreground" />
        <span className="h-1.5 w-3/5 bg-foreground" />
      </div>
    </div>
  )
}
