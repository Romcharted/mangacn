import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@registry/manga/ui/resizable"
import { Tile, Tiles, force } from "../state-grid"

/* A page of the reader: an abstract figure drawn in SVG, with a speech bubble. */
function Page({ n }: { n: number }) {
  return (
    <div className="relative grid h-full min-h-24 place-items-center overflow-hidden bg-background p-3">
      <svg viewBox="0 0 120 150" className="h-full max-h-56 w-auto" aria-hidden>
        <rect x="2" y="2" width="116" height="146" className="fill-background stroke-foreground" strokeWidth="3" />
        <circle cx="60" cy="58" r="20" className="fill-foreground" />
        <path d="M30 150 C30 96 44 84 60 84 C76 84 90 96 90 150 Z" className="fill-foreground" />
        <path d="M6 20 L30 8 M6 32 L30 20 M6 44 L30 32" className="stroke-foreground" strokeWidth="2" />
        <path d="M114 20 L90 8 M114 32 L90 20 M114 44 L90 32" className="stroke-foreground" strokeWidth="2" />
      </svg>
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
    <div className="pointer-events-none w-full">
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
