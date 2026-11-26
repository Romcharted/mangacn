import { useState } from "react"
import { RankingList, RankingRow, type RankingEntry } from "@registry/manga/signature/ranking-list"
import { Tile, force } from "../state-grid"

import { artSrc, type ArtName } from "../mapless"

// The chapters of "Mapless", the showcase's series, with crops of its pictures (AI-generated, see public/art/CREDITS.md).
const pic = (name: ArtName) => <img src={artSrc(name, 80)} alt="" className="size-full object-cover" />
const COVERS = [pic("spear-clash"), pic("lighthouse-night"), pic("suzu-shock"), pic("kuro-sleeping"), pic("map"), pic("eraser-panel"), pic("bridge-far"), pic("suzu-profile"), pic("ink-drop"), pic("suzu-drawing")]

const WEEK: RankingEntry[] = [
  { id: "ch-4", title: "The spear falls", subtitle: "Ch. 4", change: 0, score: "1.2M", cover: COVERS[0] },
  { id: "ch-5", title: "The lighthouse", subtitle: "Ch. 5", change: 3, score: "1.1M", cover: COVERS[1] },
  { id: "ch-3", title: "Kuro, back!", subtitle: "Ch. 3", change: -1, score: "980K", cover: COVERS[2] },
  { id: "ch-6", title: "Kuro sleeps", subtitle: "Ch. 6", change: "new", score: "940K", cover: COVERS[3] },
  { id: "ch-7", title: "A new map", subtitle: "Ch. 7", change: 2, score: "911K", cover: COVERS[4] },
  { id: "ch-2", title: "The Eraser", subtitle: "Ch. 2", change: -2, score: "870K", cover: COVERS[5] },
  { id: "ch-1", title: "The ink bridge", subtitle: "Ch. 1", change: 0, score: "802K", cover: COVERS[6] },
  { id: "ch-8", title: "Still out there", subtitle: "Ch. 8", change: 5, score: "777K", cover: COVERS[7] },
  { id: "ch-9", title: "One drop", subtitle: "Ch. 9", change: -4, score: "640K", cover: COVERS[8] },
  { id: "ch-10", title: "Fireside", subtitle: "Ch. 10", change: "new", score: "512K", cover: COVERS[9] },
]

const SAMPLE = WEEK[1]

export function Preview() {
  return (
    <div className="max-w-xl">
      <RankingList entries={WEEK.map((e) => ({ ...e, href: "#" }))} />
    </div>
  )
}

function Row({
  entry,
  rank,
  state,
}: {
  entry: RankingEntry
  rank: number
  state?: "hover" | "focus" | "active"
}) {
  return (
    <div className="relative ink-case w-full max-w-md">
      <RankingRow entry={{ ...entry, href: "#" }} rank={rank} big={rank <= 3} rowProps={state ? force(state) : undefined} />
    </div>
  )
}

export function States() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Tile label="row · rest">
        <Row entry={SAMPLE} rank={2} />
      </Tile>
      <Tile label="row · hover">
        <Row entry={SAMPLE} rank={2} state="hover" />
      </Tile>
      <Tile label="row · focus">
        <Row entry={SAMPLE} rank={2} state="focus" />
      </Tile>
      <Tile label="row · pressed">
        <Row entry={SAMPLE} rank={2} state="active" />
      </Tile>
      <Tile label="change · up 3">
        <Row entry={{ ...SAMPLE, change: 3 }} rank={2} />
      </Tile>
      <Tile label="change · down 1">
        <Row entry={{ ...SAMPLE, change: -1 }} rank={3} />
      </Tile>
      <Tile label="change · same">
        <Row entry={{ ...SAMPLE, change: 0 }} rank={7} />
      </Tile>
      <Tile label="change · new">
        <Row entry={{ ...SAMPLE, change: "new" }} rank={4} />
      </Tile>
      <Tile label="without covers">
        <Row entry={{ ...SAMPLE, cover: undefined, change: 2 }} rank={5} />
      </Tile>
      <Tile label="rank 1 · biggest, accent">
        <Row entry={{ ...SAMPLE, change: 0 }} rank={1} />
      </Tile>
      <Tile label="rank 7 · small">
        <Row entry={{ ...SAMPLE, change: 0 }} rank={7} />
      </Tile>
    </div>
  )
}

/** Live: pick a chapter; the row takes the ink. */
export function Thumb() {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="w-72 [zoom:0.5]">
      <RankingList
        entries={WEEK.slice(0, 3).map((e) => ({ ...e, subtitle: picked === e.id ? "Opening…" : e.subtitle }))}
        onSelect={(e) => setPicked(e.id)}
      />
    </div>
  )
}
