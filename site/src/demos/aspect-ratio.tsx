import { AspectRatio } from "@registry/manga/ui/aspect-ratio"
import type { Example } from "../registry"
import { Art as Picture } from "../mapless"

/* A picture from "Mapless" (AI-generated, see public/art/CREDITS.md), cropped to whatever ratio the box has. */
function Art() {
  // the wide bridge: enough pixels for every frame of the demo, the 16 / 9 one included
  return <Picture name="bridge-far" shown="36rem" className="size-full object-cover" />
}

const frames = [
  { ratio: 16 / 9, label: "16 / 9", width: "w-full" },
  { ratio: 2 / 3, label: "2 / 3 cover", width: "w-40" },
  { ratio: 1, label: "1 / 1 square", width: "w-56" },
] as const

export function Preview() {
  return (
    <figure className="ink-case-inner w-72 space-y-2 p-2">
      <AspectRatio ratio={16 / 9}>
        <Art />
      </AspectRatio>
      <figcaption className="font-mono text-xs">16 / 9</figcaption>
    </figure>
  )
}

function Portrait() {
  return (
    <figure className="ink-case-inner mx-auto w-40 space-y-2 p-2">
      <AspectRatio ratio={2 / 3}>
        <Art />
      </AspectRatio>
      <figcaption className="font-mono text-xs">2 / 3 cover</figcaption>
    </figure>
  )
}

function Square() {
  return (
    <figure className="ink-case-inner mx-auto w-56 space-y-2 p-2">
      <AspectRatio ratio={1}>
        <Art />
      </AspectRatio>
      <figcaption className="font-mono text-xs">1 / 1 square</figcaption>
    </figure>
  )
}

function SideBySide() {
  return (
    <div className="grid w-full max-w-xl items-end gap-4 sm:grid-cols-2">
      <figure className="ink-case-inner space-y-2 p-2">
        <AspectRatio ratio={16 / 9}>
          <Art />
        </AspectRatio>
        <figcaption className="font-mono text-xs">16 / 9</figcaption>
      </figure>
      <figure className="ink-case-inner mx-auto w-40 space-y-2 p-2">
        <AspectRatio ratio={2 / 3}>
          <Art />
        </AspectRatio>
        <figcaption className="font-mono text-xs">2 / 3 cover</figcaption>
      </figure>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Portrait", title: "Portrait cover", description: "ratio={2 / 3} gives a book-cover box; the picture is cropped to fill it.", Component: Portrait },
  { fn: "Square", title: "Square", description: "ratio={1} gives a square box, for frames of equal sides, such as an avatar or a thumbnail.", Component: Square },
  { fn: "SideBySide", title: "Side by side", description: "Two ratios in one row: each box keeps its own shape whatever the width.", Component: SideBySide, wide: true },
]

export function States() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {frames.map((f) => (
        <figure key={f.label} className={`ink-case-inner mx-auto space-y-2 p-2 ${f.width}`}>
          <AspectRatio ratio={f.ratio}>
            <Art />
          </AspectRatio>
          <figcaption className="font-mono text-xs">{f.label}</figcaption>
        </figure>
      ))}
    </div>
  )
}

export function Thumb() {
  return (
    <div className="mx-auto w-28">
      <AspectRatio ratio={2 / 3}>
        <Art />
      </AspectRatio>
    </div>
  )
}
