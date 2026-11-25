import { useEffect, useState } from "react"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { TypingBubble } from "@registry/manga/signature/typing-bubble"
import { Button } from "@registry/manga/ui/button"
import { Tile, Tiles } from "../state-grid"

const REPLY = "Almost! Two pages still need their tones. I'll send them tonight."
const THOUGHT = "What if the rival wins this time…"
const STREAM = ["Page 14: ", "move the door ", "to the left panel, ", "then cut the last ", "speech bubble."]

/** Dots for a while, then the text types itself. */
function Delayed({ text, delay, ...props }: { text: string; delay: number } & Omit<React.ComponentProps<typeof TypingBubble>, "text">) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), delay)
    return () => window.clearTimeout(id)
  }, [delay])
  return <TypingBubble text={ready ? text : ""} {...props} />
}

/** An answer that arrives in chunks: each chunk types on from where the last one stopped. */
function Streamed() {
  const [chunks, setChunks] = useState(0)
  useEffect(() => {
    if (chunks >= STREAM.length) return
    const id = window.setTimeout(() => setChunks((n) => n + 1), chunks === 0 ? 1200 : 700)
    return () => window.clearTimeout(id)
  }, [chunks])
  return <TypingBubble text={STREAM.slice(0, chunks).join("")} speed={2} tail="bottom" tailAlign="end" />
}

function Speaker({ children }: { children: React.ReactNode }) {
  return <span className="px-2 font-letter text-sm tracking-wide uppercase">{children}</span>
}

export function Preview() {
  const [run, setRun] = useState(0)
  return (
    <div className="grid max-w-2xl gap-8">
      <div className="flex flex-col items-start gap-1">
        <SpeechBubble tail="bottom" tailAlign="start">
          Is chapter 12 ready for Friday?
        </SpeechBubble>
        <Speaker>Editor</Speaker>
      </div>
      <div key={`reply-${run}`} className="flex flex-col items-end gap-1">
        <Delayed text={REPLY} delay={1200} tail="bottom" tailAlign="end" />
        <Speaker>Mika</Speaker>
      </div>
      <div key={`thought-${run}`} className="flex flex-col items-start gap-1">
        <Delayed text={THOUGHT} delay={2400} variant="thought" tail="bottom" tailAlign="start" />
        <Speaker>Rin · thinking…</Speaker>
      </div>
      <div key={`stream-${run}`} className="flex flex-col items-end gap-1">
        <Streamed />
        <Speaker>Assistant · streamed</Speaker>
      </div>
      <div>
        <Button variant="outline" onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
      </div>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="speech · dots" size="lg">
        <TypingBubble text="" />
      </Tile>
      <Tile label="speech · half-typed" size="lg">
        <TypingBubble text="Two pages still need their tones." progress={0.45} />
      </Tile>
      <Tile label="speech · done" size="lg">
        <TypingBubble text="Two pages still need their tones." speed={0} />
      </Tile>
      <Tile label="speech · text, then waiting" size="lg">
        <TypingBubble text="Page 14:" typing speed={0} />
      </Tile>
      <Tile label="thought · dots" size="lg">
        <TypingBubble text="" variant="thought" />
      </Tile>
      <Tile label="thought · half-typed" size="lg">
        <TypingBubble text="What if the rival wins…" variant="thought" progress={0.5} />
      </Tile>
      <Tile label="thought · done" size="lg">
        <TypingBubble text="What if the rival wins…" variant="thought" speed={0} />
      </Tile>
      <Tile label="tail · end" size="lg">
        <TypingBubble text="On my way." speed={0} tail="end" tailAlign="center" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <TypingBubble text="Coming right up!" progress={0.55} />
}
