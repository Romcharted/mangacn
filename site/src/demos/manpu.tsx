import { Manpu, type ManpuKind } from "@registry/manga/signature/manpu"
import { Tile, Tiles } from "../state-grid"

const KINDS: ManpuKind[] = ["anger", "sweat", "surprise", "question", "sparkle", "gloom", "love", "sigh"]

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-8 text-4xl">
      {KINDS.map((k) => (
        <Manpu key={k} kind={k} />
      ))}
    </div>
  )
}

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
