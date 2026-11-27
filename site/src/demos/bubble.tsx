import { Bubble, BubbleContent, BubbleGroup } from "@registry/manga/ui/bubble"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="grid w-72 gap-6">
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>Did you read chapter 12?</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>The last page!</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>Twice. No spoilers.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}

function Variants() {
  return (
    <div className="grid w-72 gap-4">
      <Bubble variant="secondary">
        <BubbleContent>Paper, with an ink line.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Outline.</BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>Ghost, no bubble.</BubbleContent>
      </Bubble>
    </div>
  )
}

function Reply() {
  return (
    <div className="grid w-72">
      <Bubble align="end">
        <BubbleContent>See you Friday.</BubbleContent>
      </Bubble>
    </div>
  )
}

function Failed() {
  return (
    <div className="grid w-72">
      <Bubble variant="destructive">
        <BubbleContent>Not sent. Retry?</BubbleContent>
      </Bubble>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Variants", description: "variant=\"secondary\", \"outline\" and \"ghost\" give paper bubbles, from a framed one to no bubble at all.", Component: Variants },
  { fn: "Reply", title: "A reply", description: "The default variant is the ink bubble for your own messages; align=\"end\" puts it on the right.", Component: Reply },
  { fn: "Failed", title: "Failed message", description: "variant=\"destructive\" adds an accent line and a mark for a message that did not go through.", Component: Failed },
]

export function States() {
  return (
    <Tiles>
      {(["default", "secondary", "outline", "ghost", "destructive"] as const).map((v) => (
        <Tile key={v} label={`variant · ${v}`} size="lg">
          <div className="pb-3">
            <Bubble variant={v}>
              <BubbleContent>{v === "destructive" ? "Not sent. Retry?" : "See you Friday."}</BubbleContent>
            </Bubble>
          </div>
        </Tile>
      ))}
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid w-52 gap-4 pb-2">
      <Bubble variant="secondary">
        <BubbleContent>Read it?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Twice.</BubbleContent>
      </Bubble>
    </div>
  )
}
