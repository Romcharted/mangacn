import { useState } from "react"
import {
  PAGE_FORMATS,
  PAGE_TEMPLATES,
  Page,
  Panel,
  PanelArt,
  PanelCaption,
  Place,
  Tier,
  type FrameShape,
  type PageFormat,
  type PageTemplate,
} from "@registry/manga/signature/panel"
import { Sfx } from "@registry/manga/signature/sfx"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { Code } from "../copy"
import { PAGE_FORMAT_DOC } from "../pages/format-doc"
import { Choice, Flag, Playground } from "../playground"
import { Tile, Tiles } from "../state-grid"
import { to } from "../router"
import type { Example } from "../registry"
import { ALT, artSrc, type ArtName } from "../mapless"

const TEMPLATES = Object.keys(PAGE_TEMPLATES) as PageTemplate[]
const FORMATS = Object.keys(PAGE_FORMATS) as PageFormat[]

/** A numbered panel (a Panel element, not a wrapper: Page reads its Panel children directly). */
const numbered = (n: number) => (
  <Panel key={n}>
    <Place x="50%" y="50%">
      <span className="font-letter text-[length:max(12px,calc(var(--pu)*6))] leading-none">{n}</span>
    </Place>
  </Panel>
)

// Pictures of "Mapless" (AI-generated, see public/art/CREDITS.md) for the panels of the preview, large files only.
const PANEL_ART: ArtName[] = ["suzu-portrait", "page-2-lighthouse", "map", "suzu-face", "eraser-full", "suzu-full", "cover-2"]
/** A panel filled with a picture of the series; its reading order on top when `showNumber`. */
const filled = (showNumber: boolean) => (n: number) => {
  const name = PANEL_ART[(n - 1) % PANEL_ART.length]
  return (
    <Panel key={n}>
      <PanelArt src={artSrc(name, 480)} alt={ALT[name]} />
      {showNumber && (
        <Place x="6%" y="6%" anchor="top-left">
          <span className="inline-grid min-w-6 place-items-center bg-background px-1 font-letter text-[length:max(12px,calc(var(--pu)*4))] leading-tight ring-[length:var(--mg-bw)] ring-foreground">{n}</span>
        </Place>
      )}
    </Panel>
  )
}

type Tiers = { panels: object[] }[]
function count(tiers: Tiers): number {
  return tiers.reduce((a, tier) => a + tier.panels.reduce((b: number, c) => b + ("tiers" in c ? count((c as { tiers: Tiers }).tiers) : 1), 0), 0)
}
const slots = (t: PageTemplate) => Array.from({ length: count(PAGE_TEMPLATES[t].page.tiers) }, (_, i) => i + 1)

const HAND = `<Page format="square">
  <Tier height={1.2} slant={6}>
    <Panel width={1.6} slant={-5} bleed>
      <Place x="8%" y="12%" anchor="top-left">
        <PanelCaption position="free">The night before.</PanelCaption>
      </Place>
    </Panel>
    <Panel shape="jagged">
      <Place x="50%" y="50%"><Sfx size="md">DOOM</Sfx></Place>
    </Panel>
  </Tier>
  <Tier>
    <Panel ink>
      <Place x="50%" y="40%" maxWidth="80%">
        <SpeechBubble variant="thought" pointAt={{ x: "50%", y: "95%" }}>Who's there?</SpeechBubble>
      </Place>
    </Panel>
    <Panel width={1.3} shape="cloud" />
  </Tier>
</Page>`

export function Preview() {
  const [template, setTemplate] = useState<PageTemplate>("big-plus-two")
  const [format, setFormat] = useState<PageFormat>("pocket")
  const [numbers, setNumbers] = useState(false)
  const [rtl, setRtl] = useState(false)
  const n = slots(template)
  const code = `import { Page, Panel, PanelArt, Place } from "@/components/manga/panel"
import { SpeechBubble } from "@/components/manga/speech-bubble"

<Page template="${template}" format="${format}"${rtl ? ` reading="rtl"` : ""}>
${n
  .map((i) =>
    i === 1
      ? `  <Panel>
    <PanelArt src="/bridge.webp" alt="An ink bridge across the clouds" />
    <Place x="70%" y="10%" anchor="top">
      <SpeechBubble pointAt={{ x: "30%", y: "80%" }}>Over here!</SpeechBubble>
    </Place>
  </Panel>`
      : `  <Panel>…</Panel>`,
  )
  .join("\n")}
</Page>`
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      <Playground
        preview={
          <div className={format === "strip" ? "w-full max-w-sm" : template === "spread" ? "w-full max-w-2xl" : "w-full max-w-md"}>
            <Page template={template} format={format} reading={rtl ? "rtl" : "ltr"} fold="never" label={`${PAGE_TEMPLATES[template].label} template`}>
              {n.map(filled(numbers))}
            </Page>
          </div>
        }
        controls={
          <>
            <Choice label="template" value={template} options={TEMPLATES} onChange={setTemplate} />
            <Choice label="format" value={format} options={FORMATS} onChange={setFormat} />
            <Flag label="read right to left" checked={rtl} onChange={setRtl} />
            <Flag label="show the reading order" checked={numbers} onChange={setNumbers} />
            <p className="text-sm">The numbers are the reading order: the order of the panels in the code.</p>
          </>
        }
        code={code}
      />
    </div>
  )
}

