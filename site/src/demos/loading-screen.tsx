import { useEffect, useState } from "react"
import { LoadingScreen } from "@registry/manga/signature/loading-screen"
import { Button } from "@registry/manga/ui/button"
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
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative h-80 ink-case-inner">
          <LoadingScreen progress={progress} message="Loading chapter 12…" />
        </div>
        <div className="relative h-80 ink-case-inner">
          <LoadingScreen message="Fetching the next pages…" />
        </div>
      </div>
      <div>
        <Button onClick={() => setFull(true)} disabled={full}>
          Show fullscreen for 2 s
        </Button>
      </div>
      {full && <LoadingScreen fullscreen message="Hold on, it is coming." progress={progress} />}
    </div>
  )
}

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

export function Thumb() {
  return (
    <div className="relative h-36 w-44 ink-case-inner">
      <LoadingScreen progress={60} sfx="ドドド" />
    </div>
  )
}
