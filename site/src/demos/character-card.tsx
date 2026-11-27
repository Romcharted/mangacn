import { CharacterCard } from "@registry/manga/signature/character-card"
import type { Example } from "../registry"
import { Tile, Tiles, force } from "../state-grid"

import { artSrc } from "../mapless"

// The cast of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const KAI = artSrc("suzu-full", 260)
const MIRA = artSrc("eraser-full", 260)

const STATS = [
  { label: "Ink", value: 82 },
  { label: "Speed", value: 6, max: 10 },
  { label: "Nerve", value: 47 },
]

export function Preview() {
  return (
    <div className="flex flex-wrap justify-center gap-8 py-2">
      <CharacterCard
        className="w-64"
        name="Suzu"
        role="Apprentice cartographer"
        image={KAI}
        toned={false}
        stats={STATS}
        tags={["Brush", "Never lost"]}
        quote="No bridge? I'll draw one."
        interactive
      />
      <CharacterCard
        className="w-64"
        name="The Eraser"
        role="Knight of the blank sky"
        stats={[
          { label: "Resolve", value: 9, max: 10 },
          { label: "Mercy", value: 12 },
        ]}
        tags={["Spear", "Silent"]}
        quote="What is drawn can be undone."
      />
    </div>
  )
}

function Interactive() {
  return (
    <div className="flex justify-center">
      <CharacterCard
        className="w-64"
        name="Suzu"
        role="Apprentice cartographer"
        image={KAI}
        toned={false}
        stats={STATS.slice(0, 2)}
        quote="No bridge? I'll draw one."
        interactive
      />
    </div>
  )
}

function Initials() {
  return (
    <div className="flex justify-center">
      <CharacterCard
        className="w-64"
        name="The Eraser"
        role="Knight of the blank sky"
        stats={[{ label: "Resolve", value: 9, max: 10 }]}
        tags={["Spear"]}
        quote="What is drawn can be undone."
      />
    </div>
  )
}

function Toned() {
  return (
    <div className="flex justify-center">
      <CharacterCard className="w-64" name="Suzu" role="Cartographer" image={KAI} stats={STATS} tags={["Brush"]} quote="One more road." />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Interactive", title: "Interactive card", description: "interactive makes the card focusable: it lifts on hover and takes the ink focus ring.", Component: Interactive },
  { fn: "Initials", title: "Without a portrait", description: "Without an image, the initials of the name stand on paper.", Component: Initials },
  { fn: "Toned", title: "Toned portrait", description: "toned, the default, draws the portrait as a screentone.", Component: Toned },
]

export function States() {
  return (
    <Tiles>
      <Tile label="card · rest" size="lg">
        <CharacterCard name="Suzu" role="Cartographer" image={KAI} toned={false} stats={STATS.slice(0, 2)} className="max-w-56" />
      </Tile>
      <Tile label="card · hover" size="lg">
        <CharacterCard name="Suzu" role="Cartographer" image={KAI} toned={false} stats={STATS.slice(0, 2)} interactive {...force("hover")} className="max-w-56" />
      </Tile>
      <Tile label="card · focus" size="lg">
        <CharacterCard name="Suzu" role="Cartographer" image={KAI} toned={false} stats={STATS.slice(0, 2)} interactive {...force("focus")} className="max-w-56" />
      </Tile>
      <Tile label="no portrait · initials" size="lg">
        <CharacterCard name="The Eraser" role="Knight of the blank sky" stats={[{ label: "Resolve", value: 9, max: 10 }]} className="max-w-56" />
      </Tile>
      <Tile label="second portrait" size="lg">
        <CharacterCard name="The Eraser" role="Knight of the blank sky" image={MIRA} toned={false} className="max-w-56" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="w-56 [zoom:0.5]">
      <CharacterCard name="Suzu" role="Cartographer" image={KAI} toned={false} stats={[{ label: "Ink", value: 82 }]} interactive className="max-w-56" />
    </div>
  )
}
