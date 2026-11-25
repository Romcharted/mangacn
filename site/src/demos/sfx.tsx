import { Sfx } from "@registry/manga/signature/sfx"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-10 py-6">
      <Sfx size="xl">ドン</Sfx>
      <Sfx size="lg" rotate={8} variant="outline">BAM!</Sfx>
      <Sfx size="md" rotate={-14}>ザッ</Sfx>
    </div>
  )
}

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
