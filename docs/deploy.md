# Deploying the showcase (Hostinger)

The showcase is a static site: one HTML page, its assets, `llms.txt` and the registry files `r/*.json`
that the shadcn CLI and its MCP server read. Everything is in `site/dist` after a build, ready to upload.

## Build

```bash
npm ci
SITE_URL=https://your-domain.example/ BASE_PATH=/ npm run build
npm run check
```

| Variable | What it does | Default |
| --- | --- | --- |
| `SITE_URL` | Public address, written into the share tags (canonical, `og:url`, `og:image`). | none: those tags are left out, `og:image` stays relative |
| `BASE_PATH` | Where the site is served: `/` at the root of a domain, `/mangacn/` in a folder. | `./` (works anywhere: the site routes with the hash) |
| `VITE_UMAMI_SRC` | Umami script address. | `https://stats.romain-sonnet.fr/script.js` (`.env.production`) |
| `VITE_UMAMI_WEBSITE_ID` | Umami site id. Empty: no statistics script at all. | empty |

Put local values in `.env.production.local` (ignored by git), or pass them on the command line. CI reads
`SITE_URL` and `BASE_PATH` from the repository variables and keeps the build as the `mangacn-site` artifact.

## Upload

Copy the **contents** of `site/dist` (hidden `.htaccess` included) into `public_html/` — or into
`public_html/mangacn/` with `BASE_PATH=/mangacn/`. The `.htaccess` serves `.json` as JSON with an open CORS
header, caches hashed assets for good and keeps `index.html` fresh.

## After upload

These should answer 200:

- `SITE_URL`
- `SITE_URL` + `llms.txt`
- `SITE_URL` + `r/registry.json` and `r/button.json`
- `SITE_URL` + `og.png`

Then point the MCP namespace at the new address in `components.json`:

```json
{ "registries": { "@mangacn": "https://your-domain.example/r/{name}.json" } }
```

and update `homepage` in `registry.json`, the URLs in `README.md` and `docs/directory-entry.json`.
