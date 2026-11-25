// Builds registry.json from registry/index.json and one file per item (registry/items/<name>.json).
// Never edit registry.json by hand: edit the item's own file, and list new files in index.json "include".
//   node scripts/assemble-registry.mjs          assemble
//   node scripts/assemble-registry.mjs --split  one-off: split an existing registry.json into item files
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"

const INDEX = "registry/index.json"
const DIR = "registry/items"
const json = (p) => JSON.parse(readFileSync(p, "utf8"))
const write = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2) + "\n")

if (process.argv.includes("--split")) {
  const registry = json("registry.json")
  mkdirSync(DIR, { recursive: true })
  const { items, ...head } = registry
  for (const item of items) write(`${DIR}/${item.name}.json`, item)
  write(INDEX, { ...head, include: items.map((i) => `${DIR}/${i.name}.json`) })
  console.log(`split: ${items.length} item files`)
  process.exit(0)
}

const { include, ...head } = json(INDEX)
const items = include.map((path) => {
  if (!existsSync(path)) throw new Error(`${INDEX} includes a missing file: ${path}`)
  const item = json(path)
  const expected = `${DIR}/${item.name}.json`
  if (path !== expected) throw new Error(`${path}: the file must be named after the item (${expected})`)
  return item
})
const listed = new Set(include)
const waiting = readdirSync(DIR).filter((f) => f.endsWith(".json") && !listed.has(`${DIR}/${f}`))
write("registry.json", { ...head, items })
console.log(`registry.json: ${items.length} items${waiting.length ? `; not included yet: ${waiting.join(", ")}` : ""}`)
