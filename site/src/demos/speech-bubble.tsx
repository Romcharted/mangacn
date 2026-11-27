import { Choice, Playground, jsx } from "../playground"
import { useState } from "react"
import { BubbleGroup, SpeechBubble, type BubbleVariant } from "@registry/manga/signature/speech-bubble"
import type { Example } from "../registry"

const VARIANTS: BubbleVariant[] = ["speech", "thought", "shout", "whisper", "narration", "electronic", "wobbly"]
const TEXT: Record<BubbleVariant, string> = {
  speech: "Did you hear that?",
  thought: "Something is off…",
  shout: "Get down!",
  whisper: "…over here.",
  narration: "Three days later.",
  electronic: "Incoming call.",
  wobbly: "I-it's cold…",
}

const TAILS = ["top", "bottom", "start", "end", "none"] as const
const ALIGNS = ["start", "center", "end"] as const

export function Preview() {
  const [variant, setVariant] = useState<BubbleVariant>("speech")
  const [tail, setTail] = useState<(typeof TAILS)[number]>("bottom")
  const [tailAlign, setTailAlign] = useState<(typeof ALIGNS)[number]>("start")
  const props = { variant, tail, tailAlign }
  return (
    <div className="grid gap-8">
      <Playground
        preview={<SpeechBubble {...props}>{TEXT[variant]}</SpeechBubble>}
        controls={
          <>
            <Choice label="variant" value={variant} options={VARIANTS} onChange={setVariant} />
            <Choice label="tail" value={tail} options={TAILS} onChange={setTail} />
            <Choice label="tailAlign" value={tailAlign} options={ALIGNS} onChange={setTailAlign} />
          </>
        }
        code={jsx("SpeechBubble", props, { variant: "speech", tail: "bottom", tailAlign: "start" }, TEXT[variant])}
      />
    </div>
  )
}

function Shapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-12 py-4">
      <SpeechBubble>Did you hear that?</SpeechBubble>
      <SpeechBubble variant="shout" tail="bottom" tailAlign="end">
        Get down!
      </SpeechBubble>
      <SpeechBubble variant="thought" tail="start" tailAlign="center">
        Something is off…
      </SpeechBubble>
    </div>
  )
}

function Tails() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-12 py-4">
      <SpeechBubble tail="top" tailAlign="center">
        Psst.
      </SpeechBubble>
      <SpeechBubble tail="end" tailAlign="end">
        Over here.
      </SpeechBubble>
    </div>
  )
}

function Group() {
  return (
    <div className="flex w-full justify-center">
      <BubbleGroup>
        <SpeechBubble tail="none">Wait.</SpeechBubble>
        <SpeechBubble tail="bottom" tailAlign="end">
          It's coming from the roof.
        </SpeechBubble>
      </BubbleGroup>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Shapes", title: "Shapes", description: "variant sets the outline: speech, thought (a cloud), shout (spikes), and more in the states below.", Component: Shapes },
  { fn: "Tails", title: "Tail sides", description: "tail picks the side the tail points to and tailAlign where it sits along that side.", Component: Tails },
  { fn: "Group", title: "Bubbles in a group", description: "BubbleGroup stacks the bubbles of one speaker; give the last one the tail.", Component: Group },
]

export function States() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-x-10 gap-y-14 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {VARIANTS.map((v) => (
          <figure key={v} className="space-y-6">
            <SpeechBubble variant={v} tail={v === "narration" ? "none" : "bottom"}>
              {TEXT[v]}
            </SpeechBubble>
            <figcaption className="font-mono text-xs">variant="{v}"</figcaption>
          </figure>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-16 px-6 py-8 sm:grid-cols-4">
        {(["top", "bottom", "start", "end"] as const).flatMap((side) =>
          (["start", "center", "end"] as const).map((align) => (
            <figure key={side + align} className="space-y-6">
              <SpeechBubble tail={side} tailAlign={align}>
                Tail
              </SpeechBubble>
              <figcaption className="font-mono text-xs">
                {side} · {align}
              </figcaption>
            </figure>
          )),
        )}
      </div>
    </div>
  )
}

export function Thumb() {
  const [i, setI] = useState(2)
  const v = VARIANTS[i % VARIANTS.length]
  return (
    <button type="button" onClick={() => setI((x) => x + 1)} className="cursor-pointer focus-ink" aria-label={`Bubble: ${v}. Click for the next shape.`}>
      <SpeechBubble variant={v} tail={v === "narration" ? "none" : "bottom"} className="text-base">
        {TEXT[v]}
      </SpeechBubble>
    </button>
  )
}

/** The Playground takes the whole width of the frame, its controls on the right. */
export const previewWide = true
