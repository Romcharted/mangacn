import type { Example } from "../registry"
import { SizeTiles, Specimen } from "./font-sample"

const JP = "font-[family-name:var(--font-manga-jp)]"

export function Preview() {
  return <Specimen font={JP} text="地図のない空" />
}

function Furigana() {
  return (
    <p className={`${JP} text-4xl`}>
      <ruby>
        地図<rt className="text-base">ちず</rt>
      </ruby>
      を
      <ruby>
        描<rt className="text-base">か</rt>
      </ruby>
      く
    </p>
  )
}

function Vertical() {
  return <p className={`${JP} h-56 text-2xl leading-loose [writing-mode:vertical-rl]`}>スズは空の地図を描く。クロは眠っている。</p>
}

function Mixed() {
  return <p className={`${JP} max-w-md text-center text-xl`}>Kuro (クロ) means “black”. 黒いインクの竜。</p>
}

export const examples: Example[] = [
  { fn: "Furigana", title: "With furigana", description: "Kanji with their reading above, in ruby text.", Component: Furigana },
  { fn: "Vertical", title: "Vertical text", description: "Japanese reads top to bottom, right to left, as in a printed manga.", Component: Vertical },
  { fn: "Mixed", title: "Mixed with Latin", description: "Base adds it as the Japanese fallback of every face, so mixed lines just work.", Component: Mixed },
]

export function States() {
  return <SizeTiles font={JP} text="地図" />
}
