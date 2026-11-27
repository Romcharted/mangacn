import { useState } from "react"
import { DialogueBox, type DialogueLine } from "@registry/manga/signature/dialogue-box"
import type { Example } from "../registry"
import { artSrc } from "../mapless"
import { Tile, force } from "../state-grid"

// The cast of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const SUZU = artSrc("suzu-face", 64)
const SUZU_SHOCK = artSrc("suzu-shock", 64)
const ERASER = artSrc("eraser-helmet", 64)
const KURO = artSrc("kuro", 64)

const LINES: DialogueLine[] = [
  { speaker: "Eraser", portrait: ERASER, text: "Turn back, cartographer. Nothing new gets drawn in this sky." },
  { speaker: "Suzu", portrait: SUZU_SHOCK, side: "end", text: "Then I will draw it anyway. Every island deserves a map!" },
  { speaker: "Eraser", portrait: ERASER, text: "What is drawn can be undone. One stroke of my spear is enough." },
  { speaker: "Kuro", portrait: KURO, text: "Grrrk. (The ink dragon disagrees.)" },
  { speaker: "Suzu", portrait: SUZU, side: "end", text: "See? Kuro says we keep going." },
]

export function Preview() {
  const [ended, setEnded] = useState(0)
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3">
      <DialogueBox lines={LINES} onEnd={() => setEnded((n) => n + 1)} className="w-full" />
      <p className="font-mono text-xs">
        Click the text or the arrow. Finished {ended} time{ended === 1 ? "" : "s"}.
      </p>
    </div>
  )
}

function Narration() {
  return (
    <div className="flex w-full justify-center">
      <DialogueBox lines={[{ speaker: "Narrator", text: "That night, by the lighthouse…" }]} className="w-full max-w-xl" />
    </div>
  )
}

function NoCount() {
  return (
    <div className="flex w-full justify-center">
      <DialogueBox lines={LINES} showCount={false} className="w-full max-w-xl" />
    </div>
  )
}

function StaysAtEnd() {
  return (
    <div className="flex w-full justify-center">
      <DialogueBox lines={LINES} defaultIndex={3} loop={false} className="w-full max-w-xl" />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Narration", title: "A line with no portrait", description: "A line without a portrait keeps the name plate and the text; the box works the same way.", Component: Narration },
  { fn: "NoCount", title: "Without the count", description: "showCount false hides the \"2 / 5\" counter next to the arrow.", Component: NoCount },
  { fn: "StaysAtEnd", title: "Stays on the last line", description: "loop false keeps the box on the last line instead of starting again from the first.", Component: StaysAtEnd },
]

const one = (extra: Partial<React.ComponentProps<typeof DialogueBox>> = {}) => <DialogueBox lines={LINES} className="w-full" {...extra} />

export function States() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Tile label="writing · 40%" size="full">
        {one({ progress: 0.4 })}
      </Tile>
      <Tile label="waiting · arrow blinks" size="full">
        {one({ progress: 1 })}
      </Tile>
      <Tile label="portrait at the end" size="full">
        {one({ defaultIndex: 1, progress: 1 })}
      </Tile>
      <Tile label="last line · loop off" size="full">
        {one({ defaultIndex: 4, progress: 1, loop: false })}
      </Tile>
      <Tile label="no portrait, no count" size="full">
        <DialogueBox lines={[{ speaker: "Narrator", text: "That night, by the lighthouse…" }]} progress={1} className="w-full" />
      </Tile>
      <Tile label="button · hover" size="full">
        <Forced state="hover" />
      </Tile>
      <Tile label="button · focus" size="full">
        <Forced state="focus" />
      </Tile>
      <Tile label="button · pressed" size="full">
        <Forced state="active" />
      </Tile>
    </div>
  )
}

/** Freezes the arrow button in a state (showcase only: data-force, see vite.config.ts). */
function Forced({ state }: { state: "hover" | "focus" | "active" }) {
  return (
    <div className="w-full" ref={(el) => el?.querySelector("[data-manga=dialogue-box] button")?.setAttribute("data-force", force(state)["data-force"] ?? "")}>
      {one({ progress: 1 })}
    </div>
  )
}

/** Live: a click on the text or the arrow moves to the next line. */
/** Thumbnail: a readable detail at real size, cropped. */
export function Thumb() {
  return (
    <div className="w-72 h-32 overflow-hidden">
      <DialogueBox lines={LINES.slice(0, 1)} showCount={false} />
    </div>
  )
}
