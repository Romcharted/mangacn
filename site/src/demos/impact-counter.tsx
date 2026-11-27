import { useState } from "react"
import { ImpactCounter } from "@registry/manga/signature/impact-counter"
import { Button } from "@registry/manga/ui/button"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

function Likes() {
  const [likes, setLikes] = useState(128)
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Button variant="shout" className="min-h-11 sm:min-h-8" onClick={() => setLikes((n) => n + 1)}>
        Like
      </Button>
      <ImpactCounter value={likes} label="likes" />
    </div>
  )
}

function Streak() {
  const [streak, setStreak] = useState(3)
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <ImpactCounter value={streak} label="hits in a row" size="sm" />
      <div className="flex gap-2">
        <Button className="min-h-11 sm:min-h-8" onClick={() => setStreak((n) => n + 1)}>
          Hit
        </Button>
        <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => setStreak(0)}>
          Miss
        </Button>
      </div>
    </div>
  )
}

function Score() {
  const [score, setScore] = useState(1250)
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <ImpactCounter value={score} label="pts" size="lg" format={(n) => n.toString().padStart(6, "0")} />
      <Button variant="tone" className="min-h-11 sm:min-h-8" onClick={() => setScore((n) => n + 50)}>
        Score +50
      </Button>
    </div>
  )
}

function WithIcon() {
  const [hits, setHits] = useState(7)
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <ImpactCounter value={hits} label="streak" size="sm" icon={<span aria-hidden className="mark-check text-xl" />} />
      <Button className="min-h-11 sm:min-h-8" onClick={() => setHits((n) => n + 1)}>
        Hit
      </Button>
    </div>
  )
}

export function Preview() {
  return <Likes />
}

export const examples: Example[] = [
  { fn: "Streak", title: "Small size", description: "size sm fits a counter inside a line of text: hits in a row, with a Hit and a Miss.", Component: Streak },
  { fn: "Score", title: "Formatted score", description: "format pads the number with zeros, and size lg makes it the centre of the screen.", Component: Score },
  { fn: "WithIcon", title: "With an icon", description: "icon puts a small mark before the number, and label letters go after it.", Component: WithIcon },
]

export function States() {
  return (
    <Tiles>
      <Tile label="size · sm" size="lg">
        <ImpactCounter value={12} label="hits" size="sm" />
      </Tile>
      <Tile label="size · default" size="lg">
        <ImpactCounter value={1280} label="likes" />
      </Tile>
      <Tile label="size · lg" size="lg">
        <ImpactCounter value={48000} size="lg" />
      </Tile>
      <Tile label="with icon" size="lg">
        <ImpactCounter value={7} label="streak" size="sm" icon={<span aria-hidden className="mark-check text-xl" />} />
      </Tile>
      <Tile label="formatted · 000420" size="lg">
        <ImpactCounter value={420} format={(n) => n.toString().padStart(6, "0")} label="pts" size="sm" />
      </Tile>
    </Tiles>
  )
}

/** Live: a click adds a like; the number takes the hit. */
export function Thumb() {
  const [n, setN] = useState(128)
  return (
    <button type="button" aria-label="Like" onClick={() => setN((v) => v + 1)} className="cursor-pointer p-1 hover-thicken focus-ink">
      <ImpactCounter value={n} label="likes" size="sm" />
    </button>
  )
}
