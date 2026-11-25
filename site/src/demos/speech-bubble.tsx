import { BubbleGroup, SpeechBubble, type BubbleVariant } from "@registry/manga/signature/speech-bubble"

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

export function Preview() {
  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-12 py-4">
      <SpeechBubble>Did you hear that?</SpeechBubble>
      <SpeechBubble variant="shout" tail="bottom" tailAlign="end">
        Get down!
      </SpeechBubble>
      <SpeechBubble variant="thought" tail="start" tailAlign="center">
        Something is off…
      </SpeechBubble>
      <BubbleGroup>
        <SpeechBubble tail="none">Wait.</SpeechBubble>
        <SpeechBubble tail="bottom" tailAlign="end">
          It's coming from the roof.
        </SpeechBubble>
      </BubbleGroup>
    </div>
  )
}

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
  return (
    <SpeechBubble variant="shout" tail="none" className="px-10 py-6 text-base">
      Bam!
    </SpeechBubble>
  )
}
