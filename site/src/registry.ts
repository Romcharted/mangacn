import type { ComponentType } from "react"
import registry from "../../registry.json"

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

/** Items in page order: by category, then as listed in registry.json. */
export const items = (registry.items as Item[])
  .map((item, index) => ({ item, index }))
  .sort((a, b) => (order.indexOf(cat(a.item)) + 1 || 99) - (order.indexOf(cat(b.item)) + 1 || 99) || a.index - b.index)
  .map(({ item }) => item)

export const categories = order.filter((c) => items.some((i) => cat(i) === c))
export const categoryOf = cat

export type Demo = { Preview?: ComponentType; States?: ComponentType; Thumb?: ComponentType }
const demoModules = import.meta.glob<Demo>("./demos/*.tsx", { eager: true })
export const demos: Record<string, Demo> = Object.fromEntries(
  Object.entries(demoModules).map(([path, mod]) => [path.replace(/^.*\/(.+)\.tsx$/, "$1"), mod]),
)

export function filterItems(query: string, category: string | null) {
  const q = query.trim().toLowerCase()
  return items.filter(
    (i) => (!category || cat(i) === category) && (!q || i.name.includes(q) || i.title.toLowerCase().includes(q)),
  )
}
