# mangacn

shadcn/ui, inked like a manga. An open source [shadcn registry](https://ui.shadcn.com/docs/registry) that
redraws shadcn/ui in ink and screentone — black and white, sharp lines, tones instead of grey, speed lines —
with one accent colour you choose.

It does not fork shadcn. Each restyled component is a thin file that imports **your** shadcn component,
adds classes and `data-*` attributes, and re-exports it. Works with shadcn on Radix or on Base UI.

> Status: early work in progress. 50 items: `base`, three fonts, `gestures`; shadcn wrappers for Button, Input,
> Textarea, Label, Field, Select, Checkbox, Radio Group, Switch, Slider, Badge, Skeleton, Spinner, Progress, Sonner,
> Alert, Empty, Card, Tabs, Table, Accordion, Avatar, Separator, Pagination, Breadcrumb, Dialog, Alert Dialog,
> Sheet, Popover, Hover Card, Tooltip, Dropdown Menu, Bubble, Message; manga pieces SpeechBubble, Screentone,
> SpeedLines, Panel, Sfx, Manpu, Burst, Stamp, Banner, Stepper, Stat.

## The grammar

Every component applies the same eight gestures, written once in `base`: case (G1), flat (G2), hover (G3),
impact (G4), pop (G5), bubble (G6), running line (G7) and mark (G8), in steps at 12 frames per second, and
still with `prefers-reduced-motion`. See the Grammar page of the showcase and [AGENTS.md](AGENTS.md).

## Install

You need a project already set up with shadcn (`npx shadcn@latest init`). Then add any item straight from GitHub:

```bash
npx shadcn@latest add Romcharted/mangacn/base
```

Every item depends on `base` (tokens, screentone utilities, animations), which the CLI installs for you,
together with three Google Fonts under the SIL Open Font License: Atkinson Hyperlegible Next (reading),
Patrick Hand SC (lettering) and Dela Gothic One (SFX, covers katakana).
Restyled shadcn components go to `components/ui/manga/<name>.tsx` (your `ui` alias + `/manga`) and wrap your
own `components/ui/<name>`; manga components (speech bubble, screentone, speed lines) go to `components/manga/`.

Browse the catalogue from the CLI:

```bash
npx shadcn@latest list Romcharted/mangacn
npx shadcn@latest search Romcharted/mangacn --query bubble
```

### Dark mode, accent colour, reading order

- Dark mode uses shadcn's `.dark` class: the negative of the page.
- One accent colour, `--mg-accent` (stamp red by default). Presets: `data-accent="indigo"`, `"pine"`, `"ochre"`.
- Manga reading order: `data-reading="rtl"` on `<html>` and the `reading-rtl:` variant flip panels and
  bubbles right to left; text stays left to right. Writing direction (`dir="rtl"`) is supported separately.
- The colour webtoon theme is paused (branch `theme/webtoon`).

## Use with AI assistants

- `llms.txt` lists every item with its install command, main props and a minimal example:
  `https://romcharted.github.io/mangacn/llms.txt`.
- **shadcn MCP server.** The MCP server reads registries declared in `components.json`. Point a namespace
  at the JSON files this repo publishes on GitHub Pages:

  ```json
  {
    "registries": {
      "@mangacn": "https://romcharted.github.io/mangacn/r/{name}.json"
    }
  }
  ```

  then run `npx shadcn@latest mcp init --client claude` (or `cursor`, `vscode`, `codex`, `opencode`) and
  restart your assistant. Try: “Show me the components in the mangacn registry”, “Add the mangacn button”.
  With the namespace set, `npx shadcn@latest add @mangacn/<item>` works too.

## Develop

```bash
npm install
npm run dev        # showcase
npm run build      # sync base CSS + llms.txt, typecheck, build site and r/*.json
npm run shots      # screenshots of the built site (light and dark)
```

See [AGENTS.md](AGENTS.md) for conventions, how to add a component, and the style rules.

## License

[MIT](LICENSE). Fonts are loaded from Google Fonts under the SIL Open Font License.
Not affiliated with shadcn.
