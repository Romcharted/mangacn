import { Button } from "@registry/manga/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, type TooltipVariant } from "@registry/manga/ui/tooltip"

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
    <div className="grid grid-cols-2 gap-x-6 gap-y-24 px-4 py-20 sm:grid-cols-4">
      {(["speech", "thought"] as TooltipVariant[]).flatMap((v) =>
        (["top", "bottom"] as const).map((side) => (
          <div key={v + side} className="grid place-items-center">
            <Tooltip open>
              <TooltipTrigger render={<Button variant="ghost" size="sm" tabIndex={-1} />}>
                {v} · {side}
              </TooltipTrigger>
              <TooltipContent variant={v} side={side}>
                {v === "speech" ? "Speech" : "Thought"}
              </TooltipContent>
            </Tooltip>
          </div>
        )),
      )}
    </div>
  )
}
