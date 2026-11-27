import { useState } from "react"
import { SceneTransition, useSceneTransition, type SceneTransitionVariant } from "@registry/manga/signature/scene-transition"
import { Button } from "@registry/manga/ui/button"
import type { Example } from "../registry"
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
      <Button variant="outline" className="min-h-11 sm:min-h-8" disabled={playing} onClick={() => play(() => setScene((n) => (n + 1) % SCENES.length))}>
        Next scene · {variant}, {direction}
      </Button>
    </div>
  )
}

export function Preview() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-sm">
        <Stage variant="ink" direction="reading" />
      </div>
    </div>
  )
}

function Panels() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-sm">
        <Stage variant="panels" direction="reading" />
      </div>
    </div>
  )
}

function Tone() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-sm">
        <Stage variant="tone" direction="down" />
      </div>
    </div>
  )
}

function WholeScreen() {
  const [screen, setScreen] = useState(false)
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Button className="min-h-11 sm:min-h-8" onClick={() => setScreen(true)}>
        Sweep the whole screen
      </Button>
      <SceneTransition playing={screen} onDone={() => setScreen(false)} caption="Chapter 2" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Panels", title: "Four panels", description: "variant panels closes the scene with four ink panels, one after the other, in the reading order.", Component: Panels },
  { fn: "Tone", title: "Tone, top to bottom", description: "variant tone covers with a screentone band; direction down wipes from the top of the box to the bottom.", Component: Tone },
  { fn: "WholeScreen", title: "Sweep the whole screen", description: "A transition with scope screen covers the viewport; the caption shows in the middle while it is covered.", Component: WholeScreen },
]

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

/** Live: a click plays the stepped wipe inside the box. */
export function Thumb() {
  const { play, transition, playing } = useSceneTransition({ variant: "panels", scope: "container" })
  const [scene, setScene] = useState(0)
  return (
    <button
      type="button"
      disabled={playing}
      onClick={() => void play(() => setScene((s) => s + 1))}
      className="relative isolate grid h-24 w-40 cursor-pointer place-items-center overflow-hidden border-ink bg-background font-letter uppercase hover-invert focus-ink"
    >
      {scene % 2 ? "Next scene" : "Scene"}
      {transition}
    </button>
  )
}
