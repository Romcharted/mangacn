import { Button } from "@registry/manga/ui/button"
import { Popover, PopoverBubble, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@registry/manga/ui/popover"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="pb-40">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Volume details</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Vol. 3 — Harbour</PopoverTitle>
            <PopoverDescription>18 chapters · finished in 2026.</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}

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
