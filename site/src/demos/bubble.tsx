import { Bubble, BubbleContent, BubbleGroup } from "@registry/manga/ui/bubble"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="grid max-w-lg gap-6">
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
