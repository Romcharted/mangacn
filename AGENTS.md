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
registry.json                 # source of truth (items, descriptions, docs, meta.usage, meta.props)
registry/manga/base/          # mangacn.css -> synced into the `base` item
registry/manga/ui/            # restyled shadcn components (thin wrappers)
registry/manga/signature/     # manga components (SpeechBubble, Screentone, ...)
registry/manga/webtoon/       # webtoon components
registry/manga/blocks/        # demo blocks
site/                         # one-page showcase (Vite + React 19 + Tailwind v4)
site/src/demos/<item>.tsx     # optional `Preview` and `States` exports, found by file name
scripts/                      # sync-base, llms.txt, screenshots
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Showcase dev server |
| `npm run sync` | `mangacn.css` -> `base` item, then `site/public/llms.txt` |
| `npm run typecheck` | `tsc` |
| `npm run build` | sync + typecheck + site build + `shadcn build` into `site/dist/r` |
| `npm run shots` | Screenshots of the built site in light and dark (`-- --all` adds webtoon, RTL, mobile) |

Never edit the `css` / `cssVars` of the `base` item by hand: edit `registry/manga/base/mangacn.css`
and run `npm run sync`.

## Adding a restyled shadcn component

1. Install the stock component in the showcase: `npx shadcn@latest add <name>` (lands in `site/src/components/ui`).
2. Write `registry/manga/ui/<name>.tsx`: import from `@/components/ui/<name>`, add classes and `data-*`
   attributes, re-export the same API. Do not use props that only exist in Radix or only in Base UI.
3. Add the item to `registry.json`:
   ```json
   {
     "name": "<name>",
     "type": "registry:ui",
     "title": "...",
     "description": "What it is, when to use it, its variants.",
     "categories": ["actions"],
     "registryDependencies": ["<name>", "Romcharted/mangacn/base"],
     "files": [{ "path": "registry/manga/ui/<name>.tsx", "type": "registry:ui", "target": "@ui/manga/<name>.tsx" }],
     "docs": "One or two lines shown after install.",
     "meta": { "usage": "<minimal tsx>", "props": [{ "name": "variant", "type": "...", "default": "...", "description": "..." }] }
   }
   ```
   A bare name (`button`) is the official shadcn item. An item from this repo is always `Romcharted/mangacn/<item>`.
4. Add `site/src/demos/<name>.tsx` exporting `Preview` (live) and `States` (every variant × state, frozen).
5. `npm run build && npm run shots`, look at the screenshots, then commit (one commit per component).

Categories (first one decides the showcase section): `foundations`, `actions`, `feedback`, `overlays`,
`navigation`, `display`, `manga`, `webtoon`, `blocks`.

## Style rules (manga theme, the default)

- **Two values**: ink (near black) and paper (warm white). Dark mode is the negative. One accent only:
  stamp red, reserved for destructive actions and rare highlights.
- **Variables**: `--background` paper, `--foreground` ink, `--primary` ink, `--primary-foreground` paper,
  `--border` ink, `--ring` ink, `--destructive` red, `--radius: 0`. `--muted` / `--secondary` are paper:
  muted surfaces get light screentone, never grey.
- **Line**: 2 px by default (`border-ink`), 3 px for panels and windows (`border-ink-panel`), 1 px for details
  (`border-ink-fine`). Sharp corners. Only speech bubbles are round.
- **Tones replace grey**: `tone-10/20/35/50` (dots at 45°), `tone-lines`, `tone-cross`, `tone-fade-r/l/t/b`.
  Never opacity, never a smooth gradient to shade. Tones are coloured by `--tone-ink` (defaults to `currentColor`).
  Text on a tone gets an automatic paper knockout; keep text on `tone-50` short and large.
- **Shadows**: no blur, ever. A shadow is an offset block of tone (`tone-shadow`, needs a positioned element).
  No solid black offset shadow with bright colours: that is neo-brutalism, not this kit.
- **Selected / active / checked**: a flat of ink with paper text (`ink-fill`).
- **Energy**: `speed-lines` (parallel) and `focus-lines` (radial) as emphasis backgrounds; `shape-burst` for calls to action.
- **Type**: reading face for body and fields (`font-sans`), lettering face for titles, buttons, badges
  (`font-letter`, also `font-heading`), SFX face that covers katakana (`font-sfx`). Google Fonts, OFL only.
- **Motion**: stepped (`steps()` / `step-end`), ~12 fps, 80–240 ms. Impact frame = negative image on press
  (`animate-impact`). Short shake on error (`animate-shake`). With `prefers-reduced-motion` no animation at
  all, but every state must stay visually distinct.

### States every interactive component must show

| State | Look |
| --- | --- |
| hover | a tone or speed lines appear, or ink/paper invert |
| pressed | 2 px offset + impact frame |
| focus-visible | double line ink / paper / ink (`focus-ink`), visible in light and dark |
| disabled | dashed border + light tone, text still readable |
| selected / checked | ink flat (`ink-fill`) |
| error | stamp red, jagged edge (`edge-jagged`), a "!" mark |
| loading | focus lines turning in steps (`animate-spin-steps`) |

### Accessibility

AA contrast everywhere. A tone never carries information alone. Keyboard and ARIA behaviour come from
shadcn: do not override them. Full `dir="rtl"` support: use logical properties (`ms-`, `pe-`, `start-`).
Decorative onomatopoeia are `aria-hidden`.

## Webtoon theme

`data-theme="webtoon"` on `<html>` (or any subtree). Same components, other variables: colour, 12 px
radius, thin or no borders, soft colour flats instead of tones (`--tone-solid: 1`), soft shadows allowed,
borderless bubbles. Original palette (violet + peach), not taken from any platform.
