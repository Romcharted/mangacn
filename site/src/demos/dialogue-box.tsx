import { useState } from "react"
import { DialogueBox, type DialogueLine } from "@registry/manga/signature/dialogue-box"
import { FaceGuide, FaceMascot, FaceRookie } from "../story-art"
import { Tile, force } from "../state-grid"

const face = "size-full"

const LINES: DialogueLine[] = [
  { speaker: "Sensei", portrait: <FaceGuide className={face} />, text: "Welcome to the studio. Today you letter your very first page." },
  { speaker: "Rookie", portrait: <FaceRookie className={face} />, side: "end", text: "My first page? I have never even held a pen like this!" },
  { speaker: "Sensei", portrait: <FaceGuide className={face} />, text: "Then start with one bubble. One line, said clearly. The rest follows." },
  { speaker: "Tama", portrait: <FaceMascot className={face} />, text: "Mrrow. (The cat agrees.)" },
]

export function Preview() {
  const [ended, setEnded] = useState(0)
  return (
    <div className="grid max-w-2xl gap-3">
      <DialogueBox lines={LINES} onEnd={() => setEnded((n) => n + 1)} />
      <p className="font-mono text-xs">
        Click the text or the arrow. Finished {ended} time{ended === 1 ? "" : "s"}.
      </p>
    </div>
  )
}

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
        {one({ defaultIndex: 3, progress: 1, loop: false })}
      </Tile>
      <Tile label="no portrait, no count" size="full">
        <DialogueBox lines={[{ speaker: "Narrator", text: "Three days later…" }]} progress={1} className="w-full" />
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

export function Thumb() {
  return <DialogueBox lines={LINES.slice(0, 2)} progress={0.7} showCount={false} className="pointer-events-none w-56 [&_p]:text-xs" />
}
