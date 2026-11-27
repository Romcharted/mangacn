import { Pencil } from "lucide-react"
import { Button } from "@registry/manga/ui/button"
import { Tooltip, TooltipBubble, TooltipContent, TooltipTrigger } from "@registry/manga/ui/tooltip"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Hover me</TooltipTrigger>
      <TooltipContent>Psst, a tooltip.</TooltipContent>
    </Tooltip>
  )
}

function Thought() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Thinking…</TooltipTrigger>
      <TooltipContent variant="thought">Maybe tomorrow.</TooltipContent>
    </Tooltip>
  )
}

function IconOnly() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" className="min-h-11 min-w-11 sm:min-h-8 sm:min-w-8" aria-label="Bookmark this page" />}>
        <Pencil />
      </TooltipTrigger>
      <TooltipContent side="bottom">Bookmark this page</TooltipContent>
    </Tooltip>
  )
}

function BelowText() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" className="min-h-11 sm:min-h-8" />}>Reading time</TooltipTrigger>
      <TooltipContent side="bottom">About 14 minutes for this chapter.</TooltipContent>
    </Tooltip>
  )
}

export const examples: Example[] = [
  { fn: "Thought", title: "A thought", description: "variant=\"thought\" draws two small circles instead of a tail, for an inner voice.", Component: Thought },
  { fn: "IconOnly", title: "On an icon button", description: "An icon-only button gets an aria-label for screen readers and a tooltip for everyone else.", Component: IconOnly },
  { fn: "BelowText", title: "Below the trigger", description: "side=\"bottom\" places the bubble under a text trigger.", Component: BelowText },
]

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
    <div className="pt-10">
      <Tooltip>
        <TooltipTrigger render={<Button size="sm" variant="outline" />}>Hover me</TooltipTrigger>
        <TooltipContent>Psst, a tooltip.</TooltipContent>
      </Tooltip>
    </div>
  )
}
