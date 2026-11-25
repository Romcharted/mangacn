import type { ComponentType } from "react"
import index from "../../registry/index.json"

export const REPO = "Romcharted/mangacn"
export const GITHUB_URL = `https://github.com/${REPO}`
export const installCommand = (name: string) => `npx shadcn@latest add ${REPO}/${name}`

export type Prop = { name: string; type: string; default?: string; description: string }
export type Item = {
  name: string
  type: string
  title: string
  description: string
  categories: string[]
  meta?: { tagline?: string; usage?: string; props?: Prop[] }
}

/** Section order and labels on the page. Items themselves come only from registry.json. */
export const CATEGORIES: Record<string, string> = {
  foundations: "Foundations",
  actions: "Actions & input",
  feedback: "Feedback",
  overlays: "Overlays",
  navigation: "Navigation",
  display: "Display",
  manga: "Manga",
  webtoon: "Webtoon",
  blocks: "Blocks",
}

const order = Object.keys(CATEGORIES)
const cat = (i: Item) => i.categories[0] ?? "other"

/*
 * One file per item (registry/items/<name>.json). Items listed in registry/index.json come in that
 * order; an item not listed yet (work in progress) still shows, after the others, so it can be checked
 * in the showcase before it is assembled into registry.json.
 */
const itemFiles = import.meta.glob<Item>("../../registry/items/*.json", { eager: true, import: "default" })
const position = (path: string) => {
  const at = index.include.indexOf(path.replace(/^(\.\.\/)+/, ""))
  return at < 0 ? 1e6 : at
}
const all = Object.entries(itemFiles)
  .sort(([a], [b]) => position(a) - position(b) || a.localeCompare(b))
  .map(([, item]) => item)

/** Items in page order: by category, then as listed in registry/index.json. */
export const items = all
  .map((item, index) => ({ item, index }))
  .sort((a, b) => (order.indexOf(cat(a.item)) + 1 || 99) - (order.indexOf(cat(b.item)) + 1 || 99) || a.index - b.index)
  .map(({ item }) => item)

export const categories = order.filter((c) => items.some((i) => cat(i) === c && i.type !== "registry:block"))
export const categoryOf = cat

export type Demo = { Preview?: ComponentType; States?: ComponentType; Thumb?: ComponentType }
const demoModules = import.meta.glob<Demo>("./demos/*.tsx", { eager: true })
export const demos: Record<string, Demo> = Object.fromEntries(
  Object.entries(demoModules).map(([path, mod]) => [path.replace(/^.*\/(.+)\.tsx$/, "$1"), mod]),
)

export function filterItems(query: string, category: string | null) {
  const q = query.trim().toLowerCase()
  return items.filter(
    (i) =>
      i.type !== "registry:block" &&
      (!category || cat(i) === category) &&
      (!q || i.name.includes(q) || i.title.toLowerCase().includes(q)),
  )
}
