/*
 * The pictures the showcase passes to the blocks: "Mapless", its demo series (AI-generated, see
 * public/art/CREDITS.md). The blocks ship no image; each takes its pictures as props. Volume covers get the
 * series title lettered over their sky (VolumeCover).
 */
import type { ReactNode } from "react"
import type { AuthPictures } from "@registry/manga/blocks/sign-in/sign-in"
import type { AuthorSiteArt } from "@registry/manga/blocks/author-site/author-site"
import type { CatalogCover } from "@registry/manga/blocks/catalog/catalog"
import type { MangaReaderArt } from "@registry/manga/blocks/manga-reader/manga-reader"
import type { PortfolioArt } from "@registry/manga/blocks/portfolio/portfolio"
import type { StoryLandingArt } from "@registry/manga/blocks/story-landing/story-landing"
import { VolumeCover, artPage, artSrc, type ArtName } from "./mapless"

const panel = (name: ArtName) => artSrc(name, 360)

export const AUTH_PICTURES: Record<"sign-in" | "sign-up" | "forgot-password" | "verify-code" | "reset-password", AuthPictures> = {
  "sign-in": { idle: panel("suzu-portrait"), error: panel("suzu-shock"), done: panel("suzu-face") },
  "sign-up": { idle: panel("suzu-full"), error: panel("suzu-shock"), done: panel("suzu-face") },
  "forgot-password": { idle: panel("suzu-profile"), error: panel("suzu-shock"), done: panel("suzu-face") },
  "verify-code": { idle: panel("suzu-drawing"), error: panel("suzu-shock"), done: panel("suzu-face") },
  "reset-password": { idle: panel("map"), error: panel("suzu-shock"), done: panel("suzu-face") },
}

const CATALOG_COVERS: Record<CatalogCover, ReactNode> = {
  "mapless-1": <VolumeCover volume={1} />,
  "mapless-2": <VolumeCover volume={2} />,
  "mapless-3": <VolumeCover volume={3} />,
  "side-stories-1": artSrc("suzu-drawing", 160),
  "kuro-notebook-1": artSrc("kuro-sleeping", 160),
  "sketchbook-1": artSrc("eraser-full", 160),
}

const AUTHOR_ART: AuthorSiteArt = {
  covers: { 1: <VolumeCover volume={1} />, 2: <VolumeCover volume={2} />, 3: <VolumeCover volume={3} /> },
  scenes: {
    opening: panel("bridge-far"),
    rival: panel("eraser-panel"),
    hero: panel("suzu-shock"),
    detail: panel("map"),
    clash: panel("spear-clash"),
    pet: panel("kuro-sleeping"),
    night: panel("lighthouse-night"),
    ending: panel("suzu-profile"),
  },
}

const READER_ART: MangaReaderArt = {
  cover: <VolumeCover volume={2} />,
  pages: (["bridge-far", "eraser-panel", "suzu-shock", "spear-clash", "ink-drop", "lighthouse-night", "suzu-drawing", "kuro-sleeping", "map", "suzu-profile", "cover-3-teaser"] as const).map(
    (name) => artPage(name),
  ),
}

const STORY_ART: StoryLandingArt = {
  cover: artSrc("suzu-portrait", 360),
  guide: artSrc("suzu-face", 96),
  reader: artSrc("kuro", 96),
}

const PORTFOLIO_ART: PortfolioArt = {
  projects: { inkpot: panel("bridge-far"), ledger: panel("page-2-lighthouse"), tonelab: panel("lighthouse-night"), market: panel("map") },
}

/** Props a block gets on the showcase, by slug. */
export const BLOCK_PROPS: Record<string, Record<string, unknown>> = {
  ...Object.fromEntries(Object.entries(AUTH_PICTURES).map(([slug, pictures]) => [slug, { pictures }])),
  catalog: { covers: CATALOG_COVERS },
  "author-site": { art: AUTHOR_ART },
  "manga-reader": { art: READER_ART },
  "story-landing": { art: STORY_ART },
  "landing-page": { cover: <VolumeCover volume={1} /> },
  portfolio: { art: PORTFOLIO_ART },
}
