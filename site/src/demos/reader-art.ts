/*
 * Demo pages for the reading pieces (PageReader, PageThumbnails, GuidedView…): the first chapter of "Mapless",
 * the showcase's AI-generated series (see ../mapless.tsx): the cover of volume 1, the bridge page, the lighthouse page.
 */
import { ALT, artPage, artSrc, type ArtName } from "../mapless"

export type DemoPage = { src: string; alt: string; width: number; height: number }

/** A panel's box in percent of its page (0–100), measured by hand on the image. GuidedView reads it. */
export type DemoPanel = { x: number; y: number; w: number; h: number; alt: string }

export type DemoChapterPage = DemoPage & { panels: DemoPanel[] }

const P = (x: number, y: number, w: number, h: number, alt: string): DemoPanel => ({ x, y, w, h, alt })

const PANELS: Record<"cover-1" | "page-1-bridge" | "page-2-lighthouse", DemoPanel[]> = {
  "cover-1": [P(0, 0, 100, 100, "Cover of volume 1: Suzu and Kuro above the clouds")],
  "page-1-bridge": [
    P(0, 0, 100, 30.8, "Suzu sets foot on the ink bridge; the Eraser waits on the far cliff"),
    P(5.6, 32.5, 44, 30, "The Eraser, spear in hand"),
    P(50.6, 32.5, 42.7, 27.1, "Suzu startled, Kuro rearing behind her"),
    P(6.7, 58, 86.6, 37.3, "Suzu leaps as the spear smashes the bridge"),
    P(72, 80.2, 23.6, 16.7, "A drop of ink falls"),
  ],
  "page-2-lighthouse": [
    P(0, 0, 100, 31, "A lighthouse on a floating island, at night"),
    P(5.6, 32.5, 38.2, 35.6, "Suzu inks a map by the fire"),
    P(44.9, 32.5, 25.5, 33.1, "Kuro asleep on the bags"),
    P(71.3, 32.5, 23.4, 31.7, "The map"),
    P(5.6, 63.7, 94.4, 36.3, "Suzu looks up: the Eraser on a far cliff"),
  ],
}

/** The demo chapter: cover of volume 1, the bridge page, the lighthouse page. */
export function chapterPages(): DemoChapterPage[] {
  return (Object.keys(PANELS) as (keyof typeof PANELS)[]).map((name) => ({ ...artPage(name), panels: PANELS[name] }))
}

/** The cover of a volume: 1 and 2 are out, 3 is a crop shown as "coming soon". */
export function coverUrl(volume: 1 | 2 | 3, width = 160) {
  return artSrc(volume === 1 ? "cover-1" : volume === 2 ? "cover-2" : "cover-3-teaser", width)
}

export type Scene = Exclude<ArtName, "cover-1" | "cover-2" | "page-1-bridge" | "page-2-lighthouse" | "suzu-portrait">

/** A crop for one panel of a page-model page (PanelArt frames it). */
export function sceneUrl(scene: Scene, width = 320) {
  return artSrc(scene, width)
}

export const sceneAlt = (scene: Scene) => ALT[scene]
