// node scripts/check-items.mjs — every registry item is complete: files on disk, meta, llms.txt entry,
// README row, built r/<name>.json, a showcase demo (fonts share one). Run after `npm run build`.
// node scripts/check-items.mjs <name> [<name>…] — draft check of item files not assembled yet
// (registry/items/<name>.json, its files, its demo): what a subagent runs before handing back.
import { existsSync, readFileSync } from "node:fs"

const only = process.argv.slice(2)
const draft = only.length > 0
const registry = draft
  ? { items: only.map((n) => JSON.parse(readFileSync(`registry/items/${n}.json`, "utf8"))) }
  : JSON.parse(readFileSync("registry.json", "utf8"))
const known = new Set([...registry.items.map((i) => i.name), ...JSON.parse(readFileSync("registry/index.json", "utf8")).include.map((f) => f.replace(/^.*\/(.+)\.json$/, "$1"))])
const llms = readFileSync("site/public/llms.txt", "utf8")
const readme = readFileSync("README.md", "utf8")
const built = existsSync("site/dist/r/registry.json") ? JSON.parse(readFileSync("site/dist/r/registry.json", "utf8")) : null
const problems = []
const names = new Set()

for (const item of registry.items) {
  const n = item.name
  const say = (m) => problems.push(`${n}: ${m}`)
  if (names.has(n)) say("duplicate name")
  names.add(n)
  for (const k of ["title", "description", "type"]) if (!item[k]) say(`no ${k}`)
  if (!item.categories?.length) say("no category")
  if (!item.meta?.tagline) say("no meta.tagline")
  if (item.type !== "registry:font" && !item.meta?.usage) say("no meta.usage")
  for (const f of item.files ?? []) if (!existsSync(f.path)) say(`missing file ${f.path}`)
  for (const d of item.registryDependencies ?? [])
    if (d.startsWith("Romcharted/mangacn/") && !known.has(d.split("/").pop()) && !existsSync(`registry/items/${d.split("/").pop()}.json`)) say(`unknown dependency ${d}`)
  for (const f of item.files ?? []) if (!f.target) say(`file ${f.path} has no target`)
  if (!draft) {
    if (!llms.includes(`### ${item.title} (\`${n}\`)`)) say("not in llms.txt")
    if (!readme.includes(`| \`${n}\` |`)) say("not in README")
    if (!existsSync(`site/dist/r/${n}.json`)) say("no built r/<name>.json")
  }
  // Fonts share one demo; interfaces (registry:block) are rendered by the Examples page.
  const demo = item.type === "registry:font" || item.type === "registry:block" || existsSync(`site/src/demos/${n}.tsx`)
  if (!demo) say("no showcase demo")
}
if (!draft && built && built.items.length !== registry.items.length) problems.push(`built registry has ${built.items.length} items`)
if (!draft && built?.items.some((i) => i.files?.some((f) => "content" in f))) problems.push("built registry.json has file content")
const count = (llms.match(/^### /gm) ?? []).length
if (!draft && count !== registry.items.length) problems.push(`llms.txt has ${count} entries`)

console.log(problems.length ? problems.join("\n") : `${registry.items.length} items: complete${draft ? " (draft check)" : ""}`)
process.exit(problems.length ? 1 : 0)
