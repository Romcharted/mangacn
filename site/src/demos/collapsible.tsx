import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@registry/manga/ui/collapsible"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Chapter notes</CollapsibleTrigger>
        <CollapsibleContent>
          The rooftop scenes were drawn at night, so the screentone carries the light.
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Translator's afterword</CollapsibleTrigger>
        <CollapsibleContent>
          Sound effects stay in the original katakana, with a small gloss beside each one.
        </CollapsibleContent>
      </Collapsible>
      <Collapsible disabled>
        <CollapsibleTrigger>Bonus pages (soon)</CollapsibleTrigger>
        <CollapsibleContent>Not yet.</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest" size="lg">
        <Collapsible>
          <CollapsibleTrigger>Closed</CollapsibleTrigger>
        </Collapsible>
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <Collapsible>
          <CollapsibleTrigger {...force("hover")}>Hover</CollapsibleTrigger>
        </Collapsible>
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <Collapsible>
          <CollapsibleTrigger {...force("focus")}>Focus</CollapsibleTrigger>
        </Collapsible>
      </Tile>
      <Tile label="open · chevron turned" size="full">
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Open</CollapsibleTrigger>
          <CollapsibleContent>The content unfolds by steps.</CollapsibleContent>
        </Collapsible>
      </Tile>
      <Tile label="trigger · disabled" size="lg">
        <Collapsible disabled>
          <CollapsibleTrigger>Disabled</CollapsibleTrigger>
        </Collapsible>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Collapsible defaultOpen className="w-52 text-sm">
      <CollapsibleTrigger className="py-1 text-sm">Chapter 1</CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-sm">The long night.</CollapsibleContent>
    </Collapsible>
  )
}
