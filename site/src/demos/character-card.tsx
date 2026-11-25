import { CharacterCard } from "@registry/manga/signature/character-card"
import { Tile, Tiles, force } from "../state-grid"

/** Drawn portraits as data URLs: no external photo. */
const portrait = (hair: string, skin: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="${bg}"/><path d="M30 150 C40 100 160 100 170 150Z" fill="#222"/><rect x="88" y="86" width="24" height="26" fill="${skin}"/><ellipse cx="100" cy="64" rx="30" ry="36" fill="${skin}"/><path d="M68 60 C66 22 134 22 132 60 C122 44 80 42 68 60Z" fill="${hair}"/></svg>`,
  )}`

const KAI = portrait("#111", "#8a8a8a", "#d9d9d9")
const MIRA = portrait("#333", "#b5b5b5", "#9c9c9c")

const STATS = [
  { label: "Power", value: 82 },
  { label: "Speed", value: 6, max: 10 },
  { label: "Nerve", value: 47 },
]

export function Preview() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-8 py-2">
      <CharacterCard
        name="Kai Mori"
        role="Courier, Lower Ward"
        image={KAI}
        stats={STATS}
        tags={["Rooftops", "Silent"]}
        quote="The bridge is closed. We go over it."
        interactive
      />
      <CharacterCard
        name="Mira Oda"
        role="Ink Engineer"
        stats={[
          { label: "Craft", value: 9, max: 10 },
          { label: "Trust", value: 31 },
        ]}
        tags={["Night shift"]}
        quote="Hold still. The line is drying."
      />
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="card · rest" size="lg">
        <CharacterCard name="Kai Mori" role="Courier" image={KAI} stats={STATS.slice(0, 2)} className="max-w-56" />
      </Tile>
      <Tile label="card · hover" size="lg">
        <CharacterCard name="Kai Mori" role="Courier" image={KAI} stats={STATS.slice(0, 2)} interactive {...force("hover")} className="max-w-56" />
      </Tile>
      <Tile label="card · focus" size="lg">
        <CharacterCard name="Kai Mori" role="Courier" image={KAI} stats={STATS.slice(0, 2)} interactive {...force("focus")} className="max-w-56" />
      </Tile>
      <Tile label="no portrait · initials" size="lg">
        <CharacterCard name="Mira Oda" role="Ink Engineer" stats={[{ label: "Craft", value: 9, max: 10 }]} className="max-w-56" />
      </Tile>
      <Tile label="second portrait · toned" size="lg">
        <CharacterCard name="Mira Oda" role="Ink Engineer" image={MIRA} className="max-w-56" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <CharacterCard name="Kai Mori" role="Courier" image={KAI} stats={[{ label: "Power", value: 82 }]} className="max-w-56" />
}
