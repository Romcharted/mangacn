import { useState } from "react"
import { ChapterTitle } from "@registry/manga/signature/chapter-title"
import { Button } from "@registry/manga/ui/button"
import type { Example } from "../registry"
import { Tile } from "../state-grid"

export function Preview() {
  return <ChapterTitle number="03" title="The first panel" subtitle="Where a blank page learns to talk." vertical="第三話" className="w-80 max-w-full" />
}

function Ink() {
  return <ChapterTitle number="04" title="Night shift" variant="ink" vertical="夜" subtitle="The ink version, for a flashback or a night scene." className="w-80 max-w-full" />
}

function Animated() {
  const [run, setRun] = useState(0)
  return (
    <div className="grid w-80 max-w-full justify-items-center gap-4">
      <ChapterTitle key={run} animated number="03" title="The first panel" subtitle="The number pops and the rule grows in steps." className="w-full" />
      <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => setRun((n) => n + 1)}>
        Replay
      </Button>
    </div>
  )
}

function CustomLabel() {
  return <ChapterTitle number="12" label="Part" title="A very long chapter title that wraps" subtitle="label replaces the word above the number." className="w-80 max-w-full" />
}

export const examples: Example[] = [
  { fn: "Ink", title: "Ink page", description: "variant ink turns the page to ink with paper lettering, for a flashback or a night scene.", Component: Ink },
  { fn: "Animated", title: "Animated", description: "animated pops the number and grows the rule when the page appears; Replay runs it again.", Component: Animated },
  { fn: "CustomLabel", title: "Custom label", description: "label changes the small lettering above the number, and a long title wraps under the rule.", Component: CustomLabel },
]

export function States() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Tile label="paper · with vertical text" size="full">
        <ChapterTitle number="01" title="Opening" vertical="序章" className="w-full" />
      </Tile>
      <Tile label="ink · with vertical text" size="full">
        <ChapterTitle number="02" title="Flashback" variant="ink" vertical="回想" className="w-full" />
      </Tile>
      <Tile label="paper · subtitle, no vertical" size="full">
        <ChapterTitle number="12" label="Part" title="A very long chapter title that wraps" subtitle="A subtitle under the rule." className="w-full" />
      </Tile>
      <Tile label="ink · roman numeral" size="full">
        <ChapterTitle number="IV" label="Act" title="Showdown" variant="ink" className="w-full" />
      </Tile>
    </div>
  )
}

export function Thumb() {
  return <ChapterTitle number="03" title="Opening" vertical="序" className="w-56 p-2! [&_h2]:text-2xl!" />
}
