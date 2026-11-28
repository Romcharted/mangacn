# Submitting mangacn to the shadcn registry directory

Prepared, **not sent**. The directory is listed at <https://ui.shadcn.com/docs/directory>; the process is on
<https://ui.shadcn.com/docs/registry/registry-index>.

> The site is live at `https://mangacn.romain-sonnet.fr/`, deployed with Coolify (see [deploy.md](deploy.md)). The
> build reads the same address from `SITE_URL`.

## What shadcn asks

1. Add the registry to `apps/v4/registry/directory.json` in `shadcn-ui/ui`.
2. Run `pnpm validate:registries`.
3. Open a pull request to <https://github.com/shadcn-ui/ui>. The team reviews it; once merged the registry is
   listed at once.

| Requirement | mangacn |
| --- | --- |
| Open source and publicly reachable | MIT, public repo. Reachable once the Hostinger site is up at `https://mangacn.romain-sonnet.fr/`. |
| A valid `registry.json` that follows the schema | `shadcn build` passes on every push (`Build` workflow). |
| Flat registry: `/registry.json` and `/<item>.json` at the registry root | Root `https://mangacn.romain-sonnet.fr/r/`: `registry.json` + 100 item files (92 items, 8 interfaces). |
| `files` without `content` in `registry.json` | Checked on the build. |
| Namespace `@` + letters, digits, `-`, `_`; unique | `@mangacn`. Re-check it is still free on the day you send. |
| Entry fields: `name`, `homepage`, `url` with `{name}`, `description`, `logo`, optional `author` | See [directory-entry.json](directory-entry.json). |

The logo is an inline SVG string using `var(--foreground)` and `var(--background)`, like most entries, so it
follows the directory's theme: an ink case with a paper impact burst.

## The entry

Insert it in alphabetical order (between the entries around `@m…`):

```json
{
  "name": "@mangacn",
  "homepage": "https://mangacn.romain-sonnet.fr/",
  "url": "https://mangacn.romain-sonnet.fr/r/{name}.json",
  "description": "shadcn/ui, inked like a manga. The whole set redrawn in ink and screentone, manga pieces (speech bubbles, panels, speed lines, SFX) and 8 full interfaces. Radix or Base UI.",
  "author": "Romcharted",
  "logo": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' fill='var(--foreground)'/><polygon points='12.0,3.8 13.3,8.0 16.0,6.2 15.5,9.4 20.1,8.7 16.6,11.7 19.7,13.5 16.2,14.3 18.5,18.0 14.5,16.3 14.0,19.2 12.0,17.0 9.4,21.1 9.5,16.3 6.0,17.6 7.8,14.3 3.7,13.6 7.4,11.7 5.4,9.4 8.5,9.4 7.3,5.0 10.7,8.0' fill='var(--background)'/></svg>"
}
```

## Before opening the pull request

- [ ] The Hostinger site is up and these answer 200 with `Content-Type: application/json` for the JSON:
  - `https://mangacn.romain-sonnet.fr/`
  - `https://mangacn.romain-sonnet.fr/r/registry.json`
  - `https://mangacn.romain-sonnet.fr/r/button.json`
  - `https://mangacn.romain-sonnet.fr/llms.txt`
- [ ] In a fresh shadcn project, with `"registries": { "@mangacn": "https://mangacn.romain-sonnet.fr/r/{name}.json" }` in
      `components.json`: `npx shadcn@latest add @mangacn/button` works, and so does `@mangacn/dashboard`.
- [ ] README, `docs/directory-entry.json`, the MCP config in the AI panel and `llms.txt` all show `https://mangacn.romain-sonnet.fr`.
- [ ] A `v0.1.0` tag and GitHub release exist (see [CHANGELOG.md](../CHANGELOG.md)).

## Steps

```bash
gh repo fork shadcn-ui/ui --clone
cd ui
git switch -c registry/mangacn
# add the entry above to apps/v4/registry/directory.json, in alphabetical order
pnpm install
pnpm validate:registries
git commit -am "feat(registry): add @mangacn"
gh pr create --title "Add @mangacn to the registry directory" --body-file ../mangacn/docs/directory-pr.md
```

The pull request text is ready in [directory-pr.md](directory-pr.md).
