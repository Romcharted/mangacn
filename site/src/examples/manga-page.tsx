import { useEffect, useState, type ReactNode } from "react"
import { Panel, PanelCaption, PanelGrid, type PanelProps } from "@registry/manga/signature/panel"
import { Screentone } from "@registry/manga/signature/screentone"
import { Sfx } from "@registry/manga/signature/sfx"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { SpeedLines } from "@registry/manga/signature/speed-lines"
import { Eyes, Figure, Runner, Skyline } from "../art"
import { CodeToggle } from "../copy"
import { Choice, Flag } from "../playground"

type Key = "big" | "city" | "run" | "eyes" | "talk"

// Each panel: what it renders, and the same thing as code (kept side by side on purpose).
const PANELS: Record<Key, { render: ReactNode; code: string }> = {
  big: {
    render: (
      <SpeedLines hole={0.45} className="absolute inset-0 grid place-items-end">
        <Figure className="mx-auto h-[78%] w-full text-foreground" />
        <SpeechBubble variant="shout" tail="bottom" tailAlign="start" className="absolute end-3 top-3 text-base">
          Who's there?!
        </SpeechBubble>
        <Sfx size="lg" rotate={-10} className="absolute start-4 top-4">
          ドン
        </Sfx>
      </SpeedLines>
    ),
    code: `<SpeedLines hole={0.45} className="absolute inset-0 grid place-items-end">
      <Figure className="mx-auto h-[78%] w-full" />
      <SpeechBubble variant="shout" className="absolute end-3 top-3">Who's there?!</SpeechBubble>
      <Sfx size="lg" rotate={-10} className="absolute start-4 top-4">ドン</Sfx>
    </SpeedLines>`,
  },
  city: {
    render: (
      <>
        <Screentone density={35} fade="bottom" className="absolute inset-0" />
        <Skyline className="absolute inset-x-0 bottom-0 h-3/4 w-full text-foreground" />
        <PanelCaption>Midnight. The harbour district.</PanelCaption>
      </>
    ),
    code: `<Screentone density={35} fade="bottom" className="absolute inset-0" />
    <Skyline className="absolute inset-x-0 bottom-0 h-3/4 w-full" />
    <PanelCaption>Midnight. The harbour district.</PanelCaption>`,
  },
  run: {
    render: (
      <SpeedLines variant="motion" direction={-8} className="absolute inset-0 grid place-items-center">
        <Runner className="h-3/4 text-foreground" />
        <Sfx size="md" rotate={-14} className="absolute end-6 bottom-3">
          ザッ
        </Sfx>
      </SpeedLines>
    ),
    code: `<SpeedLines variant="motion" direction={-8} className="absolute inset-0 grid place-items-center">
      <Runner className="h-3/4" />
      <Sfx rotate={-14} className="absolute end-6 bottom-3">ザッ</Sfx>
    </SpeedLines>`,
  },
  eyes: {
    render: (
      <div className="absolute inset-0 grid place-items-center">
        <Eyes className="w-4/5 text-foreground" />
        <SpeechBubble variant="thought" tail="bottom" tailAlign="end" className="absolute start-3 top-3 text-sm">
          Not again…
        </SpeechBubble>
      </div>
    ),
    code: `<Eyes className="m-auto w-4/5" />
    <SpeechBubble variant="thought" tailAlign="end" className="absolute start-3 top-3">Not again…</SpeechBubble>`,
  },
  talk: {
    render: (
      <>
        <Screentone pattern="lines" density={15} angle={0} className="absolute inset-0" />
        <Figure className="absolute -bottom-2 start-2 h-2/3 text-foreground" />
        <SpeechBubble tail="start" tailAlign="end" className="absolute end-3 top-3 text-sm">
          Over here. Quick!
        </SpeechBubble>
      </>
    ),
    code: `<Screentone pattern="lines" density={15} angle={0} className="absolute inset-0" />
    <Figure className="absolute -bottom-2 start-2 h-2/3" />
    <SpeechBubble tail="start" tailAlign="end" className="absolute end-3 top-3">Over here. Quick!</SpeechBubble>`,
  },
}

