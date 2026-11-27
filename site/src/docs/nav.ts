import { CATEGORIES, categoryOf, items, type Item } from "../registry"

/*
 * The documentation's left column, in order: Get started, Components by category, Manga by family,
 * Examples. Previous / next follow the same order (Get started, then Components, then Manga).
 */

export type DocLink = { title: string; route: string }
export type DocGroup = { title: string; links: DocLink[] }
export type DocSection = { title: string; id: string; groups: DocGroup[] }

export const GET_STARTED: (DocLink & { slug: string })[] = [
  { slug: "", title: "Introduction", route: "docs" },
  { slug: "installation", title: "Installation", route: "docs/installation" },
  { slug: "grammar", title: "Grammar", route: "docs/grammar" },
  { slug: "theming", title: "Theming and accent", route: "docs/theming" },
  { slug: "fonts", title: "Fonts", route: "docs/fonts" },
  { slug: "reading-direction", title: "Reading direction", route: "docs/reading-direction" },
  { slug: "ai", title: "For AI", route: "docs/ai" },
  { slug: "changelog", title: "Changelog", route: "docs/changelog" },
]

/** Components: the shadcn families, in this order (foundations last: tokens, fonts and helpers). */
export const COMPONENT_GROUPS = ["actions", "feedback", "overlays", "navigation", "display", "foundations"] as const
export const GROUP_TITLE: Record<string, string> = {
  actions: "Actions and input",
  feedback: "Feedback",
  overlays: "Overlays",
  navigation: "Navigation",
  display: "Display",
  foundations: "Foundations",
}

/** Manga pieces by family. Every item of the "manga" category is in exactly one list. */
export const MANGA_GROUPS: { id: string; title: string; names: string[] }[] = [
  {
    id: "page",
    title: "Page and panels",
    names: ["panel", "screentone", "speed-lines", "toned-image", "versus-panel", "scene-transition", "yonkoma", "manpu", "burst"],
  },
  {
    id: "lettering",
    title: "Lettering",
    names: ["speech-bubble", "bilingual-bubble", "typing-bubble", "sfx", "ruby", "vertical-text", "dialogue-box", "stamp"],
  },
  {
    id: "readers",
    title: "Readers",
    names: ["page-reader", "reader-strip", "guided-view", "reading-progress", "reader-settings", "page-thumbnails", "loading-screen", "chapter-end"],
  },
  {
    id: "catalogue",
    title: "Catalogue",
    names: ["volume-card", "shelf", "series-header", "ranking-list", "release-calendar", "magazine-cover", "obi-band", "character-card", "stat"],
  },
  {
    id: "story",
    title: "Story",
    names: ["chapter-title", "banner", "stepper", "spoiler", "reaction-picker", "impact-counter", "password-strength", "social-button"],
  },
]

export const componentRoute = (name: string) => `docs/components/${name}`

const byName = new Map(items.map((i) => [i.name, i]))
const link = (i: Item): DocLink => ({ title: i.title, route: componentRoute(i.name) })

/** The documented items (every item but the blocks, which are examples). */
export const docItems = items.filter((i) => i.type !== "registry:block")

/** The family of an item, for the sidebar, the breadcrumb and the index page. */
export function familyOf(item: Item): { section: "components" | "manga"; id: string; title: string } {
  const cat = categoryOf(item)
  if (cat === "manga" || cat === "webtoon") {
    const g = MANGA_GROUPS.find((g) => g.names.includes(item.name))
    return { section: "manga", id: g?.id ?? "story", title: g?.title ?? "Story" }
  }
  return { section: "components", id: cat, title: GROUP_TITLE[cat] ?? CATEGORIES[cat] ?? cat }
}

export function docSections(examples: { slug: string; title: string }[]): DocSection[] {
  const mangaNames = new Set(MANGA_GROUPS.flatMap((g) => g.names))
  // a manga item missing from MANGA_GROUPS still shows, under Story
  const stray = docItems.filter((i) => familyOf(i).section === "manga" && !mangaNames.has(i.name))
  return [
    { title: "Get started", id: "get-started", groups: [{ title: "", links: GET_STARTED }] },
    {
      title: "Components",
      id: "components",
      groups: [
        { title: "", links: [{ title: "All components", route: "docs/components" }] },
        ...COMPONENT_GROUPS.map((g) => ({
          title: GROUP_TITLE[g],
          links: docItems.filter((i) => categoryOf(i) === g).map(link),
        })).filter((g) => g.links.length),
      ],
    },
    {
      title: "Manga",
      id: "manga",
      groups: MANGA_GROUPS.map((g) => ({
        title: g.title,
        links: [
          ...g.names.flatMap((n) => (byName.has(n) ? [link(byName.get(n)!)] : [])),
          ...(g.id === "story" ? stray.map(link) : []),
        ],
      })),
    },
    {
      title: "Examples",
      id: "examples",
      groups: [{ title: "", links: examples.map((e) => ({ title: e.title, route: `examples/${e.slug}` })) }],
    },
  ]
}

/** Every documentation page in reading order, for previous / next (examples have their own pages). */
export function docOrder(): DocLink[] {
  return docSections([])
    .filter((s) => s.id !== "examples")
    .flatMap((s) => s.groups.flatMap((g) => g.links))
}
