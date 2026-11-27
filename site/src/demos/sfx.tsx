import { Sfx } from "@registry/manga/signature/sfx"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-6">
      <Sfx size="xl">ドン</Sfx>
      <Sfx size="lg" rotate={8} variant="outline">BAM!</Sfx>
      <Sfx size="md" rotate={-14}>ザッ</Sfx>
    </div>
  )
}

function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Sfx size="sm">ドン</Sfx>
      <Sfx size="md">ドン</Sfx>
      <Sfx size="lg">ドン</Sfx>
      <Sfx size="xl">ドン</Sfx>
    </div>
  )
}

function Outline() {
  return (
    <div className="flex w-full justify-center">
      <div className="grid place-items-center bg-foreground px-10 py-6">
        <Sfx size="lg" variant="outline" rotate={6}>
          BAM!
        </Sfx>
      </div>
    </div>
  )
}

function Labelled() {
  return (
    <div className="flex justify-center">
      <Sfx label="Silence" size="lg" variant="outline">
        シーン
      </Sfx>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sizes", title: "Sizes", description: "sm to xl set the letter size; on a page the sizes follow the page width instead.", Component: Sizes },
  { fn: "Outline", title: "Outline on ink", description: "variant outline swaps the ink letters for paper letters with an ink outline, for a sound over a dark panel.", Component: Outline },
  { fn: "Labelled", title: "With a label", description: "label speaks the effect for screen readers; without it the sound effect is aria-hidden.", Component: Labelled },
]

export function States() {
  return (
    <Tiles>
      {(["sm", "md", "lg", "xl"] as const).map((s) => (
        <Tile key={s} label={`size · ${s}`}>
          <Sfx size={s} animated={false}>ドン</Sfx>
        </Tile>
      ))}
      <Tile label="variant · outline">
        <Sfx size="lg" variant="outline" animated={false}>BAM!</Sfx>
      </Tile>
      <Tile label="rotate · 0">
        <Sfx size="lg" rotate={0} animated={false}>シーン</Sfx>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Sfx size="lg">ドン!</Sfx>
}
