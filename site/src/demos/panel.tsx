import { Panel, PanelCaption, PanelGrid } from "@registry/manga/signature/panel"
import { Sfx } from "@registry/manga/signature/sfx"
import { SpeedLines } from "@registry/manga/signature/speed-lines"
import { Figure, Skyline } from "../art"

export function Preview() {
  return (
    <div className="grid gap-4">
      <PanelGrid cols={3} rows={2} className="aspect-[3/2] w-full max-w-2xl">
        <Panel colSpan={2} rowSpan={2}>
          <SpeedLines className="absolute inset-0">
            <Figure className="absolute inset-x-0 bottom-0 mx-auto h-4/5" />
          </SpeedLines>
        </Panel>
        <Panel cut={{ side: "start" }}>
          <Skyline className="absolute inset-x-0 bottom-0 h-2/3 w-full" />
          <PanelCaption position="top-end">Midnight.</PanelCaption>
        </Panel>
        <Panel ink>
          <div className="absolute inset-0 grid place-items-center">
            <Sfx variant="outline" size="md">シーン</Sfx>
          </div>
        </Panel>
      </PanelGrid>
      <p className="text-sm">The grid follows the reading order: switch “Read ←” in the bar to flow the panels right to left.</p>
    </div>
  )
}

export function Thumb() {
  return (
    <PanelGrid cols={3} rows={2} gap="0.3rem" className="h-28 w-48 p-1">
      <Panel colSpan={2} rowSpan={2} className="min-h-0" />
      <Panel cut={{ side: "start", size: 10 }} className="min-h-0" />
      <Panel ink className="min-h-0" />
    </PanelGrid>
  )
}
