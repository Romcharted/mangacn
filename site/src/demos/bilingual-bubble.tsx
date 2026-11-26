import { useState } from "react"
import { BilingualBubble, type BilingualSide } from "@registry/manga/signature/bilingual-bubble"
import { Tile } from "../state-grid"

export function Preview() {
  const [side, setSide] = useState<BilingualSide>("original")
  return (
    <div className="grid max-w-xl gap-10">
      <div className="flex flex-col items-start gap-1">
        <BilingualBubble original="おはよう！今日もがんばろう。" translation="Morning! Let's give it our all today." tail="bottom" tailAlign="start" switchAlign="start" />
        <span className="px-2 font-letter text-sm uppercase">Rin</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <BilingualBubble
          original="ちょっと待って…"
          translation="Wait a second…"
          variant="thought"
          tail="bottom"
          tailAlign="end"
          showing={side}
          onShowingChange={setSide}
        />
        <span className="px-2 font-letter text-sm uppercase">Kai · controlled: {side}</span>
      </div>
      <div className="flex flex-col items-start gap-1">
        <BilingualBubble original="ドカン！" translation="KABOOM!" variant="shout" tail="bottom" switchAlign="start" defaultShowing="translation" />
      </div>
    </div>
  )
}

const bubble = (extra: Partial<React.ComponentProps<typeof BilingualBubble>> = {}) => (
  <BilingualBubble original="おはよう！" translation="Good morning!" tail="none" {...extra} />
)

export function States() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Tile label="showing · original">{bubble()}</Tile>
      <Tile label="showing · translation">{bubble({ defaultShowing: "translation" })}</Tile>
      <Tile label="switch · hover">
        <HoverSwitch state="hover" />
      </Tile>
      <Tile label="switch · focus">
        <HoverSwitch state="focus" />
      </Tile>
      <Tile label="switch · pressed">
        <HoverSwitch state="active" />
      </Tile>
      <Tile label="variant · thought">{bubble({ variant: "thought" })}</Tile>
      <Tile label="variant · narration">{bubble({ variant: "narration", switchAlign: "start" })}</Tile>
      <Tile label="variant · whisper">{bubble({ variant: "whisper" })}</Tile>
    </div>
  )
}

/** The bubble with its second switch cell frozen in a state (showcase only: data-force, see vite.config.ts). */
function HoverSwitch({ state }: { state: "hover" | "focus" | "active" }) {
  return (
    <div ref={(el) => el?.querySelector("[role=group] > button:last-child")?.setAttribute("data-force", state)}>
      {bubble()}
    </div>
  )
}

/** Live: hover or press to switch languages. */
export function Thumb() {
  return <BilingualBubble original="おはよう" translation="Morning" tail="bottom" />
}
