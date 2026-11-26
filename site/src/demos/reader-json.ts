import type { PageData } from "@registry/manga/signature/page-geometry"
import { sceneUrl, type Scene } from "./reader-art"

/*
 * "Lantern Street", chapter 5, written as page data (PageData): the page model draws it (panels, real
 * lettering), PageReader turns its pages and GuidedView zooms from panel to panel with its geometry.
 */

const art = (scene: Scene, alt: string, seed = 5, extra: { x?: number; y?: number; zoom?: number } = {}) => ({ src: sceneUrl(scene, seed), alt, ...extra })

export const JSON_CHAPTER: PageData[] = [
  {
    version: 1,
    format: "pocket",
    tiers: [
      {
        height: 1.2,
        panels: [
          {
            bleed: true,
            label: "Rooftops under the moon",
            art: art("roofs", "Rooftops under a round moon"),
            items: [{ type: "caption", x: 4, y: 6, anchor: "top-left", text: "The night market, second evening." }],
          },
        ],
      },
      {
        slant: -4,
        panels: [
          { width: 1.2, label: "Lanterns along the street", art: art("lanterns", "Paper lanterns hanging in a row") },
          {
            label: "Mio looks up",
            art: art("face", "A girl looks up, surrounded by focus lines", 6, { zoom: 1.2 }),
            items: [{ type: "bubble", x: 50, y: 14, text: "One of them is moving.", pointAt: { x: 50, y: 60 }, maxWidth: 80 }],
          },
        ],
      },
      {
        panels: [
          {
            label: "The crowd in the rain",
            art: art("crowd", "Figures seen from behind in the rain"),
            items: [{ type: "sfx", x: 78, y: 60, text: "SHHH", size: "md", rotate: -8 }],
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
            label: "The keeper speaks",
            art: art("faces", "Two people face each other"),
            items: [
              { type: "bubble", x: 30, y: 16, text: "That one has no wish in it.", pointAt: { x: 22, y: 62 }, maxWidth: 55 },
              { type: "bubble", x: 76, y: 22, text: "Then whose is it?", variant: "thought", pointAt: { x: 80, y: 60 }, maxWidth: 40 },
            ],
          },
          { label: "A hand reaches out", shape: "tilted", art: art("hand", "A hand reaches out through speed lines") },
        ],
      },
      {
        height: 1.4,
        panels: [
          {
            shape: "jagged",
            label: "The lantern bursts into light",
            art: art("burst", "A lantern glows at the centre of concentration lines", 7),
            items: [{ type: "sfx", x: 20, y: 22, text: "FWOOM", size: "lg", rotate: -10 }],
          },
        ],
      },
      {
        panels: [
          { label: "Rain on the street", art: art("rain", "Rain falls on a figure alone") },
          {
            width: 1.2,
            ink: true,
            label: "Walking home",
            art: art("home", "A figure walks home under one lantern"),
            items: [{ type: "caption", x: 94, y: 90, anchor: "bottom-right", text: "To be continued." }],
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
            label: "The lanterns rise together",
            art: art("rise", "Lanterns rise over the rooftops"),
            items: [{ type: "caption", x: 50, y: 8, anchor: "top", text: "Every lantern went up at once." }],
          },
        ],
      },
      {
        panels: [
          { label: "Mio", art: art("face", "Mio, wide-eyed", 9, { zoom: 1.4 }), items: [{ type: "bubble", x: 50, y: 18, text: "Wait!", variant: "shout", pointAt: { x: 50, y: 70 } }] },
          { label: "Gone", art: art("roofs", "Empty rooftops", 3) },
        ],
      },
    ],
  },
]
