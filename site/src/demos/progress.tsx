import { useEffect, useState } from "react"
import { Progress } from "@registry/manga/ui/progress"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

function Row({ id, label, value }: { id: string; label: string; value: number }) {
  return (
    <div className="grid w-full max-w-72 gap-2">
      <div className="flex justify-between">
        <span id={id} className="font-letter text-base tracking-wide uppercase">
          {label}
        </span>
        <span className="font-mono text-sm">{value} %</span>
      </div>
      <Progress value={value} aria-labelledby={id} />
    </div>
  )
}

export function Preview() {
  const [value, setValue] = useState(20)
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 10 : v + 15)), 1200)
    return () => clearInterval(id)
  }, [])
  return <Row id="p-vol3" label="Downloading Vol. 3" value={Math.min(value, 100)} />
}

function Queued() {
  return <Row id="p-queued" label="Waiting in queue" value={0} />
}

function Halfway() {
  return <Row id="p-half" label="Inking pages" value={50} />
}

function Complete() {
  return <Row id="p-done" label="Vol. 2" value={100} />
}

export const examples: Example[] = [
  { fn: "Queued", title: "Queued", description: "value={0}: the rail is empty and the label says the job has not started.", Component: Queued },
  { fn: "Halfway", title: "Halfway", description: "value={50}: the fill covers half the rail, in steps, with the number in monospace beside the label.", Component: Halfway },
  { fn: "Complete", title: "Complete", description: "value={100}: the rail is full and the speed lines reach the end.", Component: Complete },
]

export function States() {
  return (
    <Tiles>
      <Tile label="0 %" size="lg">
        <Row id="s-0" label="Queued" value={0} />
      </Tile>
      <Tile label="40 %" size="lg">
        <Row id="s-40" label="Downloading" value={40} />
      </Tile>
      <Tile label="100 %" size="lg">
        <Row id="s-100" label="Done" value={100} />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Progress value={62} className="w-48" aria-label="Download" />
}
