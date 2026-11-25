# Contributing to mangacn

Thanks for helping. mangacn redraws shadcn/ui in ink and screentone. Every component follows one visual grammar,
so the bar for a change is: does it read as the same manga, at 375 px and at 1440 px, in light and dark, with
Radix and with Base UI?

## Before you start

- Read [AGENTS.md](AGENTS.md). It is written for coding agents, but it is the full rulebook: the eight gestures,
  rules A/B/C, the style rules, the pitfalls and the per-item layout. A change that breaks a rule there is sent
  back, however good it looks.
- For a new component or a new look, open an issue first ("Component request"). A new visual rule is never
  invented in a pull request; it is agreed in an issue and then written into AGENTS.md.

## Setup

Node 22 or later.

```bash
git clone https://github.com/Romcharted/mangacn.git
cd mangacn
npm install
npm run dev        # the showcase, with hot reload
```

| Command | What it does |
| --- | --- |
| `npm run sync` | Rebuilds the `base` item from `registry/manga/base/mangacn.css`, assembles `registry.json`, writes `llms.txt` and the README list |
| `npm run typecheck` | TypeScript |
| `npm run check` | Every item complete: files, meta, demo, llms.txt, README, built JSON |
| `npm run build` | sync + typecheck + site build + `shadcn build` |
| `npm run shots` | Screenshots at 375/800/1280/1440 px, light and dark; reports horizontal overflow |

Never edit `registry.json`, `registry/items/base.json` or `llms.txt` by hand: they are generated.

## Where things go

| What | Where |
| --- | --- |
| A restyled shadcn component (thin wrapper over the user's own `@/components/ui/<name>`) | `registry/manga/ui/<name>.tsx` |
| A manga piece (bubbles, panels, SFX…) | `registry/manga/signature/<name>.tsx` |
| A full interface (`registry:block`) | `registry/manga/blocks/<slug>/<slug>.tsx` |
| The item description (install target, docs, props, tagline) | `registry/items/<name>.json`, listed in `registry/index.json` |
| The showcase demo (`Preview`, `States`, `Thumb`) | `site/src/demos/<name>.tsx` |
| Tokens, utilities, keyframes | `registry/manga/base/mangacn.css`, then `npm run sync` |

## Checklist for a pull request

- [ ] Designed at 375 px first, then widened. No horizontal overflow at 360, 375, 414 px (portrait and landscape).
- [ ] Works with Base UI **and** Radix: no prop that exists in only one of them (`render`, `asChild`, Radix `type`).
- [ ] Literal Tailwind classes only; no `in-*` variants; `cn` does not merge classes, so variants are props.
- [ ] Tones instead of grey, no opacity, no blur, sharp corners (only speech bubbles are round).
- [ ] Hover never looks like disabled; no tone behind text; no tone under 24 px.
- [ ] Keyboard: visible focus on every control (restate `outline-solid!` over stock classes), focus stays inside
      segments; touch: small controls carry `touch-hit`.
- [ ] Reduced motion: only base animations, which stop under `prefers-reduced-motion`.
- [ ] `States` shows every variant × state (rest, hover, focus, pressed, disabled, error, loading as relevant).
- [ ] `npm run build` and `npm run check` pass.
- [ ] No copied artwork, characters or panels: demo art is drawn for the kit.
- [ ] Commits follow the conventional format (`feat(tabs): …`, `fix(select): …`), one component per commit.

## Reporting a bug

Use the "Bug report" template. Say which library (Radix or Base UI), which framework (Next or Vite), the
component, the browser and the width. A screenshot helps more than a description.

## License

By contributing you agree that your work is released under the [MIT license](LICENSE).
