# AGENTS.md — working on mangacn

mangacn is a shadcn/ui registry served straight from this GitHub repository. It **dresses** shadcn
components in a manga style; it never rewrites them. Read this file before changing anything.

## Ground rules

- Everything in the repo is in English: code, names, docs, showcase copy, registry descriptions.
- 100 % frontend: props in, callbacks out. No backend, database, account, analytics or paid service.
- Nothing copied: no character, logo, title, page or brand colour from an existing work or platform.
  Demo art is abstract shapes or silhouettes drawn in SVG for this repo.
- `registry.json` is the single source of truth. The showcase, `llms.txt` and `r/*.json` are generated from it.

## Layout

```
registry.json                 # source of truth (items, descriptions, docs, meta.tagline/usage/props)
registry/manga/base/          # mangacn.css -> synced into the `base` item (tokens, utilities, the grammar)
registry/manga/lib/           # gestures.tsx: the JavaScript half of the grammar (impact, focus flash)
registry/manga/ui/            # restyled shadcn components (thin wrappers)
registry/manga/signature/     # manga components (SpeechBubble, Screentone, ...)
registry/manga/webtoon/       # webtoon components (drawn in ink)
registry/manga/blocks/        # demo blocks
site/                         # one-page showcase (Vite + React 19 + Tailwind v4), gallery + detail by #hash
site/src/demos/<item>.tsx     # optional Preview, States (frozen tiles) and Thumb (gallery card) exports
scripts/                      # sync-base, llms.txt, screenshots
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Showcase dev server |
| `npm run sync` | `mangacn.css` -> `base` item, then `site/public/llms.txt` |
| `npm run typecheck` | `tsc` |
| `npm run build` | sync + typecheck + site build + `shadcn build` into `site/dist/r` |
| `npm run shots` | Screenshots at 375/800/1280/1440 px, light and dark, 100 % (`-- --only button`); reports horizontal overflow |

Never edit the `css` / `cssVars` of the `base` item by hand: edit `registry/manga/base/mangacn.css`
and run `npm run sync`.

## Adding a restyled shadcn component

1. Install the stock component in the showcase: `npx shadcn@latest add <name>` (lands in `site/src/components/ui`).
2. Write `registry/manga/ui/<name>.tsx`: import from `@/components/ui/<name>`, add classes and `data-*`
   attributes, re-export the same API. Do not use props that only exist in Radix or only in Base UI.
3. Add the item to `registry.json` (`title`, `description` for AIs, `meta.tagline` for humans: one short
   sentence, `categories`, `registryDependencies: ["<name>", "Romcharted/mangacn/base"]`, `dependencies: ["cn"]`,
   `files` with `target: "@ui/manga/<name>.tsx"`, `docs`, `meta.usage`, `meta.props`).
   A bare name (`button`) is the official shadcn item. An item from this repo is always `Romcharted/mangacn/<item>`.
4. Add `site/src/demos/<name>.tsx` exporting `Preview` (live), `States` (labelled tiles, every variant × state,
   frozen) and `Thumb` (small, non-interactive gallery preview).
5. `npm run build && npm run shots -- --only <view>`, look at the screenshots in light and dark, then commit
   (one commit per component).

Categories (first one decides the showcase section): `foundations`, `actions`, `feedback`, `overlays`,
`navigation`, `display`, `manga`, `webtoon`, `blocks`.

### Wrapper pitfalls (learned the hard way)

- **Write every class literally.** Tailwind scans source text: `${prefix}:rounded-none` is never generated.
- **Cover both libraries' state hooks.** Prefer ARIA (`aria-checked`, `aria-selected`, `aria-invalid`,
  `aria-disabled`), which Radix and Base UI both set. Base UI marks disabled tabs with `aria-disabled`, and
  stock shadcn fades it with `aria-disabled:opacity-50`: always add `aria-disabled:opacity-100`.
- **Stock classes keep their opacity, blur and sizes.** Override every `/50`, `opacity-50`, `ring-*/50`,
  `backdrop-blur`, `animate-in fade-*`, and stock size classes (use `!` when they are more specific).
- **Corners follow `--radius`** (`rounded-(--radius)`), never `rounded-none`.
- **Shapes that clip** (`shape-burst`, `edge-jagged`) go on a `::before` fill, so the focus ring is not clipped.
  A burst's focus ring is a larger burst with a paper gap.
- **`tone-shadow` uses `::after`.** Do not use it where the library owns the pseudo-elements (Sonner toasts
  use an offset second frame instead).
- **Overlays** (dialog, sheet, drawer) get their light screentone veil from base; never style them per component.
- **Static twins for overlays**: export a static look-alike (`ToastCard`, `TooltipBubble`) sharing the same
  classes, so state grids can show frozen overlays.
- **shadcn's own data-* variants:** `data-selected:`, `data-open:` and friends are redefined by
  `shadcn/tailwind.css` (e.g. `data-selected` = `[data-selected="true"]`). Base UI sets empty attributes
  (`data-selected=""`), so use the arbitrary form `data-[selected]:`.
- **`!important` beats animations.** A colour set with `bg-x!` cannot be animated; `fill-in` paints with
  background layers and `-webkit-text-fill-color` so it still works over important colours.
- **Next.js:** files with hooks or event handlers start with `"use client"`. Next templates set
  `--font-sans` (Geist) on `<html>`, so base sets the body font from `--font-manga-body` directly.
- **Showcase only:** `data-force="hover|focus|active"` freezes a state in the tiles (see `vite.config.ts`).

## Grammar — eight gestures

A component never draws its own hover, selection or entrance: it applies a gesture. Each gesture is a
utility in `base` or a small primitive in `gestures`. Cadence: 12 frames per second (83 ms a frame); a
gesture lasts 2 to 4 frames (166–333 ms), always in `steps()`. With `prefers-reduced-motion` nothing
moves and every state stays distinct (hidden effects such as lines start `invisible`).
The showcase has a Grammar page (`#grammar`) that replays each one.

