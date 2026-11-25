import { useState } from "react"
import { ChapterTitle } from "@registry/manga/signature/chapter-title"
import { Button } from "@registry/manga/ui/button"
import { Tile } from "../state-grid"

export function Preview() {
  const [run, setRun] = useState(0)
  return (
    <div className="grid max-w-3xl gap-6">
      <ChapterTitle
        key={run}
        animated
        number="03"
        title="The first panel"
        subtitle="Where a blank page learns to talk."
        vertical="第三話"
        className="border-ink-panel"
      />
      <ChapterTitle number="04" title="Night shift" variant="ink" vertical="夜" subtitle="The ink version, for a flashback or a night scene." />
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
