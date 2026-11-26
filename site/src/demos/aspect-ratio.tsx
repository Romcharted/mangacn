import { AspectRatio } from "@registry/manga/ui/aspect-ratio"
import { artSrc } from "../mapless"

/* A picture from "Mapless" (AI-generated, see public/art/CREDITS.md), cropped to whatever ratio the box has. */
function Art() {
  return <img src={artSrc("suzu-full", 240)} alt="Suzu on a cliff, Kuro over her shoulders" className="size-full object-cover" />
}

const frames = [
  { ratio: 16 / 9, label: "16 / 9", width: "w-full" },
  { ratio: 2 / 3, label: "2 / 3 cover", width: "w-40" },
  { ratio: 1, label: "1 / 1 square", width: "w-56" },
] as const

export function Preview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
      <figure className="ink-case-inner mx-auto w-56 space-y-2 p-2">
        <AspectRatio ratio={1}>
          <Art />
        </AspectRatio>
        <figcaption className="font-mono text-xs">1 / 1 square</figcaption>
      </figure>
    </div>
  )
}

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
