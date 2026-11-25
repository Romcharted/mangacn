import { Textarea } from "@registry/manga/ui/textarea"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return <Textarea placeholder="What did you think of chapter 12?" className="max-w-lg" aria-label="Review" />
}

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
