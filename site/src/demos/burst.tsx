import { Burst } from "@registry/manga/signature/burst"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-4">
      <Burst className="text-2xl">NEW!</Burst>
      <Burst variant="accent" animated="always" seed={3} className="text-3xl">
        -50%
      </Burst>
    </div>
  )
}

function Variants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-4">
      <Burst variant="ink" className="text-xl">
        Ink
      </Burst>
      <Burst variant="paper" className="text-xl">
        Paper
      </Burst>
      <Burst variant="accent" className="text-xl">
        Accent
      </Burst>
    </div>
  )
}

function Points() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-4">
      <Burst points={6} seed={2} className="text-xl">
        Sale
      </Burst>
      <Burst points={24} seed={8} className="text-xl">
        Sale
      </Burst>
    </div>
  )
}

function TwoLines() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-4">
      <Burst variant="paper" points={18} seed={9} className="text-xl">
        Vol. 4
        <br />
        is out
      </Burst>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "ink is the default flat, paper an outlined one for quieter news, accent the colour of the kit.", Component: Variants },
  { fn: "Points", title: "Spike count", description: "points sets the number of spikes; a low count reads as a sale tag, a high one as a shout.", Component: Points },
  { fn: "TwoLines", title: "Two lines", description: "The content can run on several lines and stays centred on the flat.", Component: TwoLines },
]

export function States() {
  return (
    <Tiles>
      {(["ink", "paper", "accent"] as const).map((v) => (
        <Tile key={v} label={`variant · ${v}`}>
          <Burst variant={v} animated={false}>
            NEW!
          </Burst>
        </Tile>
      ))}
      <Tile label="points · 6">
        <Burst points={6} animated={false}>
          Sale
        </Burst>
      </Tile>
      <Tile label="points · 24">
        <Burst points={24} animated={false}>
          Sale
        </Burst>
      </Tile>
      <Tile label="seed · 9">
        <Burst seed={9} animated={false}>
          Hit!
        </Burst>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Burst className="text-xl">NEW!</Burst>
}
