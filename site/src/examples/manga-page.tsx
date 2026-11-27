import type { ReactNode } from "react"
import { PanelCaption } from "@registry/manga/signature/panel"
import { Sfx } from "@registry/manga/signature/sfx"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { CodeToggle } from "../copy"
import { ALT, Art } from "../mapless"
import source from "./manga-page.tsx?raw"

/*
 * A page of "Mapless" (AI-generated art, see public/art/CREDITS.md), shown as it was drawn, then lettered with
 * the kit: real SpeechBubbles, an Sfx and PanelCaptions, set on the calm parts of the picture (sky, clouds, the
 * white of the last panel) so they never cover a face. The text is real text: it can be read, selected and
 * translated. Sizes follow the page width (container units), so the lettering keeps its place at any size.
 */

/** Something set on the page: x and y in percent of the page, from its top-left corner. */
function At({ x, y, w, children }: { x: number; y: number; w?: number; children: ReactNode }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: w ? `${w}%` : undefined }}>
      {children}
    </div>
  )
}

// Sizes follow the page (container units) with a 10px floor, so the lettering stays readable on a phone.
const bubble = "w-full px-[1.6cqi]! py-[1.2cqi]! text-[max(10px,2.4cqi)]! leading-tight!"
const caption = "static! inline-block px-[1.4cqi]! py-[0.6cqi]! text-[max(10px,2.2cqi)]! leading-tight!"

/** The bridge page, lettered with the kit. */
export function LetteredBridge() {
  return (
    <figure className="@container relative m-0 w-full overflow-hidden border-ink-panel bg-background">
      <Art name="page-1-bridge" alt={ALT["page-1-bridge"]} shown="(min-width: 64rem) 32rem, 92vw" className="block h-auto w-full" />
      {/* panel 1: the caption in the sky; the Eraser, standing at the right, speaks from the sky on his left */}
      <At x={2.5} y={1.5}>
        <PanelCaption position="free" className={caption}>
          Day 41. No map shows this bridge.
        </PanelCaption>
      </At>
      <At x={45} y={7} w={21}>
        <SpeechBubble tail="end" tailAlign="end" className={bubble}>
          Nothing new gets drawn here.
        </SpeechBubble>
      </At>
      {/* panel 2: the sky beside the Eraser's head, never past the middle of the page */}
      <At x={29} y={31.5} w={17}>
        <SpeechBubble tail="start" className={bubble}>
          Turn back, cartographer.
        </SpeechBubble>
      </At>
      {/* panel 3: Suzu shouts from the top of her panel, on one line, the tail down to her face */}
      <At x={52} y={31.5} w={38}>
        <SpeechBubble variant="shout" tail="bottom" tailAlign="center" className={`${bubble} text-center whitespace-nowrap`}>
          KURO, BACK!
        </SpeechBubble>
      </At>
      {/* panel 4: the speed lines, then the burst */}
      <At x={29} y={59.5}>
        <Sfx size="lg" rotate={-12} className="text-[max(24px,6cqi)]!">
          KRAK!
        </Sfx>
      </At>
      {/* inset panel: the white around the drop, the caption inside the frame */}
      <At x={75.5} y={90.5}>
        <PanelCaption position="free" className={caption}>
          …drip.
        </PanelCaption>
      </At>
    </figure>
  )
}

/** The bridge page as drawn, beside the same page lettered with the kit. */
export function MangaPage() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="grid gap-6 md:grid-cols-2">
        <figure className="m-0 grid content-start gap-2">
          <Art name="page-1-bridge" shown="(min-width: 64rem) 32rem, 92vw" className="block h-auto w-full border-ink-panel" />
          <figcaption className="font-mono text-xs">As drawn: the picture alone.</figcaption>
        </figure>
        <div className="grid content-start gap-2">
          <LetteredBridge />
          <p className="font-mono text-xs">Lettered with the kit: SpeechBubble, Sfx and PanelCaption, in real text.</p>
        </div>
      </div>
      <p className="max-w-prose text-sm">
        The picture is AI-generated, made for the showcase&apos;s demo series, Mapless (
        <a className="underline" href={`${import.meta.env.BASE_URL}art/CREDITS.md`}>
          credits
        </a>
        ). The lettering sits on the calm parts of the page: the sky, the clouds, the white around the last panel.
      </p>
      <CodeToggle text={source} />
    </div>
  )
}