type Slot = { key: Key } & Pick<PanelProps, "colSpan" | "rowSpan" | "cut">

const LAYOUTS = {
  "big + 2": {
    grid: { cols: 3, rows: 3 },
    box: "aspect-[4/5] w-full max-w-2xl",
    slots: [
      { key: "big", colSpan: 2, rowSpan: 2 },
      { key: "city" },
      { key: "talk" },
      { key: "run", colSpan: 2, cut: { side: "end" } },
      { key: "eyes", cut: { side: "start" } },
    ] as Slot[],
  },
  "2 × 2": {
    grid: { cols: 2, rows: 2 },
    box: "aspect-square w-full max-w-2xl",
    slots: [{ key: "big" }, { key: "city" }, { key: "run", cut: { side: "end" } }, { key: "eyes", cut: { side: "start" } }] as Slot[],
  },
  strip: {
    grid: { cols: 1, rows: 4 },
    box: "h-[56rem] w-full max-w-sm",
    slots: [{ key: "city" }, { key: "big" }, { key: "eyes" }, { key: "talk" }] as Slot[],
  },
} as const

type Layout = keyof typeof LAYOUTS

function slotProps(s: Slot) {
  const p: string[] = []
  if (s.colSpan) p.push(`colSpan={${s.colSpan}}`)
  if (s.rowSpan) p.push(`rowSpan={${s.rowSpan}}`)
  if (s.cut) p.push(`cut={{ side: "${s.cut.side}" }}`)
  return p.length ? " " + p.join(" ") : ""
}

function pageCode(layout: Layout, rtl: boolean) {
  const l = LAYOUTS[layout]
  return `import { Panel, PanelCaption, PanelGrid } from "@/components/manga/panel"
import { Screentone } from "@/components/manga/screentone"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Eyes, Figure, Runner, Skyline } from "./art" // your own drawings

export function Page() {
  return (
    <PanelGrid cols={${l.grid.cols}} rows={${l.grid.rows}}${rtl ? ` reading="rtl"` : ""} className="${l.box}">
${l.slots.map((s) => `  <Panel${slotProps(s)}>\n    ${PANELS[s.key].code}\n  </Panel>`).join("\n").replace(/^/gm, "    ")}
    </PanelGrid>
  )
}`
}

function useNarrow(px: number) {
  const query = `(max-width: ${px - 0.02}px)`
  const [narrow, setNarrow] = useState(() => typeof matchMedia === "function" && matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [query])
  return narrow
}

export function MangaPage() {
  const [chosen, setLayout] = useState<Layout>("big + 2")
  const [rtl, setRtl] = useState(false)
  // On a phone (under 480px) the page becomes a vertical strip.
  const narrow = useNarrow(480)
  const layout: Layout = narrow ? "strip" : chosen
  const l = LAYOUTS[layout]
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="flex flex-wrap items-end gap-6">
        {narrow ? (
          <p className="text-sm">On a narrow screen the page reads as a vertical strip.</p>
        ) : (
          <Choice label="layout" value={layout} options={Object.keys(LAYOUTS) as Layout[]} onChange={setLayout} />
        )}
        <div className="w-56">
          <Flag label="read right to left" checked={rtl} onChange={setRtl} />
        </div>
      </div>
      <div className="grid justify-items-center border-ink-fine p-3">
        <PanelGrid cols={l.grid.cols} rows={l.grid.rows} reading={rtl ? "rtl" : undefined} className={l.box}>
          {l.slots.map((s) => (
            <Panel key={s.key} colSpan={s.colSpan} rowSpan={s.rowSpan} cut={s.cut}>
              {PANELS[s.key].render}
            </Panel>
          ))}
        </PanelGrid>
      </div>
      <CodeToggle text={pageCode(layout, rtl)} />
    </div>
  )
}
