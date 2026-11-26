import { useState } from "react"
import { SceneTransition, useSceneTransition, type SceneTransitionVariant } from "@registry/manga/signature/scene-transition"
import { Button } from "@registry/manga/ui/button"
import { Tile } from "../state-grid"

const SCENES = [
  { title: "Scene 1 · The studio", text: "A desk, a lamp, a blank page." },
  { title: "Scene 2 · The station", text: "The last train is late again." },
  { title: "Scene 3 · The rooftop", text: "The whole city, in screentone." },
]

function Stage({ variant, direction }: { variant: SceneTransitionVariant; direction: "reading" | "down" }) {
  const [scene, setScene] = useState(0)
  const { play, transition, playing } = useSceneTransition({ variant, direction, scope: "container", caption: variant === "ink" ? "Meanwhile…" : undefined })
  const s = SCENES[scene]
  return (
    <div className="grid gap-2">
      <div className="relative isolate grid h-48 place-items-center overflow-hidden border-ink-panel bg-background p-4 text-center">
        <div>
          <p className="font-letter text-2xl uppercase">{s.title}</p>
          <p>{s.text}</p>
        </div>
        {transition}
      </div>
      <Button variant="outline" disabled={playing} onClick={() => play(() => setScene((n) => (n + 1) % SCENES.length))}>
        Next scene · {variant}, {direction}
      </Button>
    </div>
  )
}

export function Preview() {
  const [screen, setScreen] = useState(false)
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stage variant="ink" direction="reading" />
        <Stage variant="panels" direction="reading" />
        <Stage variant="tone" direction="down" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setScreen(true)}>Sweep the whole screen</Button>
        <span className="text-sm">The ink wipe follows the reading order: switch “Read ←” to sweep right to left.</span>
      </div>
      <SceneTransition playing={screen} onDone={() => setScreen(false)} caption="Chapter 2" />
    </div>
  )
}

const FRAMES = [2, 4, 5, 8] as const

export function States() {
  return (
    <div className="grid gap-4">
      {(["ink", "panels", "tone"] as const).map((variant) => (
        <div key={variant} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FRAMES.map((frame) => (
            <Tile key={frame} label={`${variant} · frame ${frame} of 10`} size="lg">
              <div className="relative isolate grid h-24 w-full place-items-center overflow-hidden border-ink bg-background font-letter uppercase">
                Scene
                <SceneTransition playing={false} frame={frame} variant={variant} scope="container" caption={variant === "ink" ? "Later" : undefined} />
              </div>
            </Tile>
          ))}
        </div>
      ))}
    </div>
  )
}

export function Thumb() {
  return (
    <div className="relative isolate grid h-24 w-40 place-items-center overflow-hidden border-ink bg-background font-letter uppercase">
      Scene
      <SceneTransition playing={false} frame={3} variant="panels" scope="container" />
    </div>
  )
}
