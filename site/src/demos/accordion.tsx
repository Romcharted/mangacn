import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@registry/manga/ui/accordion"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const faq = [
  { q: "When is the next chapter out?", a: "Every second Friday, at dawn." },
  { q: "Can I read it offline?", a: "Yes: open a volume once and it stays on your device." },
  { q: "Where are the extras?", a: "At the end of each volume, after the afterword." },
]

export function Preview() {
  return (
    <Accordion defaultValue={["0"]} className="w-full max-w-md">
      {faq.map((f, i) => (
        <AccordionItem key={i} value={String(i)}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function DisabledItem() {
  return (
    <Accordion defaultValue={["a"]} className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>Chapter 12: The lighthouse</AccordionTrigger>
        <AccordionContent>The lamps are lit. Read it now.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="x" disabled>
        <AccordionTrigger>Bonus volume (soon)</AccordionTrigger>
        <AccordionContent>Not yet.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function LongAnswer() {
  return (
    <Accordion defaultValue={["a"]} className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>Why is the ink so thick?</AccordionTrigger>
        <AccordionContent>
          Each panel is drawn with a 3px line so it reads from across the room. The lines stay the same on every page, so
          the story keeps its rhythm even when the layout changes.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function AllClosed() {
  return (
    <Accordion className="w-full max-w-md">
      {faq.map((f, i) => (
        <AccordionItem key={i} value={String(i)}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export const examples: Example[] = [
  { fn: "DisabledItem", title: "Disabled item", description: "disabled keeps the label on paper with a dashed underline, and the item does not open.", Component: DisabledItem },
  { fn: "LongAnswer", title: "Long answer", description: "A long answer wraps inside the case, and defaultValue opens the item from the start.", Component: LongAnswer },
  { fn: "AllClosed", title: "All closed", description: "Without defaultValue every item starts closed; each one opens on its own when clicked.", Component: AllClosed },
]

export function States() {
  return (
    <Tiles>
      <Tile label="closed · hover · focus · open · disabled" size="full">
        <Accordion defaultValue={["open"]} className="max-w-xl">
          <AccordionItem value="a">
            <AccordionTrigger>Closed</AccordionTrigger>
            <AccordionContent>…</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger {...force("hover")}>Hover</AccordionTrigger>
            <AccordionContent>…</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger {...force("focus")}>Focus</AccordionTrigger>
            <AccordionContent>…</AccordionContent>
          </AccordionItem>
          <AccordionItem value="open">
            <AccordionTrigger>Open</AccordionTrigger>
            <AccordionContent>The content drops in by steps.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="d" disabled>
            <AccordionTrigger>Disabled</AccordionTrigger>
            <AccordionContent>…</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Accordion className="w-52 text-sm">
      <AccordionItem value="a">
        <AccordionTrigger className="py-1.5 text-sm">Chapter 1</AccordionTrigger>
        <AccordionContent className="py-2 text-sm">The long night.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger className="py-1.5 text-sm">Chapter 2</AccordionTrigger>
        <AccordionContent className="py-2 text-sm">After the rain.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