| # | Gesture | When | How |
| --- | --- | --- | --- |
| G1 | Case | Every container: card, panel, window, list, field | `ink-case` (paper, 3px ink line, tone shadow; needs a positioned element). Inside a case: `ink-case-inner` (2px, no shadow) |
| G2 | Flat | Selected, checked, active, current | `ink-fill` + `fill-in` (sweeps in over three frames in the reading direction). Bars: `animate-bar-in` |
| G3 | Hover | Every interactive element | Framed: `hover-lift` (tone shadow appears at 2px, moves to 4px). Frameless: `hover-invert` or `hover-underline`. Elements of 24px or less, fields and cells of a group: `hover-thicken` (the line thickens by 1px, inside). Never a tone behind text |
| G4 | Impact | Every click or validation | `data-[impact]:animate-hit` + `<ImpactLines />` + `withImpact(onClick)` / `punch(el)`. Without JavaScript the press still hits: explicit pressed negative, `press` (2px offset) and the lines while `:active` |
| G5 | Pop | Whatever appears | `animate-pop` (0.9 → 1.05 → 1). Important windows: `<FocusFlash />`. Panels that slide: `animate-slide-in`; content that unfolds: `animate-drop-in` |
| G6 | Bubble | Whatever floats and points | Tooltip / popover / hover card: a bubble with a tail (`<BubbleTail />`). Lists and menus: `ink-case case-notch` (notch toward the trigger, from `data-side`) |
| G7 | Running line | Progress, waiting, value | `fill-lines`; waiting: `Spinner` (`animate-spin-steps`) |
| G8 | Mark | Status and emotion | Error: `mark-error`, `edge-jagged` (32px+), `animate-shake`. New: `shape-burst`. Done: `mark-check`. Brush shapes: `mark-chevron`, `mark-arrow`. Manpu marks |

Disabled is not a gesture and does not change: dashed line, tone frame, label on paper, not-allowed cursor.

**Control rule:** if a component needs something the grammar does not cover, do not invent it silently:
write it in "Special cases" below and flag it.

### Special cases

