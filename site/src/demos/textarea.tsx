import { useState } from "react"
import { Textarea } from "@registry/manga/ui/textarea"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return <Textarea placeholder="What did you think of chapter 12?" className="w-72" aria-label="Review" />
}

function Counter() {
  const [text, setText] = useState("")
  return (
    <div className="grid w-72 gap-2">
      <Textarea
        className="w-full"
        value={text}
        maxLength={140}
        onChange={(e) => setText(e.target.value)}
        placeholder="One line about the chapter…"
        aria-label="Note"
      />
      <p aria-live="polite" className="text-right font-mono text-sm">
        {text.length} / 140
      </p>
    </div>
  )
}

function Invalid() {
  return (
    <div className="grid w-72 gap-2">
      <Textarea className="w-full" defaultValue="Too short" aria-invalid aria-label="Review, too short" />
      <p className="text-sm">Write at least 20 characters.</p>
    </div>
  )
}

function ReadOnly() {
  return <Textarea className="w-72" readOnly defaultValue="Archived review. Comments are closed on this chapter." aria-label="Archived review" />
}

export const examples: Example[] = [
  { fn: "Counter", title: "With a counter", description: "maxLength caps the text at 140 characters; the count below follows the value.", Component: Counter },
  { fn: "Invalid", title: "Invalid", description: "aria-invalid draws the accent line and a mark; the hint under it says what to fix.", Component: Invalid },
  { fn: "ReadOnly", title: "Read only", description: "readOnly keeps the text on the page with a thinner line, and blocks typing.", Component: ReadOnly },
]

export function States() {
  return (
    <Tiles>
      <Tile label="rest" size="lg"><Textarea placeholder="Your review…" aria-label="Rest" /></Tile>
      <Tile label="hover" size="lg"><Textarea placeholder="Your review…" aria-label="Hover" {...force("hover")} /></Tile>
      <Tile label="focus" size="lg"><Textarea placeholder="Your review…" aria-label="Focus" {...force("focus")} /></Tile>
      <Tile label="disabled" size="lg"><Textarea disabled defaultValue="Comments are closed." aria-label="Disabled" /></Tile>
      <Tile label="error" size="lg"><Textarea aria-invalid defaultValue="Too short" aria-label="Error" /></Tile>
      <Tile label="read-only" size="lg"><Textarea readOnly defaultValue="Archived review." aria-label="Read-only" /></Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Textarea placeholder="Your review…" className="min-h-20 w-48" aria-label="Review" />
}
