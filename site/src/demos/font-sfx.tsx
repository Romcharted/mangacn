import { Sfx } from "@registry/manga/signature/sfx"
import type { Example } from "../registry"
import { SizeTiles, Specimen } from "./font-sample"

export function Preview() {
  return <Specimen font="font-sfx" text="SHAKA SHAKA" className="text-5xl uppercase" />
}

function SoundEffect() {
  return <Sfx>BOOM!</Sfx>
}

function Katakana() {
  return <p className="font-sfx text-6xl leading-none">ドドド</p>
}

function Headline() {
  return <p className="max-w-md text-center font-sfx text-3xl leading-tight uppercase">Mapless, volume 3 out now</p>
}

export const examples: Example[] = [
  { fn: "SoundEffect", title: "Sound effects", description: "The Sfx piece draws its onomatopoeia with font-sfx.", Component: SoundEffect },
  { fn: "Katakana", title: "Katakana", description: "Dela Gothic One covers katakana, for sound effects in the original language.", Component: Katakana },
  { fn: "Headline", title: "Headlines", description: "Short, loud titles: the home page and covers use it.", Component: Headline },
]

export function States() {
  return <SizeTiles font="font-sfx" text="DON" />
}
