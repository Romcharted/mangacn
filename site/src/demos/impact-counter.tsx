import { useState } from "react"
import { ImpactCounter } from "@registry/manga/signature/impact-counter"
import { Button } from "@registry/manga/ui/button"
import { Tile, Tiles } from "../state-grid"

function Likes() {
  const [likes, setLikes] = useState(128)
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Button variant="shout" onClick={() => setLikes((n) => n + 1)}>
        Like
      </Button>
      <ImpactCounter value={likes} label="likes" />
    </div>
  )
}

function Streak() {
  const [streak, setStreak] = useState(3)
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ImpactCounter value={streak} label="hits in a row" size="sm" />
      <div className="flex gap-2">
        <Button onClick={() => setStreak((n) => n + 1)}>Hit</Button>
        <Button variant="outline" onClick={() => setStreak(0)}>
          Miss
        </Button>
      </div>
    </div>
  )
}

function Score() {
  const [score, setScore] = useState(1250)
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ImpactCounter value={score} label="pts" size="lg" format={(n) => n.toString().padStart(6, "0")} />
      <Button variant="tone" onClick={() => setScore((n) => n + 50)}>
        Score +50
      </Button>
    </div>
  )
}

export function Preview() {
  return (
    <div className="grid gap-10">
      <Likes />
      <Streak />
      <Score />
    </div>
  )
}

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

export function Thumb() {
  return <ImpactCounter value={128} label="likes" size="sm" />
}
