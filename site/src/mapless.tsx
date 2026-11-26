/*
 * "Mapless", the showcase's demo series: five AI-generated images (two covers, two pages, a portrait) and crops
 * of them, built by scripts/art-images.py into public/art/<name>-<width>.webp. Credits: public/art/CREDITS.md.
 * Characters: Suzu (an apprentice cartographer), Kuro (an ink dragon), the Eraser (a white knight).
 * The registry items ship no image: blocks and pieces take picture URLs as props, the site passes these.
 */
import type { ImgHTMLAttributes } from "react"
import sizes from "./mapless-art.json"

export type ArtName = keyof typeof sizes

export const SERIES = "Mapless"
export const AUTHOR = "Studio Mapless"

/** Spoken description of each picture. */
export const ALT: Record<ArtName, string> = {
  "suzu-portrait": "Suzu laughs, holding up a hand-drawn map, Kuro curled on her head",
  "cover-1": "Suzu on a cliff edge above the clouds, a giant brush in hand, Kuro coiled over her shoulders",
  "cover-2": "The Eraser, a white knight, stands above the clouds leaning on his spear",
  "page-1-bridge":
    "Page: Suzu crosses an ink bridge toward the Eraser; he waits on the far cliff; Kuro rears behind her; his spear breaks the bridge; a drop of ink falls",
  "page-2-lighthouse":
    "Page: a lighthouse on a floating island at night; Suzu draws a map by the fire; Kuro sleeps on the bags; the map; Suzu looks up and sees the Eraser on a far cliff",
  "lighthouse-night": "A ruined lighthouse on a floating island at night, a small fire at its foot",
  "suzu-drawing": "Suzu sits by the fire and inks a map, her goggles on",
  "kuro-sleeping": "Kuro, the ink dragon, asleep in a ball on the travel bags",
  "suzu-profile": "Suzu in profile, gripping her brush, looking into the night",
  "cover-3-teaser": "Far away on a cliff, a white knight stands under the stars",
  "bridge-far": "An ink bridge across the clouds, Suzu at one end, a knight at the other",
  "spear-clash": "Suzu leaps with her brush as the Eraser's spear smashes the ink bridge",
  "ink-drop": "A single drop of ink falls",
  "suzu-shock": "Suzu startled behind her goggles, Kuro rearing at her back",
  "eraser-panel": "The Eraser in full armour on the cliff, spear in hand",
  map: "A hand-drawn map of floating islands, held in both hands",
  "suzu-face": "Suzu's face, laughing, goggles pushed up",
  "suzu-full": "Suzu standing on a cliff with her giant brush, Kuro over her shoulders",
  kuro: "Kuro, the ink dragon, with round white eyes",
  "eraser-full": "The Eraser standing, both hands on his spear",
  "eraser-helmet": "The Eraser's helmet and shoulders",
}

const BASE = import.meta.env.BASE_URL

/** URL of a picture at the smallest stored width of at least `width` css pixels at 2x (or the largest one). */
export function artSrc(name: ArtName, width = 240) {
  const { widths } = sizes[name]
  const w = widths.find((x) => x >= width * 2) ?? widths[widths.length - 1]
  return `${BASE}art/${name}-${w}.webp`
}

/** `srcset` of a picture: every stored width. */
export function artSrcSet(name: ArtName) {
  return sizes[name].widths.map((w) => `${BASE}art/${name}-${w}.webp ${w}w`).join(", ")
}

/** Width / height of a picture. */
export const artRatio = (name: ArtName) => sizes[name].width / sizes[name].height

/** A page of the demo chapter, for the readers: image, size and spoken description. */
export function artPage(name: ArtName) {
  // the real-size file, with the smaller ones in srcSet: a page is never shown larger than its picture
  const { width, height, widths } = sizes[name]
  return { src: artSrc(name, widths[widths.length - 1]), srcSet: artSrcSet(name), alt: ALT[name], width, height }
}

type ArtProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  name: ArtName
  /** Width the picture is shown at, for `sizes` (css length). */
  shown?: string
}

/** A picture of the series: responsive, lazy, with its size so the page does not jump. */
export function Art({ name, shown = "50vw", alt, loading = "lazy", ...props }: ArtProps) {
  const { width, height } = sizes[name]
  return (
    <img
      src={artSrc(name)}
      srcSet={artSrcSet(name)}
      sizes={shown}
      width={width}
      height={height}
      alt={alt ?? ALT[name]}
      loading={loading}
      decoding="async"
      draggable={false}
      {...props}
    />
  )
}

/** Where the title sits on each cover: in its sky, clear of the figures and below a card's "Vol." badge. */
const COVER_TITLE = {
  1: { name: "cover-1", place: "inset-x-0 top-[max(12%,2.1rem)] text-center text-[14cqi]", night: false },
  2: { name: "cover-2", place: "inset-x-0 top-[max(12%,2.1rem)] text-center text-[14cqi]", night: false },
  3: { name: "cover-3-teaser", place: "end-[4%] top-[3%] text-end text-[11cqi]", night: true },
} as const

/**
 * A volume's cover: the picture, untouched, and the series title lettered over its sky in the kit's lettering, as
 * real text (it can be read and translated). The cover is printed matter: ink and paper keep their colours in
 * both themes; the night cover takes paper letters with an ink knockout.
 */
export function VolumeCover({ volume, title = SERIES, shown = "18rem" }: { volume: 1 | 2 | 3; title?: string; shown?: string }) {
  const { name, place, night } = COVER_TITLE[volume]
  return (
    <span className="@container relative block size-full overflow-hidden">
      <Art name={name} alt="" shown={shown} className="absolute inset-0 size-full object-cover" />
      <span
        aria-hidden
        className={`absolute ${place} font-letter leading-none tracking-wider uppercase knockout ${
          night ? "text-[#f8f5ee] [--tone-paper:#1f1b17]" : "text-[#1f1b17] [--tone-paper:#f8f5ee]"
        }`}
      >
        {title}
      </span>
    </span>
  )
}
