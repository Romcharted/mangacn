import { Button } from "@registry/manga/ui/button"
import { Popover, PopoverBubble, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@registry/manga/ui/popover"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Volume details</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Vol. 3 — Harbour</PopoverTitle>
          <PopoverDescription>18 chapters · finished in 2026.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

function Above() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Page notes</PopoverTrigger>
      <PopoverContent side="top">
        <PopoverHeader>
          <PopoverTitle>Page 14</PopoverTitle>
          <PopoverDescription>The lantern is drawn twice; the second one is the one to keep.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

function WithButton() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Reading progress</PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverHeader>
          <PopoverTitle>Continue Vol. 3?</PopoverTitle>
          <PopoverDescription>You stopped on page 9.</PopoverDescription>
        </PopoverHeader>
        <Button size="sm" className="min-h-11 sm:min-h-8">
          Resume
        </Button>
      </PopoverContent>
    </Popover>
  )
}

function Narrow() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" className="min-h-11 sm:min-h-8" />}>Chapter info</PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverDescription>Chapter 12 · 18 pages · 14 minutes.</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}

export const examples: Example[] = [
  { fn: "Above", title: "Opens above", description: "side=\"top\" puts the bubble above its trigger, with the tail pointing down at it.", Component: Above },
  { fn: "WithButton", title: "With a button", description: "A button inside the bubble acts on the content above it; here it resumes the volume.", Component: WithButton },
  { fn: "Narrow", title: "A short note", description: "className=\"w-56\" sets a narrow bubble for one line of information.", Component: Narrow },
]

export function States() {
  return (
    <Tiles>
      {(["bottom", "top"] as const).map((side) => (
        <Tile key={side} label={`side · ${side}`} size="lg">
          <div className="py-6">
            {/* static twin: plain elements, the Popover parts need a live Popover around them */}
            <PopoverBubble side={side}>
              <p className="font-letter text-lg leading-tight tracking-wide uppercase">Vol. 3 — Harbour</p>
              <p>18 chapters.</p>
            </PopoverBubble>
          </div>
        </Tile>
      ))}
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Popover>
      <PopoverTrigger render={<Button size="sm" variant="outline" />}>Details</PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverTitle>Vol. 3</PopoverTitle>
        <PopoverDescription>18 chapters.</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}
