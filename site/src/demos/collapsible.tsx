import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@registry/manga/ui/collapsible"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="w-80">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="min-h-11 sm:min-h-8">Chapter notes</CollapsibleTrigger>
        <CollapsibleContent>The rooftop scenes were drawn at night, so the screentone carries the light.</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function Stack() {
  return (
    <div className="w-80 space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="min-h-11 sm:min-h-8">Chapter notes</CollapsibleTrigger>
        <CollapsibleContent>The rooftop scenes were drawn at night, so the screentone carries the light.</CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger className="min-h-11 sm:min-h-8">Translator&apos;s afterword</CollapsibleTrigger>
        <CollapsibleContent>Sound effects stay in the original katakana, with a small gloss beside each one.</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function Closed() {
  return (
    <div className="w-80">
      <Collapsible>
        <CollapsibleTrigger className="min-h-11 sm:min-h-8">Chapter 12 cast</CollapsibleTrigger>
        <CollapsibleContent>Suzu, Kuro, and the lighthouse keeper.</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function Disabled() {
  return (
    <div className="w-80">
      <Collapsible disabled>
        <CollapsibleTrigger className="min-h-11 sm:min-h-8">Bonus pages (soon)</CollapsibleTrigger>
        <CollapsibleContent>Not yet.</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Stack", title: "A stack of notes", description: "Several collapsibles stacked with space between them; each one opens on its own.", Component: Stack },
  { fn: "Closed", title: "Starts closed", description: "Without defaultOpen the content stays hidden until the trigger is pressed.", Component: Closed },
  { fn: "Disabled", title: "Disabled", description: "disabled keeps the label on paper with a dashed underline, and the content does not open.", Component: Disabled },
]

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest" size="lg">
        <Collapsible>
          <CollapsibleTrigger className="min-h-11 sm:min-h-8">Closed</CollapsibleTrigger>
        </Collapsible>
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <Collapsible>
          <CollapsibleTrigger className="min-h-11 sm:min-h-8" {...force("hover")}>
            Hover
          </CollapsibleTrigger>
        </Collapsible>
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <Collapsible>
          <CollapsibleTrigger className="min-h-11 sm:min-h-8" {...force("focus")}>
            Focus
          </CollapsibleTrigger>
        </Collapsible>
      </Tile>
      <Tile label="open · chevron turned" size="full">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="min-h-11 sm:min-h-8">Open</CollapsibleTrigger>
          <CollapsibleContent>The content unfolds by steps.</CollapsibleContent>
        </Collapsible>
      </Tile>
      <Tile label="trigger · disabled" size="lg">
        <Collapsible disabled>
          <CollapsibleTrigger className="min-h-11 sm:min-h-8">Disabled</CollapsibleTrigger>
        </Collapsible>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Collapsible defaultOpen className="w-52 text-sm">
      <CollapsibleTrigger className="min-h-11 py-1 text-sm sm:min-h-8">Chapter 1</CollapsibleTrigger>
      <CollapsibleContent className="pt-2 text-sm">The long night.</CollapsibleContent>
    </Collapsible>
  )
}
