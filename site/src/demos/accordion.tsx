import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@registry/manga/ui/accordion"
import { force, Tile, Tiles } from "../state-grid"

const faq = [
  { q: "When is the next chapter out?", a: "Every second Friday, at dawn." },
  { q: "Can I read it offline?", a: "Yes: open a volume once and it stays on your device." },
  { q: "Where are the extras?", a: "At the end of each volume, after the afterword." },
]

export function Preview() {
  return (
    <Accordion defaultValue={["0"]} className="max-w-xl">
      {faq.map((f, i) => (
        <AccordionItem key={i} value={String(i)}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
      <AccordionItem value="x" disabled>
        <AccordionTrigger>Bonus volume (soon)</AccordionTrigger>
        <AccordionContent>Not yet.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

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
