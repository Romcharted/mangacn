import { useState } from "react"
import { VolumeCard, type VolumeStatus } from "@registry/manga/signature/volume-card"
import { Tile, force } from "../state-grid"
import { VolumeCover, artSrc, type ArtName } from "../mapless"

// "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md): the volumes, then extras.
const VOLUMES: { id: string; volume: number; title: string; author: string; cover: ArtName; status: VolumeStatus; read: number; total: number }[] = [
  { id: "v1", volume: 1, title: "Mapless", author: "Studio Mapless", cover: "cover-1", status: "completed", read: 8, total: 8 },
  { id: "v2", volume: 2, title: "Mapless", author: "Studio Mapless", cover: "cover-2", status: "ongoing", read: 3, total: 8 },
  { id: "v3", volume: 3, title: "Mapless", author: "Studio Mapless", cover: "cover-3-teaser", status: "new", read: 0, total: 8 },
  { id: "s1", volume: 1, title: "Mapless: Side stories", author: "Studio Mapless", cover: "suzu-drawing", status: "hiatus", read: 2, total: 6 },
  { id: "s2", volume: 1, title: "Kuro's notebook", author: "Studio Mapless", cover: "kuro-sleeping", status: "ongoing", read: 5, total: 12 },
  { id: "s3", volume: 1, title: "Mapless Sketchbook", author: "Studio Mapless", cover: "eraser-full", status: "completed", read: 4, total: 4 },
]

/** A volume of the series gets its cover with the title lettered on it; an extra shows its picture. */
const cover = (name: ArtName) =>
  name === "cover-1" ? <VolumeCover volume={1} /> : name === "cover-2" ? <VolumeCover volume={2} /> : name === "cover-3-teaser" ? <VolumeCover volume={3} /> : artSrc(name, 160)

export function Preview() {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {VOLUMES.map((v) => (
          <div key={v.id} className="min-w-0">
            <VolumeCard
              onSelect={() => setPicked(`${v.title}, vol. ${v.volume}`)}
              title={v.title}
              volume={v.volume}
              author={v.author}
              cover={cover(v.cover)}
              status={v.status}
              read={v.read}
              total={v.total}
            />
          </div>
        ))}
      </div>
      <p aria-live="polite" className="font-mono text-sm">
        {picked ? `Opening ${picked}…` : "Pick a volume."}
      </p>
    </div>
  )
}

const STATUS_ROWS: VolumeStatus[] = ["new", "ongoing", "completed", "hiatus"]
const PROGRESS = [
  { label: "unread", read: 0 },
  { label: "in progress", read: 3 },
  { label: "finished", read: 8 },
] as const

export function States() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_ROWS.map((s) => (
          <Tile key={s} label={`status · ${s}`} size="full">
            <div className="w-full max-w-40">
              <VolumeCard title="Mapless" volume={3} cover={cover("cover-3-teaser")} status={s} read={6} total={20} />
            </div>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PROGRESS.map((p) => (
          <Tile key={p.label} label={`reading · ${p.label}`} size="full">
            <div className="w-full max-w-40">
              <VolumeCard title="Mapless" volume={2} cover={cover("cover-2")} status="ongoing" read={p.read} total={8} />
            </div>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Tile label="interactive · hover" size="full">
          <div className="w-full max-w-40">
            <VolumeCard href="#" title="Mapless" volume={1} cover={cover("cover-1")} status="completed" read={8} total={8} {...force("hover")} />
          </div>
        </Tile>
        <Tile label="interactive · focus" size="full">
          <div className="w-full max-w-40">
            <VolumeCard href="#" title="Mapless" volume={1} cover={cover("cover-1")} status="completed" read={8} total={8} {...force("focus")} />
          </div>
        </Tile>
        <Tile label="interactive · pressed" size="full">
          <div className="w-full max-w-40">
            <VolumeCard href="#" title="Mapless" volume={1} cover={cover("cover-1")} status="completed" read={8} total={8} {...force("active")} />
          </div>
        </Tile>
      </div>
    </div>
  )
}

/** Live: the card lifts on hover; a click reads one more chapter. */
export function Thumb() {
  const [read, setRead] = useState(3)
  return (
    <div className="w-24">
      <VolumeCard
        title="Mapless"
        volume={2}
        cover={cover("cover-2")}
        status={read >= 8 ? "completed" : "ongoing"}
        read={read}
        total={8}
        onSelect={() => setRead((r) => (r >= 8 ? 0 : r + 1))}
      />
    </div>
  )
}
