import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@registry/manga/ui/resizable"
import type { Example } from "../registry"
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

export const previewWide = true

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

function Vertical() {
  return (
    <div className="ink-case relative h-72 w-full">
      <ResizablePanelGroup orientation="vertical" className="h-full">
        <ResizablePanel defaultSize="60" minSize="30">
          <Page n={5} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="40" minSize="25">
          <Note title="Storyboard">Panel five: the ferry comes in from the left.</Note>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function ThreePanels() {
  return (
    <div className="ink-case relative h-72 w-full">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel defaultSize="40" minSize="20">
          <Page n={2} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="35" minSize="20">
          <Page n={3} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="25" minSize="15">
          <Note title="Notes">Redo the lettering.</Note>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function Limits() {
  return (
    <div className="ink-case relative h-72 w-full">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel defaultSize="50" minSize="30" maxSize="70">
          <Page n={4} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50" minSize="30" maxSize="70">
          <Note title="Limits">Drag the line: each panel stops at 30% and 70%.</Note>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Vertical", title: "Vertical split", description: "The group stacks its panels: pull the line between the page and the storyboard note up or down.", Component: Vertical, wide: true },
  { fn: "ThreePanels", title: "Three panels", description: "Each ResizableHandle divides two neighbours; withHandle draws the grip on each line.", Component: ThreePanels, wide: true },
  { fn: "Limits", title: "Minimum and maximum", description: "minSize and maxSize, in percent, keep a panel from being dragged too small or too large.", Component: Limits, wide: true },
]

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
