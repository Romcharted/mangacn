// node scripts/check-items.mjs — every registry item is complete: files on disk, meta, llms.txt entry,
// README row, built r/<name>.json, a showcase demo (fonts share one). Run after `npm run build`.
import { existsSync, readFileSync } from "node:fs"

const registry = JSON.parse(readFileSync("registry.json", "utf8"))
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
    if (d.startsWith("Romcharted/mangacn/") && !registry.items.some((i) => i.name === d.split("/").pop())) say(`unknown dependency ${d}`)
  if (!llms.includes(`### ${item.title} (\`${n}\`)`)) say("not in llms.txt")
  if (!readme.includes(`| \`${n}\` |`)) say("not in README")
  if (!existsSync(`site/dist/r/${n}.json`)) say("no built r/<name>.json")
  const demo = item.type === "registry:font" || existsSync(`site/src/demos/${n}.tsx`)
  if (!demo) say("no showcase demo")
}
if (built && built.items.length !== registry.items.length) problems.push(`built registry has ${built.items.length} items`)
if (built?.items.some((i) => i.files?.some((f) => "content" in f))) problems.push("built registry.json has file content")
const count = (llms.match(/^### /gm) ?? []).length
if (count !== registry.items.length) problems.push(`llms.txt has ${count} entries`)

console.log(problems.length ? problems.join("\n") : `${registry.items.length} items: complete`)
process.exit(problems.length ? 1 : 0)
