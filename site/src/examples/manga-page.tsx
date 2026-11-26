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

const bubble = "w-full px-[1.8cqi]! py-[1.4cqi]! text-[2.4cqi]! leading-tight!"
const caption = "static! inline-block px-[1.4cqi]! py-[0.6cqi]! text-[2.2cqi]! leading-tight!"

/** The bridge page, lettered with the kit. */
export function LetteredBridge() {
  return (
    <figure className="@container relative m-0 w-full border-ink-panel bg-background">
      <Art name="page-1-bridge" alt={ALT["page-1-bridge"]} shown="(min-width: 64rem) 32rem, 92vw" className="block h-auto w-full" />
      {/* panel 1: the sky above the bridge */}
      <At x={2.5} y={1.5}>
        <PanelCaption position="free" className={caption}>
          Day 41. No map shows this bridge.
        </PanelCaption>
      </At>
      <At x={74} y={2.5} w={23}>
        <SpeechBubble tail="bottom" tailAlign="start" className={bubble}>
          Nothing new gets drawn here.
        </SpeechBubble>
      </At>
      {/* panel 2: the clouds behind the knight */}
      <At x={29.5} y={33.6} w={19}>
        <SpeechBubble tail="start" className={bubble}>
          Turn back, cartographer.
        </SpeechBubble>
      </At>
      {/* panel 3: the sky on the right */}
      <At x={79} y={33.4} w={14}>
        <SpeechBubble variant="shout" tail="start" className={bubble.replace("2.4cqi", "2.1cqi")}>
          Kuro, back!
        </SpeechBubble>
      </At>
      {/* panel 4: the speed lines, then the burst */}
      <At x={29} y={59.5}>
        <Sfx size="lg" rotate={-12} className="text-[6cqi]!">
          KRAK!
        </Sfx>
      </At>
      {/* panel 5: the white around the drop */}
      <At x={74.5} y={93.4}>
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
