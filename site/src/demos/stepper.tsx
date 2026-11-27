import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { Stepper } from "@registry/manga/signature/stepper"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

const steps = [
  { label: "Account", description: "Pen name and email" },
  { label: "Shelf", description: "Pick three series" },
  { label: "Reading", description: "Order and alerts" },
  { label: "Done" },
]

export const previewWide = true

export function Preview() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="grid w-full max-w-xl justify-items-center gap-6">
      <Stepper steps={steps} current={current} className="w-full" />
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" className="min-h-11 sm:min-h-8" onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
          Back
        </Button>
        <Button className="min-h-11 sm:min-h-8" onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}>
          Next
        </Button>
      </div>
    </div>
  )
}

function Vertical() {
  return (
    <div className="grid w-64 max-w-full justify-items-center">
      <Stepper steps={steps.slice(0, 3)} current={2} orientation="vertical" className="w-full" />
    </div>
  )
}

function AllDone() {
  return <Stepper steps={steps} current={steps.length} className="w-full" />
}

function FirstStep() {
  return <Stepper steps={[{ label: "Account" }, { label: "Shelf" }, { label: "Reading" }]} current={0} className="w-full" />
}

export const examples: Example[] = [
  { fn: "Vertical", title: "Vertical", description: "orientation vertical stacks the steps, with their descriptions, down the side of a form.", Component: Vertical },
  { fn: "AllDone", title: "All done", description: "Every step before current is done and gets a brush check; current past the last step finishes the flow.", Component: AllDone, wide: true },
  { fn: "FirstStep", title: "First step", description: "current 0 marks the first step as the current one; the next ones are paper squares.", Component: FirstStep, wide: true },
]

export function States() {
  return (
    <Tiles>
      <Tile label="horizontal · step 2 of 4" size="full">
        <Stepper steps={steps} current={1} className="w-full" />
      </Tile>
      <Tile label="horizontal · finished" size="full">
        <Stepper steps={steps} current={4} className="w-full" />
      </Tile>
      <Tile label="vertical · step 3 of 3" size="full">
        <div className="w-56 max-w-full">
          <Stepper steps={steps.slice(0, 3)} current={2} orientation="vertical" className="w-full" />
        </div>
      </Tile>
    </Tiles>
  )
}

/** Live: a click moves to the next step. */
export function Thumb() {
  const [current, setCurrent] = useState(1)
  return (
    <button type="button" aria-label="Next step" onClick={() => setCurrent((c) => (c + 1) % 4)} className="cursor-pointer p-1 focus-ink">
      <Stepper steps={[{ label: "One" }, { label: "Two" }, { label: "Three" }]} current={current} className="w-52 text-sm" />
    </button>
  )
}
