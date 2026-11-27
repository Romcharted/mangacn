import { Manpu, type ManpuKind } from "@registry/manga/signature/manpu"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

const KINDS: ManpuKind[] = ["anger", "sweat", "surprise", "question", "sparkle", "gloom", "love", "sigh"]

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-4xl">
      <Manpu kind="anger" />
      <Manpu kind="sweat" />
      <Manpu kind="surprise" />
    </div>
  )
}

function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Manpu kind="sparkle" size="1em" />
      <Manpu kind="sparkle" size="2em" />
      <Manpu kind="sparkle" size="4em" />
    </div>
  )
}

function BesideText() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-2xl">
      <span>Wait, the map moved?</span>
      <Manpu kind="question" size="1em" />
    </div>
  )
}

function Labelled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-4xl">
      <Manpu kind="anger" size="3em" label="Angry" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sizes", title: "Sizes", description: "size sets the mark in any CSS length, so it follows the text beside it.", Component: Sizes },
  { fn: "BesideText", title: "Beside a line", description: "A 1em mark sits on the line of text, as a reaction to what was just said.", Component: BesideText },
  { fn: "Labelled", title: "With a label", description: "label names the mark for screen readers; without it the mark stays decorative.", Component: Labelled },
]

export function States() {
  return (
    <Tiles>
      {KINDS.map((k) => (
        <Tile key={k} label={k}>
          <Manpu kind={k} size="3rem" animated={false} />
        </Tile>
      ))}
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="flex items-center gap-4 text-4xl">
      <Manpu kind="anger" />
      <Manpu kind="sweat" />
      <Manpu kind="surprise" />
    </div>
  )
}
