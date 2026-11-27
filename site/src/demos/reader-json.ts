import type { PageData } from "@registry/manga/signature/page-geometry"
import { sceneAlt, sceneUrl, type Scene } from "./reader-art"

/*
 * "Mapless", chapter 1 retold as page data (PageData) from crops of the series' pages: the page model draws it
 * (panels, real lettering), PageReader turns its pages and GuidedView zooms from panel to panel with its geometry.
 */

const art = (scene: Scene, extra: { x?: number; y?: number; zoom?: number } = {}) => ({ src: sceneUrl(scene), alt: sceneAlt(scene), ...extra })

export const JSON_CHAPTER: PageData[] = [
  {
    version: 1,
    format: "pocket",
    tiers: [
      {
        height: 0.9,
        panels: [
          {
            bleed: true,
            label: "The ink bridge across the clouds",
            art: art("bridge-far"),
            items: [{ type: "caption", x: 4, y: 6, anchor: "top-left", text: "Day 41. No map shows this bridge." }],
          },
        ],
      },
      {
        slant: -4,
        panels: [
          {
            width: 1.1,
            label: "The Eraser waits",
            art: art("eraser-panel", { y: 30 }),
            items: [{ type: "bubble", x: 72, y: 10, text: "Nothing new gets drawn here.", pointAt: { x: 46, y: 26 }, maxWidth: 52 }],
          },
          {
            label: "Suzu calls Kuro back",
            art: art("suzu-face"),
            items: [{ type: "bubble", x: 30, y: 12, text: "Kuro, back!", variant: "shout", pointAt: { x: 60, y: 46 }, maxWidth: 55 }],
          },
        ],
      },
      {
        panels: [
          {
            label: "The Eraser raises his spear",
            art: art("eraser-full", { y: 25 }),
          },
          {
            label: "The spear smashes the bridge",
            art: art("spear-clash", { y: 70 }),
            items: [{ type: "sfx", x: 70, y: 30, text: "KRAK", size: "md", rotate: -8 }],
          },
        ],
      },
    ],
  },
  {
    version: 1,
    format: "pocket",
    tiers: [
      {
        panels: [
          {
            width: 1.3,
            label: "Suzu inks a map by the fire",
            art: art("suzu-drawing", { y: 40 }),
            items: [{ type: "bubble", x: 68, y: 12, text: "Then I'll draw us another one.", pointAt: { x: 40, y: 30 }, maxWidth: 55 }],
          },
          { label: "Kuro asleep", shape: "tilted", art: art("kuro-sleeping", { y: 45 }) },
        ],
      },
      {
        height: 1.4,
        panels: [
          {
            shape: "jagged",
            label: "The lighthouse at night",
            art: art("lighthouse-night"),
            items: [{ type: "sfx", x: 20, y: 22, text: "CRACKLE", size: "md", rotate: -10 }],
          },
        ],
      },
      {
        panels: [
          { label: "The map", art: art("map") },
          {
            width: 1.2,
            ink: true,
            label: "Suzu looks into the night",
            art: art("suzu-profile", { y: 30 }),
            items: [{ type: "caption", x: 94, y: 90, anchor: "bottom-right", text: "He was still out there." }],
          },
        ],
      },
    ],
  },
  {
    version: 1,
    format: "pocket",
    tiers: [
      {
        height: 2,
        panels: [
          {
            bleed: true,
            label: "The knight on the far cliff",
            art: art("cover-3-teaser", { y: 30 }),
            items: [{ type: "caption", x: 50, y: 8, anchor: "top", text: "Somewhere past the edge of every map…" }],
          },
        ],
      },
      {
        panels: [
          {
            label: "Suzu",
            art: art("suzu-face", { zoom: 1.2 }),
            items: [{ type: "bubble", x: 50, y: 14, text: "Next time I draw faster!", variant: "shout", pointAt: { x: 50, y: 70 }, maxWidth: 80 }],
          },
          { label: "A drop of ink", art: art("ink-drop") },
        ],
      },
    ],
  },
]
