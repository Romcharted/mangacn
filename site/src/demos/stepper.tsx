import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { Stepper } from "@registry/manga/signature/stepper"

const steps = [
  { label: "Account", description: "Pen name and email" },
  { label: "Shelf", description: "Pick three series" },
  { label: "Reading", description: "Order and alerts" },
  { label: "Done" },
]

export function Preview() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="grid gap-8">
      <Stepper steps={steps} current={current} />
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
          Back
        </Button>
        <Button onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}>Next</Button>
      </div>
      <Stepper steps={steps.slice(0, 3)} current={2} orientation="vertical" className="max-w-xs" />
    </div>
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
