import type { PageData } from "@registry/manga/signature/page-geometry"

/*
 * A page from a public-domain comic: "Little Nemo in Slumberland", 27 May 1906, by Winsor McCay
 * (credits in public/pages/nemo/CREDITS.md). Each panel is cut from the scan; the dialogue is lettered
 * again as real text, over the original balloons, with tails aimed at the speakers.
 */

const img = (name: string) => `${import.meta.env.BASE_URL}pages/nemo/nemo-${name}.jpg`

export const NEMO_CREDIT = {
  title: "Little Nemo in Slumberland",
  date: "27 May 1906",
  author: "Winsor McCay",
  license: "Public domain",
  source: "https://commons.wikimedia.org/wiki/File:Little_Nemo_1906-05-27.jpg",
}

export const NEMO: PageData = {
  version: 1,
  format: "magazine",
  lettering: 0.62,
  gutter: { x: 1.4, y: 2.2 },
  margin: 4,
  tiers: [
    {
      height: 0.5,
      panels: [
        {
          label: "Title: Little Nemo in Slumberland",
          art: {
            src: img("title"),
            alt: "Title banner, Little Nemo in Slumberland. The Moon says: Pshaw!! That's mean! A courtier reads: Your Majesty! Little Nemo simply can not get used to Slumberland. He awoke tonight just as he approached the fourth gate. We hope to make great progress with him from now on. However, sorrowfully yours!",
          },
        },
      ],
    },
    {
      panels: [
        {
          label: "Panel 1",
          art: { src: img("1"), alt: "Nemo, a giant now, sits on a wall while little men tie his sandals; a jester stands on a ladder." },
          items: [
            { type: "bubble", x: 22, y: 11, maxWidth: 49, text: "Now, Nemo, you will soon be ready to start for the fourth gate. Aren't you happy?", pointAt: { x: 12, y: 40 } },
            { type: "bubble", x: 84, y: 22, maxWidth: 42, text: "Yes. But why must I be turned into a giant? Have I got to fight a battle with some one to get in?", pointAt: { x: 60, y: 30 } },
          ],
        },
        {
          label: "Panel 2",
          art: { src: img("2"), alt: "Giant Nemo, dressed in a leopard skin, sits while the little men bring him a sword." },
          items: [
            { type: "bubble", x: 78, y: 12, maxWidth: 55, text: "No. The fourth gate is guarded by big giants. Brainless fellows who must be approached very cautiously.", pointAt: { x: 84, y: 36 } },
          ],
        },
        {
          label: "Panel 3",
          art: { src: img("3"), alt: "Nemo bends down to say goodbye to the jester; the little men wave." },
          items: [
            { type: "bubble", x: 100, y: 21, anchor: "top-right", maxWidth: 56, text: "Well, good-bye! You have done splendidly. Good bye! To you all!", pointAt: { x: 66, y: 12 } },
            { type: "bubble", x: 100, y: 47, anchor: "top-right", maxWidth: 48, text: "Success to you! Best wishes, Nemo!", pointAt: { x: 88, y: 80 } },
            { type: "bubble", x: 3, y: 70, anchor: "top-left", maxWidth: 36, text: "Ta ta! Nemo! Ta-ta!", pointAt: { x: 72, y: 84 } },
          ],
        },
      ],
    },
    {
      panels: [
        {
          label: "Panel 4",
          art: { src: img("4"), alt: "Nemo walks past a palace, a sword in his hand, the little men at his feet." },
          items: [
            { type: "bubble", x: 22, y: 9, maxWidth: 49, text: "Then I don't have to fight, do I? Are these giants cross? Mean, I mean.", pointAt: { x: 45, y: 10 } },
            { type: "bubble", x: 84, y: 16, maxWidth: 42, text: "No. If they see you are a giant they will be more apt to be very kind. Are you afraid?", pointAt: { x: 62, y: 32 } },
          ],
        },
        {
          label: "Panel 5",
          art: { src: img("5"), alt: "Nemo strides over a domed hall and a canal with gondolas." },
          items: [
            { type: "bubble", x: 25, y: 11, maxWidth: 52, text: "No, I'm not afraid. I feel like I could lick a hundred giants. Naw! I'm not afraid of anybody.", pointAt: { x: 52, y: 14 } },
            { type: "bubble", x: 84, y: 12, maxWidth: 42, text: "That's just why you have been changed into a giant, so you will be brave.", pointAt: { x: 73, y: 38 } },
          ],
        },
        {
          label: "Panel 6",
          art: { src: img("6"), alt: "Nemo walks into a forest of tall trees; a white wolf and a leopard watch him." },
          items: [
            { type: "bubble", x: 20, y: 11, maxWidth: 49, text: "When we pass through this forest we shall come to the land's end and the fourth gate. Now, don't wake up.", pointAt: { x: 56, y: 22 } },
          ],
        },
      ],
    },
    {
      panels: [
        {
          label: "Panel 7",
          // folded on a phone, the panorama becomes a tall panel: the giants talk at the top, the herald below
          foldRatio: 0.78,
          art: { src: img("7"), alt: "By the sea, Nemo faces four huge sleeping giants holding clubs; a tiny herald speaks for him." },
          items: [
            {
              type: "bubble",
              x: 37,
              y: 32,
              maxWidth: 26,
              text: "Guards of the fourth gate! In the name of her most gracious majesty the Princess of Slumberland, I command you to arise! And allow to pass her new playmate, Little Nemo.",
              pointAt: { x: 37, y: 86 },
              fold: { x: 0, y: 24, anchor: "top-left", maxWidth: 49 },
            },
            {
              type: "bubble",
              x: 60,
              y: 11,
              maxWidth: 18,
              text: "Little Nemo, he looks quite husky to me.",
              pointAt: { x: 66, y: 22 },
              fold: { x: 0, y: 1, anchor: "top-left", maxWidth: 49, pointAt: { x: 55, y: 30 } },
            },
            {
              type: "bubble",
              x: 78,
              y: 9,
              maxWidth: 16,
              text: "You mean big Nemo, don't you?",
              pointAt: { x: 80, y: 18 },
              fold: { x: 100, y: 1, anchor: "top-right", maxWidth: 49, pointAt: { x: 80, y: 30 } },
            },
          ],
        },
        {
          inset: { x: 77, y: 37, w: 22.5, h: 61 },
          label: "Panel 8",
          art: { src: img("8"), alt: "Nemo, awake and small again, stands by his bed in a nightgown." },
          items: [{ type: "bubble", x: 60, y: 16, maxWidth: 64, text: "Quit prowling around in there, Nemo. You hear? And go to sleep!", pointAt: { x: 99, y: 34 } }],
        },
      ],
    },
  ],
}
