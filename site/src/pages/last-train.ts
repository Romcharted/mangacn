import type { PageData } from "@registry/manga/signature/page-geometry"

/*
 * "Last train": a page made of freely licensed photos, toned live (credits in public/pages/photos/CREDITS.md).
 * Written as data (PageData), the same structure as the JSX: what the page studio loads and saves.
 */

const img = (name: string) => `${import.meta.env.BASE_URL}pages/photos/${name}.jpg`

export const LAST_TRAIN: PageData = {
  version: 1,
  format: "pocket",
  tiers: [
    {
      height: 1.15,
      panels: [
        {
          bleed: true,
          label: "Rooftops and water tanks under a heavy sky",
          art: { src: img("rooftops"), alt: "City rooftops with wooden water tanks under a cloudy sky", x: 50, y: 60, zoom: 1.1, toned: { pattern: "dots" } },
          items: [
            { type: "caption", x: 4, y: 6, anchor: "top-left", text: "Friday, 11:52 p.m." },
            { type: "caption", x: 96, y: 92, anchor: "bottom-right", text: "Eight minutes to the last train." },
          ],
        },
      ],
    },
    {
      slant: -5,
      panels: [
        {
          width: 0.8,
          slant: 5,
          label: "A utility pole hums",
          art: { src: img("pole"), alt: "A wooden utility pole with a transformer and power lines", x: 45, y: 30, zoom: 1.4, toned: { pattern: "lines" } },
          items: [{ type: "sfx", x: 70, y: 70, text: "BZZZ", size: "md", rotate: -12, variant: "outline" }],
        },
        {
          width: 1.3,
          label: "An empty street in the rain",
          art: { src: img("rain-street"), alt: "A wet street at night, lamps reflected on the pavement", x: 40, y: 55, toned: { pattern: "dots" } },
          items: [
            {
              type: "bubble",
              variant: "electronic",
              x: 62,
              y: 8,
              anchor: "top",
              maxWidth: 62,
              text: "Where are you? It leaves at midnight!",
              pointAt: { x: 96, y: 96 },
            },
            { type: "sfx", x: 22, y: 82, text: "ザー", size: "sm", rotate: 6 },
          ],
        },
      ],
    },
    {
      height: 1.05,
      slant: 6,
      panels: [
        {
          width: 0.9,
          shape: "cloud",
          label: "Rain on the glass",
          art: { src: img("raindrops"), alt: "Raindrops on a window pane", zoom: 1.6, x: 40, y: 40, toned: { pattern: "noise" } },
          items: [{ type: "bubble", variant: "whisper", x: 50, y: 50, text: "Almost there…" }],
        },
        {
          width: 1.4,
          label: "The empty platform",
          art: { src: img("platform"), alt: "An empty railway platform under an iron canopy", x: 55, y: 60, toned: { pattern: "dots" } },
          items: [
            { type: "bubble", variant: "shout", x: 30, y: 6, anchor: "top", maxWidth: 52, text: "Wait!", pointAt: { x: 4, y: 96 } },
            { type: "sfx", x: 78, y: 86, text: "TA TA TA", size: "sm", rotate: -6 },
          ],
        },
      ],
    },
    {
      height: 1.25,
      panels: [
        {
          label: "Inside the last train",
          art: { src: img("train"), alt: "The inside of an empty train carriage, rows of seats", x: 50, y: 45, toned: { pattern: "lines" } },
          items: [
            { type: "bubble", variant: "electronic", x: 50, y: 6, anchor: "top", maxWidth: 46, text: "Doors closing.", pointAt: { x: 50, y: 32 } },
            { type: "bubble", variant: "thought", x: 22, y: 64, maxWidth: 34, text: "Made it." },
            { type: "sfx", x: 34, y: 90, text: "PSSHH", size: "md", rotate: -8 },
          ],
        },
        { inset: { x: 64, y: 54, w: 32, h: 40 }, shape: "jagged", label: "The doors slam shut", items: [{ type: "sfx", x: 50, y: 50, text: "BAM", size: "lg", rotate: -10 }] },
      ],
    },
  ],
}
