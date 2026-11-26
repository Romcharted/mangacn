import { buttonClassName } from "@registry/manga/ui/button"
import { Manpu } from "@registry/manga/signature/manpu"
import { Panel, PanelCaption, PanelGrid } from "@registry/manga/signature/panel"
import { Sfx } from "@registry/manga/signature/sfx"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { SpeedLines } from "@registry/manga/signature/speed-lines"
import { Art } from "../mapless"

export function NotFound() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <PanelGrid cols={3} rows={2} className="aspect-[3/2] w-full">
        <Panel colSpan={2} rowSpan={2}>
          <SpeedLines hole={0.38} animated className="absolute inset-0 grid place-items-center">
            <Sfx size="xl" rotate={-6}>
              404
            </Sfx>
          </SpeedLines>
          <PanelCaption>Somewhere in the library…</PanelCaption>
        </Panel>
        <Panel cut={{ side: "start" }}>
          <Art name="suzu-shock" alt="Suzu, startled" shown="12rem" className="absolute inset-0 size-full object-cover" />
          <Manpu kind="sweat" size="2rem" className="absolute end-[22%] top-[22%]" />
        </Panel>
        <Panel>
          <div className="absolute inset-0 grid place-items-center p-2">
            <SpeechBubble variant="thought" tail="top" tailAlign="start" className="text-sm">
              This page went missing.
            </SpeechBubble>
          </div>
        </Panel>
      </PanelGrid>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <p className="text-base">The page you wanted is not in this volume.</p>
        {/* a link drawn as a button: works the same under Radix and Base UI */}
        <a href="#/" className={buttonClassName({ variant: "shout", size: "lg" }) + " inline-flex items-center"}>
          Back to the library
        </a>
      </div>
    </div>
  )
}
