import { Spinner } from "@registry/manga/ui/spinner"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <span className="inline-flex items-center gap-2 text-base">
      <Spinner /> Loading the next chapter…
    </span>
  )
}

function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Spinner className="size-4" />
      <Spinner />
      <Spinner className="size-10" />
    </div>
  )
}

function Inline() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <span className="inline-flex items-center gap-2 text-sm">
        <Spinner className="size-4" /> Saving page 9…
      </span>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sizes", title: "Sizes", description: "className sets the size: size-4 for a line of text, the default for a button, size-10 for a whole panel.", Component: Sizes },
  { fn: "Inline", title: "Inline with text", description: "A small spinner beside a short status line, sized with size-4 to match the text.", Component: Inline },
]

export function States() {
  return (
    <Tiles>
      <Tile label="default" size="lg">
        <Spinner />
      </Tile>
      <Tile label="size-10" size="lg">
        <Spinner className="size-10" />
      </Tile>
      <Tile label="with text" size="lg">
        <span className="inline-flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Loading
        </span>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Spinner className="size-12" />
}