Accepted in the pilot (now covered by G3's third case): tabs `index` hover is a heavier top line; switch,
checkbox, radio, fields and the cells of a group thicken their line on hover; G5 has sliding
(`animate-slide-in`, `animate-sheet-in`) and unfolding (`animate-drop-in`) variants; G4 lives in the
`gestures` item.

Flagged in the second batch, waiting for a decision:

- **Round shapes:** Radio Group items are diamonds and Avatars are squares, because only speech bubbles are
  round in this kit.
- **Spinner** does not wrap the stock one (an icon): it draws its own concentration lines, same props.
- **Choice cards** (Field): checked is a 6px ink bar at the start, like a selected table row, not a full ink
  flat, because the card holds a control and text that would all have to invert.
- **Empty** uses a solid line where stock shadcn uses dashes: dashes mean "disabled" here.
- **Stepper:** the rail ahead of the current step is a fine solid line, for the same reason.
- **Sheet:** its shadow is an offset second frame on the open side, not a tone block.
- **Alert Dialog:** Action and Cancel are the stock elements drawn with `buttonClassName()`; they hit on
  click but have no burst focus (no shout variant there).
- **Bubble (chat):** `default` is an ink bubble (your own messages); the others are paper bubbles.

## Style rules

- **Two values plus one accent**: ink (near black) and paper (warm white); dark mode is the negative.
  One accent, `--mg-accent` (stamp red by default; presets `data-accent="indigo|pine|ochre"`), used for
  destructive actions, errors and rare highlights. It also drives `--destructive`.
- **Variables**: `--background` paper, `--foreground` ink, `--primary` ink, `--primary-foreground` paper,
  `--border` ink, `--ring` ink, `--destructive` accent, `--radius: 0`. `--muted` / `--secondary` are paper.
- **Line**: 2 px by default (`border-ink`), 3 px for panels and windows (`border-ink-panel`), 1 px for details
  (`border-ink-fine`). Sharp corners. Only speech bubbles are round.
- **Tones replace grey**: `tone-10/20/35/50` (dots at 45°), `tone-lines`, `tone-cross`, `tone-fade-*`,
  `tone-frame`. Never opacity, never a smooth gradient to shade.
- **Shadows**: no blur, ever. A shadow is an offset block of tone (`tone-shadow`). No solid black offset
  shadow with bright colours: that is neo-brutalism, not this kit.
- **Selected / active / checked**: a flat of ink with paper text (`ink-fill`).
- **Energy**: `speed-lines`, `focus-lines`, `shape-burst` — around content, never under a label.
- **Type**: reading face for body and fields (`font-sans`), lettering face for titles, buttons, badges
  (`font-letter`), SFX face that covers katakana (`font-sfx`). Google Fonts, OFL only.
- **Motion**: stepped, ~12 fps, 80–240 ms. Pressed controls show an explicit negative (not a filter).
  Shake on error. With `prefers-reduced-motion` no animation, but every state stays distinct.

### Rule A — a label never sits on a tone or under lines

Reading text rests on a flat (paper or ink). Tones and lines live around it: in the shadow, as an inner
frame (`tone-frame`), as a band on an edge, or behind a plate (`on-tone`: paper, 2 px / 6 px). The
`knockout` text outline is only for very heavy SFX lettering.

### Rule B — hover and disabled never look alike

Light tone + dashed border = disabled, and nothing else. Hover = inversion, a flat, a thicker line or a
tone shadow that appears/shifts — never a background tone. Disabled keeps the label on paper, AA contrast,
`cursor: not-allowed`.

### Rule C — no screentone inside an element smaller than 24 px

Under 24 px a tone is noise. Use line weight, dashes and flats (checkbox, switch, small badges). Serrated
edges (`edge-jagged`) only on elements 32 px tall and up.

### States every interactive component must show

| State | Look |
| --- | --- |
| hover | tone shadow appears or shifts, inversion, or a thicker line |
| pressed | 2 px offset + negative (visible on paper and on ink) |
| focus-visible | double line ink / paper / ink (`focus-ink`), following the shape |
| disabled | dashed border + tone frame, label on paper, not-allowed cursor |
| selected / checked | ink flat (`ink-fill`) |
| error | accent colour, serrated edge (32 px+), a "!" mark |
| loading | concentration lines turning in steps (`Spinner`) |

### Reading order and writing direction

- **Manga reading order** (`data-reading="rtl"`, `reading-rtl:` variant): panels, bubbles, carousels and
  pagination flow right to left; English text stays left to right. The showcase toggle drives this.
- **Writing direction** (`dir="rtl"`, Arabic or Hebrew): supported with logical properties
  (`ms-`, `pe-`, `start-`), tested separately (`?dir=rtl`).

### Accessibility

AA contrast everywhere. A tone never carries information alone. Keyboard and ARIA behaviour come from
shadcn: do not override them. Decorative onomatopoeia are `aria-hidden`.

## Webtoon

The colour webtoon theme is paused (kept on the `theme/webtoon` branch). Webtoon components (vertical
strip, episode list, series card) are still planned, drawn in ink.
