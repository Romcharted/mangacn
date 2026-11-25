import { Button } from "@registry/manga/ui/button"
import { Tooltip, TooltipBubble, TooltipContent, TooltipTrigger } from "@registry/manga/ui/tooltip"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-wrap gap-6 py-6">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
        <TooltipContent>Psst, a tooltip.</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Thinking…</TooltipTrigger>
        <TooltipContent variant="thought">Maybe tomorrow.</TooltipContent>
      </Tooltip>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      {(["speech", "thought"] as const).flatMap((v) =>
        (["top", "bottom", "left", "right"] as const).map((side) => (
          <Tile key={v + side} label={`${v} · side ${side}`}>
            <div className="py-6">
              <TooltipBubble variant={v} side={side}>
                {v === "speech" ? "Psst!" : "Hmm…"}
              </TooltipBubble>
            </div>
          </Tile>
        )),
      )}
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="pb-4">
      <TooltipBubble>Psst, a tooltip.</TooltipBubble>
    </div>
  )
}
