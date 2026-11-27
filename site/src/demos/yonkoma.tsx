import { Fragment } from "react"
import { Place } from "@registry/manga/signature/panel"
import { Yonkoma } from "@registry/manga/signature/yonkoma"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { Sfx } from "@registry/manga/signature/sfx"
import { artSrc, type ArtName } from "../mapless"
import type { Example } from "../registry"
import { Tile } from "../state-grid"

const LABELS: [string, string, string, string] = ["Suzu inks a map by the fire.", "The map takes shape.", "Kuro dozes off.", "Suzu laughs: done!"]

// Crops of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const BEATS: ArtName[] = ["suzu-drawing", "map", "kuro-sleeping", "suzu-face"]
function Beat({ step }: { step: 1 | 2 | 3 | 4 }) {
  return <img src={artSrc(BEATS[step - 1], 240)} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
}

function Story({ size = "md" }: { size?: "sm" | "md" }) {
  const md = size === "md"
  return [
      <Fragment key="1">
        <Beat step={1} />
        {md && (
          <Place x={90} y={22} anchor="top-right">
            <SpeechBubble pointAt={{ x: "52%", y: "62%" }}>One more line…</SpeechBubble>
          </Place>
        )}
      </Fragment>,
      <Fragment key="2">
        <Beat step={2} />
      </Fragment>,
      <Fragment key="3">
        <Beat step={3} />
        {md && (
          <Place x={40} y={10} anchor="top">
            <SpeechBubble variant="thought" pointAt={{ x: "55%", y: "45%" }}>
              zzz…
            </SpeechBubble>
          </Place>
        )}
      </Fragment>,
      <Fragment key="4">
        <Beat step={4} />
        {md && (
          <Place x={86} y={16} rotate={10}>
            <Sfx size="sm">ジャン</Sfx>
          </Place>
        )}
      </Fragment>,
  ]
}

/** The strip in a row first (four panels side by side from 40rem, a column on phones). */
export function Preview() {
  return (
    <Yonkoma orientation="auto" labels={LABELS} title="The map" className="mx-auto max-w-3xl">
      {Story({})}
    </Yonkoma>
  )
}

function Vertical() {
  return (
    <Yonkoma title="The map" labels={LABELS} className="w-64">
      {Story({})}
    </Yonkoma>
  )
}

function SquarePanels() {
  return (
    <Yonkoma aspect="1" labels={LABELS} className="w-56">
      {Story({ size: "sm" })}
    </Yonkoma>
  )
}

function Plain() {
  return (
    <Yonkoma numbered={false} labels={LABELS} className="w-56">
      {Story({ size: "sm" })}
    </Yonkoma>
  )
}

export const examples: Example[] = [
  { fn: "Vertical", title: "The classic column", description: "Without orientation, the four panels stack top to bottom, as in a newspaper strip.", Component: Vertical },
  { fn: "SquarePanels", title: "Square panels", description: "aspect sets the shape of every panel; \"1\" makes them square.", Component: SquarePanels },
  { fn: "Plain", title: "No title, no numbers", description: "numbered={false} hides the panel numbers; leave out title for a bare strip.", Component: Plain },
]

export function States() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tile label="vertical · numbered" size="lg">
        <Yonkoma className="w-48" labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
      <Tile label="vertical · title, no numbers" size="lg">
        <Yonkoma className="w-48" title="The map" numbered={false} labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
      <Tile label="square panels" size="lg">
        <Yonkoma className="w-40" aspect="1" labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
      <Tile label="horizontal" size="full">
        <Yonkoma orientation="horizontal" labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <Yonkoma className="w-20" numbered={false} labels={LABELS}>
      {Story({ size: "sm" })}
    </Yonkoma>
  )
}

/** The row needs the whole width of the frame. */
export const previewWide = true
