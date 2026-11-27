import { useEffect, useState } from "react"
import { LoadingScreen } from "@registry/manga/signature/loading-screen"
import { Button } from "@registry/manga/ui/button"
import type { Example } from "../registry"
import { Tile } from "../state-grid"

export function Preview() {
  const [progress, setProgress] = useState(0)
  const [full, setFull] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 10)), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!full) return
    const id = setTimeout(() => setFull(false), 2000)
    return () => clearTimeout(id)
  }, [full])

  return (
    <div className="mx-auto grid w-full max-w-sm justify-items-center gap-4">
      <div className="relative h-72 w-full ink-case-inner">
        <LoadingScreen progress={progress} message="Loading chapter 12…" />
      </div>
      <Button className="min-h-11 sm:min-h-8" onClick={() => setFull(true)} disabled={full}>
        Show fullscreen for 2 s
      </Button>
      {full && <LoadingScreen fullscreen message="Hold on, it is coming." progress={progress} />}
    </div>
  )
}

function Determinate() {
  return (
    <div className="mx-auto grid w-full max-w-sm">
      <div className="relative h-56 w-full ink-case-inner">
        <LoadingScreen progress={60} message="Almost there" />
      </div>
    </div>
  )
}

function Indeterminate() {
  return (
    <div className="mx-auto grid w-full max-w-sm">
      <div className="relative h-56 w-full ink-case-inner">
        <LoadingScreen message="Waiting for the server" />
      </div>
    </div>
  )
}

function WithSound() {
  return (
    <div className="mx-auto grid w-full max-w-sm">
      <div className="relative h-56 w-full ink-case-inner">
        <LoadingScreen progress={30} sfx="RUMBLE" message="Turning the page" />
      </div>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Determinate", title: "With a progress", description: "progress fills the bar and the count; the screen shows how far the loading is.", Component: Determinate },
  { fn: "Indeterminate", title: "Without progress", description: "Without progress the loader only moves: for a wait with no known end.", Component: Indeterminate },
  { fn: "WithSound", title: "With a sound effect", description: "sfx sets the sound effect lettered on the screen.", Component: WithSound },
]

export function States() {
  return (
    <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      <Tile label="determinate · 0%" size="full">
        <div className="relative h-72 w-full max-w-sm ink-case-inner">
          <LoadingScreen progress={0} message="Starting" />
        </div>
      </Tile>
      <Tile label="determinate · 60%" size="full">
        <div className="relative h-72 w-full max-w-sm ink-case-inner">
          <LoadingScreen progress={60} message="Almost there" />
        </div>
      </Tile>
      <Tile label="determinate · 100%" size="full">
        <div className="relative h-72 w-full max-w-sm ink-case-inner">
          <LoadingScreen progress={100} message="Done" />
        </div>
      </Tile>
      <Tile label="indeterminate" size="full">
        <div className="relative h-72 w-full max-w-sm ink-case-inner">
          <LoadingScreen message="Waiting for the server" />
        </div>
      </Tile>
    </div>
  )
}

/** Thumbnail: a readable detail at real size, cropped. */
export function Thumb() {
  return (
    <div className="relative h-28 w-56 ink-case-inner">
      <LoadingScreen progress={60} sfx="ドドド" />
    </div>
  )
}