function ByHand() {
  return (
    <div className="flex w-full justify-center">
      <div className="grid w-full max-w-xl gap-3">
        <p className="max-w-prose text-sm">
          Tiers stack from top to bottom, panels share a tier by <code>width</code>, every cut can <code>slant</code>. Gutters between
          tiers are wider than between panels, as in print. Under 480px the page folds into a vertical strip, one panel per row.
        </p>
        <Page format="square">
          <Tier height={1.2} slant={6}>
            <Panel width={1.6} slant={-5} bleed>
              <Place x="8%" y="12%" anchor="top-left">
                <PanelCaption position="free">The night before.</PanelCaption>
              </Place>
            </Panel>
            <Panel shape="jagged">
              <Place x="50%" y="50%">
                <Sfx size="md">DOOM</Sfx>
              </Place>
            </Panel>
          </Tier>
          <Tier>
            <Panel ink>
              <Place x="50%" y="40%" maxWidth="80%">
                <SpeechBubble variant="thought" pointAt={{ x: "50%", y: "95%" }}>
                  Who's there?
                </SpeechBubble>
              </Place>
            </Panel>
            <Panel width={1.3} shape="cloud" />
          </Tier>
        </Page>
        <Code text={HAND} />
      </div>
    </div>
  )
}

function Templates() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-md">
        <Page template="l-shape" label="L-shape template">
          {slots("l-shape").map(numbered)}
        </Page>
      </div>
    </div>
  )
}

function AsData() {
  return (
    <div className="flex w-full justify-center">
      <div className="grid w-full max-w-xl gap-3">
        <p className="max-w-prose text-sm">
          The same page can be given as JSON with <code>{"<Page page={data} />"}</code>. The{" "}
          <a href={to("studio")} className="underline">
            page studio
          </a>{" "}
          edits this format and readers use its geometry to zoom panel by panel.
        </p>
        <Code text={PAGE_FORMAT_DOC} />
      </div>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "ByHand", title: "Written by hand", description: "Tiers, a slanted cut, a shaped panel and a bubble that aims: the whole page as JSX.", Component: ByHand },
  { fn: "Templates", title: "Ready-made template", description: "template picks a layout; the Panel children fill its cells in reading order.", Component: Templates },
  { fn: "AsData", title: "The page as data", description: "The same page as JSON, for the studio and for readers who zoom panel by panel.", Component: AsData },
]

const SHAPES: FrameShape[] = ["straight", "tilted", "jagged", "cloud", "memory"]

function Mini({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={wide ? "w-full max-w-56" : "w-28"}>{children}</div>
}

export function States() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <section aria-label="Frame shapes" className="grid gap-2">
        <h3 className="font-mono text-sm">shape</h3>
        <Tiles>
          {SHAPES.map((s) => (
            <Tile key={s} label={`shape · ${s}`}>
              <Mini>
                <Page format="square" fold="never" margin={10}>
                  <Panel shape={s} />
                </Page>
              </Mini>
            </Tile>
          ))}
        </Tiles>
      </section>
      <section aria-label="Panel options" className="grid gap-2">
        <h3 className="font-mono text-sm">options</h3>
        <Tiles>
          <Tile label="bleed">
            <Mini>
              <Page format="square" fold="never">
                <Tier>
                  <Panel bleed />
                </Tier>
                <Tier>
                  <Panel />
                  <Panel />
                </Tier>
              </Page>
            </Mini>
          </Tile>
          <Tile label="frameless">
            <Mini>
              <Page format="square" fold="never">
                <Tier>
                  <Panel frameless>
                    <Place x="50%" y="50%">
                      <Sfx size="sm">…</Sfx>
                    </Place>
                  </Panel>
                  <Panel />
                </Tier>
              </Page>
            </Mini>
          </Tile>
          <Tile label="inset">
            <Mini>
              <Page format="square" fold="never">
                <Panel />
                <Panel inset={{ x: 52, y: 8, w: 40, h: 40 }} />
              </Page>
            </Mini>
          </Tile>
          <Tile label="ink">
            <Mini>
              <Page format="square" fold="never">
                <Tier>
                  <Panel ink />
                  <Panel />
                </Tier>
              </Page>
            </Mini>
          </Tile>
          <Tile label="slant">
            <Mini>
              <Page format="square" fold="never">
                <Tier slant={10}>
                  <Panel slant={12} />
                  <Panel />
                </Tier>
                <Tier>
                  <Panel />
                </Tier>
              </Page>
            </Mini>
          </Tile>
          <Tile label="reading rtl">
            <Mini>
              <Page format="square" fold="never" reading="rtl">
                <Tier>
                  {numbered(1)}
                  {numbered(2)}
                </Tier>
                <Tier>
                  {numbered(3)}
                </Tier>
              </Page>
            </Mini>
          </Tile>
          <Tile label="folded (under 480px)">
            <Mini>
              <Page format="square" fold="always">
                <Tier>
                  {numbered(1)}
                  {numbered(2)}
                </Tier>
              </Page>
            </Mini>
          </Tile>
        </Tiles>
      </section>
      <section aria-label="Templates" className="grid gap-2">
        <h3 className="font-mono text-sm">template</h3>
        <Tiles>
          {TEMPLATES.map((t) => (
            <Tile key={t} label={`template · ${t}`}>
              <Mini wide={t === "spread"}>
                <Page template={t} fold="never" />
              </Mini>
            </Tile>
          ))}
        </Tiles>
      </section>
      <section aria-label="Formats" className="grid gap-2">
        <h3 className="font-mono text-sm">format</h3>
        <Tiles>
          {FORMATS.map((f) => (
            <Tile key={f} label={`format · ${f}`}>
              <Mini>
                <Page template="three-tiers" format={f} fold="never" />
              </Mini>
            </Tile>
          ))}
        </Tiles>
      </section>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-28">
      <Page template="diagonal" fold="never" label="Page thumbnail">
        {[1, 2, 3].map(filled(false))}
      </Page>
    </div>
  )
}

/** The Playground takes the whole width of the frame, its controls on the right. */
export const previewWide = true
