import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@registry/manga/ui/resizable"
import { Tile, Tiles, force } from "../state-grid"
import { artSrc } from "../mapless"

const PAGES = ["page-1-bridge", "page-2-lighthouse", "cover-1", "cover-2"] as const

/* A page of the reader: a page of "Mapless", the showcase's series (AI-generated, see public/art/CREDITS.md). */
function Page({ n }: { n: number }) {
  return (
    <div className="relative grid h-full min-h-24 place-items-center overflow-hidden bg-background p-3">
      <img src={artSrc(PAGES[(n - 1) % PAGES.length], 200)} alt="" className="h-full max-h-56 w-auto border-ink-fine object-contain" />
      <span className="absolute start-2 top-2 font-letter text-sm uppercase">p. {n}</span>
    </div>
  )
}

function Note({ title, children }: { title: string; children: string }) {
  return (
    <div className="h-full bg-background p-3">
      <p className="font-letter text-sm uppercase underline decoration-2 underline-offset-4">{title}</p>
      <p className="pt-2 text-sm">{children}</p>
    </div>
  )
}

export function Preview() {
  return (
    <div className="ink-case relative h-[26rem] w-full sm:h-96">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel defaultSize="60" minSize="30">
          <Page n={12} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="40" minSize="20">
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="50" minSize="25">
              <Note title="Draft">The rain never stopped over the harbour.</Note>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="50" minSize="25">
              <Note title="Notes">Check the bubble order on page 13.</Note>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function Split({ orientation = "horizontal", frozen }: { orientation?: "horizontal" | "vertical"; frozen?: "hover" | "focus" }) {
  return (
    <div className="ink-case relative h-28 w-full">
      <ResizablePanelGroup orientation={orientation} className="h-full">
        <ResizablePanel defaultSize="50" minSize="20">
          <Page n={1} />
        </ResizablePanel>
        <ResizableHandle withHandle {...(frozen ? force(frozen) : {})} />
        <ResizablePanel defaultSize="50" minSize="20">
          <Page n={2} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function States() {
  return (
    <div className="space-y-6">
      <p className="text-sm">Handle: rest · hover · focus · dragging (the grip is an ink flat). Vertical and horizontal.</p>
      <Tiles>
        <Tile label="rest" size="full">
          <Split />
        </Tile>
        <Tile label="hover" size="full">
          <Split frozen="hover" />
        </Tile>
        <Tile label="focus" size="full">
          <Split frozen="focus" />
        </Tile>
        <Tile label="vertical split" size="full">
          <Split orientation="vertical" />
        </Tile>
      </Tiles>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-full">
      <div className="ink-case relative h-28 w-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize="60">
            <Page n={3} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="40">
            <Page n={4} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
