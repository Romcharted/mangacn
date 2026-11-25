# Submitting mangacn to the shadcn registry directory

Prepared, **not sent**. The directory is listed at <https://ui.shadcn.com/docs/directory>; the process is on
<https://ui.shadcn.com/docs/registry/registry-index> (read on 2026-11-25).

## What shadcn asks

1. Add the registry to `apps/v4/registry/directory.json` in `shadcn-ui/ui`.
2. Run `pnpm validate:registries`.
3. Open a pull request to <https://github.com/shadcn-ui/ui>. The team reviews it; once merged the registry is
   published at once.

Requirements, and where mangacn stands:

| Requirement | mangacn |
| --- | --- |
| Open source and publicly reachable | MIT, public repo. **Reachable only once GitHub Pages is on** (404 today). |
| A valid `registry.json` that follows the schema | `shadcn build` passes; `r/registry.json` is published next to the items. |
| Flat registry: `/registry.json` and `/<item>.json` at the registry root | Root is `https://romcharted.github.io/mangacn/r/`: `registry.json` + 50 item files. |
| `files` in `registry.json` without `content` | 46 files, none with `content` (checked on the build). |
| Namespace `@` + letters, digits, `-`, `_`; unique | `@mangacn`, free among the 613 current entries. |
| Entry fields (strict schema): `name`, `homepage`, `url` with `{name}`, `description`, `logo`, optional `author` | See [directory-entry.json](directory-entry.json); passes the same rules, checked by hand-written script. |

No rule is written for the logo. Current entries use an inline SVG string, most with `var(--foreground)` so it
follows the directory's theme. Ours: an ink case with a paper impact burst, `var(--foreground)` and
`var(--background)`, 367 characters.

## The entry

Insert it between `@magicui` and `@manifest` (the file is roughly alphabetical):

```json
{
  "name": "@mangacn",
  "homepage": "https://romcharted.github.io/mangacn/",
  "url": "https://romcharted.github.io/mangacn/r/{name}.json",
  "description": "shadcn/ui, inked like a manga. Your components redrawn in ink and screentone, plus speech bubbles, panels, speed lines and SFX. Radix or Base UI.",
  "author": "Romcharted",
  "logo": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' fill='var(--foreground)'/><polygon points='12.0,3.8 13.3,8.0 16.0,6.2 15.5,9.4 20.1,8.7 16.6,11.7 19.7,13.5 16.2,14.3 18.5,18.0 14.5,16.3 14.0,19.2 12.0,17.0 9.4,21.1 9.5,16.3 6.0,17.6 7.8,14.3 3.7,13.6 7.4,11.7 5.4,9.4 8.5,9.4 7.3,5.0 10.7,8.0' fill='var(--background)'/></svg>"
}
```

`author` is optional: drop it or change it as you like.

## Before opening the pull request

- [ ] GitHub Pages on (Settings → Pages → Source: GitHub Actions) and the `Deploy showcase` workflow green.
- [ ] These answer 200:
  - <https://romcharted.github.io/mangacn/>
  - <https://romcharted.github.io/mangacn/r/registry.json>
  - <https://romcharted.github.io/mangacn/r/button.json>
- [ ] In a fresh shadcn project, with `"@mangacn": "https://romcharted.github.io/mangacn/r/{name}.json"` in
      `components.json`: `npx shadcn@latest add @mangacn/button` works.

## Steps

```bash
gh repo fork shadcn-ui/ui --clone
cd ui
git switch -c registry/mangacn
# paste the entry into apps/v4/registry/directory.json, between @magicui and @manifest
pnpm install
pnpm validate:registries
git commit -am "feat(directory): add @mangacn"
git push -u origin registry/mangacn
gh pr create --repo shadcn-ui/ui --title "feat(directory): add @mangacn" --body-file pr-body.md
```

## Pull request text

**Title:** `feat(directory): add @mangacn`

**Body:**

> Adds **@mangacn** to the registry directory.
>
> mangacn redraws shadcn/ui in a manga style: ink, paper, screentone, speed lines and one accent colour. It
> doesn't fork shadcn. Each restyled component is a thin wrapper that imports the project's own
> `@/components/ui/<name>`, adds classes and `data-*` attributes, and re-exports it with the same props, on
> Radix or on Base UI. It also has manga pieces (speech bubbles, panels, screentone, speed lines, SFX,
> stamps).
>
> - Homepage: https://romcharted.github.io/mangacn/
> - Registry: https://romcharted.github.io/mangacn/r/registry.json (50 items, flat, no `content` in `files`)
> - Source: https://github.com/Romcharted/mangacn (MIT)
> - `llms.txt`: https://romcharted.github.io/mangacn/llms.txt
>
> `pnpm validate:registries` passes.
