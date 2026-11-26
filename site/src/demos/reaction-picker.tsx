import { useState } from "react"
import type { ManpuKind } from "@registry/manga/signature/manpu"
import { ReactionChip, ReactionGrid, ReactionPicker, type Reaction } from "@registry/manga/signature/reaction-picker"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { PopoverBubble } from "@registry/manga/ui/popover"
import { force, Tile, Tiles } from "../state-grid"

/** Toggles a reaction: on adds one, off takes it back; a reaction at zero leaves the row. */
function toggle(list: Reaction[], kind: ManpuKind): Reaction[] {
  const found = list.find((r) => r.kind === kind)
  if (!found) return [...list, { kind, count: 1, active: true }]
  const active = !found.active
  const count = found.count + (active ? 1 : -1)
  if (count <= 0) return list.filter((r) => r.kind !== kind)
  return list.map((r) => (r.kind === kind ? { ...r, active, count } : r))
}

function Message({
  who,
  text,
  initial,
  max,
  disabled,
  align = "start",
}: {
  who: string
  text: string
  initial: Reaction[]
  max?: number
  disabled?: boolean
  align?: "start" | "end"
}) {
  const [reactions, setReactions] = useState(initial)
  return (
    <div className={align === "end" ? "flex flex-col items-end gap-2" : "flex flex-col items-start gap-2"}>
      <SpeechBubble tail="bottom" tailAlign={align}>
        {text}
      </SpeechBubble>
      <span className="px-2 font-letter text-sm tracking-wide uppercase">{who}</span>
      <ReactionPicker
        reactions={reactions}
        onReact={(kind) => setReactions((list) => toggle(list, kind))}
        max={max}
        disabled={disabled}
        className={align === "end" ? "justify-end" : undefined}
      />
    </div>
  )
}

export function Preview() {
  return (
    <div className="grid max-w-2xl gap-10 pb-40">
      <Message
        who="Editor"
        text="Chapter 12 goes live tonight!"
        initial={[
          { kind: "love", count: 12, active: true },
          { kind: "surprise", count: 5 },
          { kind: "sweat", count: 2 },
        ]}
      />
      <Message
        who="Mika · max 3 kinds"
        align="end"
        text="The last page is still blank."
        initial={[
          { kind: "gloom", count: 3 },
          { kind: "question", count: 1 },
        ]}
        max={3}
      />
      <Message who="Archive · read-only" text="Volume 1 is out of print." initial={[{ kind: "sigh", count: 48, active: true }, { kind: "anger", count: 7 }]} disabled />
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="chip · rest">
        <ReactionChip kind="surprise" count={5} />
      </Tile>
      <Tile label="chip · hover">
        <ReactionChip kind="surprise" count={5} {...force("hover")} />
      </Tile>
      <Tile label="chip · focus">
        <ReactionChip kind="surprise" count={5} {...force("focus")} />
      </Tile>
      <Tile label="chip · pressed (click)">
        <ReactionChip kind="surprise" count={5} {...force("active")} />
      </Tile>
      <Tile label="chip · active (reacted)">
        <ReactionChip kind="love" count={12} active />
      </Tile>
      <Tile label="chip · active · hover">
        <ReactionChip kind="love" count={12} active {...force("hover")} />
      </Tile>
      <Tile label="chip · active · focus">
        <ReactionChip kind="love" count={12} active {...force("focus")} />
      </Tile>
      <Tile label="chip · disabled">
        <ReactionChip kind="sweat" count={2} disabled />
      </Tile>
      <Tile label="row · wraps" size="lg">
        <ReactionPicker
          reactions={[
            { kind: "love", count: 1280, active: true },
            { kind: "sparkle", count: 64 },
            { kind: "anger", count: 9 },
            { kind: "question", count: 3 },
            { kind: "sigh", count: 1 },
          ]}
        />
      </Tile>
      <Tile label="picker · open" size="lg">
        <div className="flex flex-col items-start gap-1 pb-2">
          <ReactionPicker reactions={[{ kind: "love", count: 12, active: true }]} />
          <PopoverBubble side="bottom" className="mt-3 w-max!">
            <ReactionGrid active={["love"]} />
          </PopoverBubble>
        </div>
      </Tile>
      <Tile label="picker · full (max 2)" size="lg">
        <PopoverBubble side="bottom" className="mt-3 w-max!">
          <ReactionGrid active={["love"]} blocked={["anger", "sweat", "question", "sparkle", "gloom", "sigh"]} />
        </PopoverBubble>
      </Tile>
    </Tiles>
  )
}

/** Live: a click adds or takes back a reaction. */
export function Thumb() {
  const [reactions, setReactions] = useState<Reaction[]>([
    { kind: "love", count: 12, active: true },
    { kind: "surprise", count: 5 },
    { kind: "sweat", count: 2 },
  ])
  const react = (kind: ManpuKind) => setReactions((list) => toggle(list, kind))
  return <ReactionPicker reactions={reactions} onReact={react} max={4} />
}
