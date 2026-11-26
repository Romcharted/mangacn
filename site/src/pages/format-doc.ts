/** The page data format, as shown on the Panel page (and read by the studio and readers). */
export const PAGE_FORMAT_DOC = `// A page as data: the same structure as the JSX (<Page><Tier><Panel>).
// Pass it as <Page page={data} />. Lengths are page units: a page is 100 units wide (200 for a spread).
type PageData = {
  version?: 1
  format?: "pocket" | "magazine" | "square" | "strip" // strip: free height
  spread?: boolean            // double page, twice as wide
  reading?: "ltr" | "rtl"     // panel order; rtl lays panels out right to left
  gutter?: { x?: number; y?: number } // between panels (1.6) / between tiers (3.4)
  margin?: number             // page margin
  line?: number               // frame line width (0.55)
  lettering?: number          // scale of bubbles, captions, sound effects (1)
  tiers: TierData[]           // top to bottom
}
type TierData = {
  height?: number             // share of the page height (1); in a strip, 1 = half the width
  slant?: number              // cut below: the end side goes down this far, the start side up
  panels: (PanelData | ColumnData)[] // in reading order
}
type ColumnData = { width?: number; slant?: number; tiers: TierData[] } // tiers inside one cell
type PanelData = {
  width?: number              // share of the tier width (1)
  slant?: number              // cut after this panel: its top moves this far toward the end
  shape?: "straight" | "tilted" | "jagged" | "cloud" | "memory"
  tilt?: number               // degrees, for "tilted" (-2.5)
  bleed?: boolean             // sides on the page margin run off the page
  frameless?: boolean
  overflow?: boolean          // content may leave the frame
  ink?: boolean               // ink background, paper lines
  inset?: { x: number; y: number; w: number; h: number } // over the previous panel, in % of it
  label?: string              // accessible name ("Panel n")
  art?: { src: string; alt: string; x?: number; y?: number; zoom?: number
          toned?: boolean | { pattern?: "dots" | "lines" | "cross" | "noise"; density?: number } }
  items?: PageItem[]          // drawn over the panel, may cross the frame
}
// x, y: percent of the panel; anchor: which point of the item sits there ("center").
type PageItem =
  | { type: "bubble"; x: number; y: number; anchor?: Anchor; text: string
      variant?: "speech" | "thought" | "shout" | "whisper" | "narration" | "electronic" | "wobbly"
      pointAt?: { x: number; y: number } // the tail aims here (percent of the panel)
      maxWidth?: number; align?: "start" | "center" | "end"; seed?: number }
  | { type: "sfx"; x: number; y: number; anchor?: Anchor; text: string
      size?: "sm" | "md" | "lg" | "xl"; rotate?: number; variant?: "solid" | "outline"; label?: string }
  | { type: "caption"; x: number; y: number; anchor?: Anchor; text: string; maxWidth?: number }
type Anchor = "top-left" | "top" | "top-right" | "left" | "center" | "right"
            | "bottom-left" | "bottom" | "bottom-right"

// Geometry for readers (zoom panel by panel): pageGeometry(data).panels[i].rect is the panel's
// box in percent of the page, in reading order; <Page onGeometry={...}> reports the same.`
