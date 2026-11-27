import { Badge } from "@registry/manga/ui/badge"
import { Button } from "@registry/manga/ui/button"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import type { Example } from "../registry"
import { SizeTiles, Specimen } from "./font-sample"

export function Preview() {
  return <Specimen font="font-letter" text="Turn back, cartographer." className="uppercase" />
}

function InABubble() {
  return (
    <SpeechBubble tail="bottom" tailAlign="start">
      Kuro, did you eat my ink again?
    </SpeechBubble>
  )
}

function Labels() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Read chapter 12</Button>
      <Badge>New</Badge>
      <span className="font-letter text-sm uppercase">Volume 3</span>
    </div>
  )
}

function Title() {
  return <h3 className="font-letter text-5xl leading-none uppercase">Chapter 12: The bridge</h3>
}

export const examples: Example[] = [
  { fn: "InABubble", title: "In a bubble", description: "Speech bubbles letter their lines with font-letter, like a hand letterer.", Component: InABubble },
  { fn: "Labels", title: "Buttons and labels", description: "Buttons, badges and small labels use it in capitals.", Component: Labels },
  { fn: "Title", title: "Titles", description: "Page and section titles: Patrick Hand SC at a large size.", Component: Title },
]

export function States() {
  return <SizeTiles font="font-letter" text="MAP" />
}
