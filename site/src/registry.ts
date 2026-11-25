import type { ComponentType } from "react"
import registry from "../../registry.json"

export const REPO = "Romcharted/mangacn"
export const GITHUB_URL = `https://github.com/${REPO}`
export const installCommand = (name: string) => `npx shadcn@latest add ${REPO}/${name}`

export type Prop = { name: string; type: string; default?: string; description: string }
export type Item = {
  name: string
  title: string
  description: string
  categories: string[]
  meta?: { usage?: string; props?: Prop[] }
}

/** Section order and labels on the page. Items themselves come only from registry.json. */
export const CATEGORIES: Record<string, string> = {
  foundations: "Foundations",
  actions: "Actions & input",
  feedback: "Feedback & status",
  overlays: "Overlays & menus",
  navigation: "Navigation",
  display: "Display",
  manga: "Manga",
  webtoon: "Webtoon",
  blocks: "Blocks",
}

export const items = registry.items as Item[]

export type Demo = { Preview?: ComponentType; States?: ComponentType }
const demoModules = import.meta.glob<Demo>("./demos/*.tsx", { eager: true })
export const demos: Record<string, Demo> = Object.fromEntries(
  Object.entries(demoModules).map(([path, mod]) => [path.replace(/^.*\/(.+)\.tsx$/, "$1"), mod]),
)

export function grouped(filter: string) {
  const q = filter.trim().toLowerCase()
  const visible = items.filter(
    (i) => !q || i.name.includes(q) || i.title.toLowerCase().includes(q),
  )
  const known = Object.keys(CATEGORIES)
  const cats = [...new Set(visible.map((i) => i.categories[0] ?? "other"))].sort(
    (a, b) => (known.indexOf(a) + 1 || 99) - (known.indexOf(b) + 1 || 99),
  )
  return cats.map((c) => ({
    id: c,
    label: CATEGORIES[c] ?? c,
    items: visible.filter((i) => (i.categories[0] ?? "other") === c),
  }))
}
