# mangacn

shadcn/ui, inked like a manga. An open source [shadcn registry](https://ui.shadcn.com/docs/registry) that
redraws shadcn/ui in ink and screentone — black and white, sharp lines, tones instead of grey, speed lines —
with a second, soft and colourful **webtoon** theme.

It does not fork shadcn. Each restyled component is a thin file that imports **your** shadcn component,
adds classes and `data-*` attributes, and re-exports it. Works with shadcn on Radix or on Base UI.

> Status: early work in progress. Only the `base` item exists so far.

## Install

You need a project already set up with shadcn (`npx shadcn@latest init`). Then add any item straight from GitHub:

```bash
npx shadcn@latest add Romcharted/mangacn/base
```

Every item depends on `base` (tokens, screentone utilities, animations), which the CLI installs for you.
Restyled components go to `components/ui/manga/<name>.tsx` (your `ui` alias + `/manga`).

Browse the catalogue from the CLI:

```bash
npx shadcn@latest list Romcharted/mangacn
npx shadcn@latest search Romcharted/mangacn --query bubble
```

### Webtoon theme and dark mode

- Dark mode uses shadcn's `.dark` class. In the manga theme it is the negative of the page.
- Add `data-theme="webtoon"` to `<html>` (or to any subtree) for the webtoon theme.
- Reading direction follows `dir="rtl"`.

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
